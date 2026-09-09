// ============================================
// EA MARKETPLACE - MAIN APPLICATION
// Central data management and routing
// ============================================

const App = {
    // Data Storage Keys
    STORAGE_KEYS: {
        PRODUCTS: 'ea_products',
        CONVERSATIONS: 'ea_conversations',
        ORDERS: 'ea_orders',
        CUSTOMERS: 'ea_customers',
        SESSION: 'ea_session',
        NOTIFICATIONS: 'ea_notifications',
        COMPARISON: 'ea_comparison'
    },
    
    // Initialize Application
    init() {
        this.initializeProducts();
        this.initializeSession();
        this.updateNavigation();
        this.updateChatButton();
        this.loadNotifications();
    },
    
    // Initialize Products from Data
    initializeProducts() {
        let products = StorageUtil.get(this.STORAGE_KEYS.PRODUCTS);
        
        if (!products || products.length === 0) {
            products = DEMO_DATA.products;
            StorageUtil.set(this.STORAGE_KEYS.PRODUCTS, products);
        }
        
        return products;
    },
    
    // Get All Products
    getProducts() {
        return StorageUtil.get(this.STORAGE_KEYS.PRODUCTS) || [];
    },
    
    // Get Product by Slug
    getProductBySlug(slug) {
        const products = this.getProducts();
        return products.find(p => p.slug === slug);
    },
    
    // Get Product by ID
    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    },
    
    // Update Product
    updateProduct(productId, updates) {
        let products = this.getProducts();
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            StorageUtil.set(this.STORAGE_KEYS.PRODUCTS, products);
            return true;
        }
        
        return false;
    },
    
    // Initialize Session
    initializeSession() {
        const session = StorageUtil.get(this.STORAGE_KEYS.SESSION);
        
        if (!session) {
            StorageUtil.set(this.STORAGE_KEYS.SESSION, {
                isLoggedIn: false,
                user: null,
                isAdmin: false
            });
        }
    },
    
    // Get Session
    getSession() {
        return StorageUtil.get(this.STORAGE_KEYS.SESSION) || {
            isLoggedIn: false,
            user: null,
            isAdmin: false
        };
    },
    
    // Login User
    loginUser(email, password) {
        const customers = this.getCustomers();
        const user = customers.find(c => c.email === email && c.password === password);
        
        if (user) {
            const session = {
                isLoggedIn: true,
                user: user,
                isAdmin: false
            };
            StorageUtil.set(this.STORAGE_KEYS.SESSION, session);
            this.updateNavigation();
            return { success: true, user: user };
        }
        
        return { success: false, error: 'Invalid credentials' };
    },
    
    // Register User
    registerUser(name, email, password) {
        const customers = this.getCustomers();
        
        // Check if email already exists
        if (customers.find(c => c.email === email)) {
            return { success: false, error: 'Email already registered' };
        }
        
        const newUser = {
            id: customers.length + 1,
            name: name,
            email: email,
            password: password, // In production, this would be hashed
            registrationDate: new Date().toISOString(),
            totalSpent: 0,
            orders: 0,
            conversations: 0
        };
        
        customers.push(newUser);
        StorageUtil.set(this.STORAGE_KEYS.CUSTOMERS, customers);
        
        // Auto-login after registration
        const session = {
            isLoggedIn: true,
            user: newUser,
            isAdmin: false
        };
        StorageUtil.set(this.STORAGE_KEYS.SESSION, session);
        this.updateNavigation();
        
        return { success: true, user: newUser };
    },
    
    // Logout User
    logoutUser() {
        StorageUtil.set(this.STORAGE_KEYS.SESSION, {
            isLoggedIn: false,
            user: null,
            isAdmin: false
        });
        this.updateNavigation();
        window.location.href = 'index.html';
    },
    
    // Admin Login
    loginAdmin(email, password) {
        // Demo admin credentials
        if (email === 'admin@eamarket.com' && password === 'admin123') {
            const session = {
                isLoggedIn: true,
                user: {
                    id: 'admin',
                    name: 'Administrator',
                    email: 'admin@eamarket.com',
                    role: 'admin'
                },
                isAdmin: true
            };
            StorageUtil.set(this.STORAGE_KEYS.SESSION, session);
            return { success: true };
        }
        
        return { success: false, error: 'Invalid admin credentials' };
    },
    
    // Get Customers
    getCustomers() {
        let customers = StorageUtil.get(this.STORAGE_KEYS.CUSTOMERS);
        
        if (!customers || customers.length === 0) {
            customers = DEMO_DATA.customers;
            StorageUtil.set(this.STORAGE_KEYS.CUSTOMERS, customers);
        }
        
        return customers;
    },
    
    // Get Conversations
    getConversations() {
        let conversations = StorageUtil.get(this.STORAGE_KEYS.CONVERSATIONS);
        
        if (!conversations || conversations.length === 0) {
            conversations = DEMO_DATA.conversations;
            StorageUtil.set(this.STORAGE_KEYS.CONVERSATIONS, conversations);
        }
        
        return conversations;
    },
    
    // Get Orders
    getOrders() {
        let orders = StorageUtil.get(this.STORAGE_KEYS.ORDERS);
        
        if (!orders || orders.length === 0) {
            orders = DEMO_DATA.orders;
            StorageUtil.set(this.STORAGE_KEYS.ORDERS, orders);
        }
        
        return orders;
    },
    
    // Update Navigation based on Session
    updateNavigation() {
        const session = this.getSession();
        const authButtons = document.querySelectorAll('[data-auth-required]');
        
        authButtons.forEach(button => {
            if (session.isLoggedIn) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        });
        
        // Update sign in button
        const signInButton = document.querySelector('[data-sign-in]');
        if (signInButton) {
            if (session.isLoggedIn) {
                signInButton.textContent = 'My Account';
                signInButton.href = 'account/dashboard.html';
            } else {
                signInButton.textContent = 'Sign In';
                signInButton.href = 'account/login.html';
            }
        }
    },
    
    // Update Chat Button
    updateChatButton() {
        const chatButton = document.getElementById('globalChatButton');
        if (chatButton) {
            chatButton.addEventListener('click', () => {
                startGeneralChat();
            });
        }
    },
    
    // Load Notifications
    loadNotifications() {
        const notifications = StorageUtil.get(this.STORAGE_KEYS.NOTIFICATIONS) || [];
        const badge = document.getElementById('notificationBadge');
        
        if (badge && notifications.length > 0) {
            const unreadCount = notifications.filter(n => !n.read).length;
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    },
    
    // Add Notification
    addNotification(notification) {
        const notifications = StorageUtil.get(this.STORAGE_KEYS.NOTIFICATIONS) || [];
        notifications.unshift({
            id: notifications.length + 1,
            ...notification,
            read: false,
            timestamp: new Date().toISOString()
        });
        StorageUtil.set(this.STORAGE_KEYS.NOTIFICATIONS, notifications);
        this.loadNotifications();
    },
    
    // Get Notifications
    getNotifications() {
        return StorageUtil.get(this.STORAGE_KEYS.NOTIFICATIONS) || [];
    }
};

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make App globally available
window.App = App;
