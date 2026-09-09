// ============================================
// EA MARKETPLACE - CUSTOMER ACCOUNT MANAGEMENT
// ============================================

const AccountManager = {
    // Initialize Account Dashboard
    init() {
        const session = App.getSession();
        
        if (!session.isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
        
        this.loadUserInfo();
        this.loadDashboardStats();
        this.loadConversations();
        this.loadOrders();
        this.loadPurchasedEAs();
        this.loadDownloads();
        this.loadProfile();
        
        // Check for createOrder parameter
        const createOrderProductId = getUrlParameter('createOrder');
        if (createOrderProductId) {
            this.createOrderFromProduct(parseInt(createOrderProductId));
        }
    },
    
    // Load User Info
    loadUserInfo() {
        const session = App.getSession();
        const user = session.user;
        
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userAvatar').textContent = user.name.split(' ').map(w => w[0]).join('').toUpperCase();
    },
    
    // Load Dashboard Stats
    loadDashboardStats() {
        const session = App.getSession();
        const user = session.user;
        const orders = App.getOrders().filter(o => o.customerId === user.id);
        const conversations = App.getConversations().filter(c => c.customerId === user.id);
        
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('activeConversations').textContent = conversations.filter(c => c.status === 'active').length;
        document.getElementById('purchasedEAs').textContent = orders.filter(o => o.status === 'completed').length;
        document.getElementById('totalSpent').textContent = Formatter.currency(orders.reduce((sum, o) => sum + o.amount, 0));
        
        // Load recent activity
        const recentActivity = document.getElementById('recentActivity');
        const activities = [];
        
        orders.forEach(order => {
            activities.push({
                type: 'order',
                text: `Order ${order.id} - ${App.getProductById(order.productId)?.name || 'Unknown EA'}`,
                date: order.createdAt,
                status: order.status
            });
        });
        
        conversations.forEach(conv => {
            activities.push({
                type: 'conversation',
                text: `Conversation about ${App.getProductById(conv.productId)?.name || 'General'}`,
                date: conv.lastMessageTime,
                status: conv.status
            });
        });
        
        // Sort by date
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (activities.length === 0) {
            recentActivity.innerHTML = `
                <div class="empty-state">
                    <p>No recent activity yet.</p>
                    <a href="../eas.html" class="btn btn-primary btn-sm">Browse EAs</a>
                </div>
            `;
        } else {
            recentActivity.innerHTML = activities.slice(0, 5).map(activity => `
                <div class="activity-item">
                    <span>${activity.type === 'order' ? '📦' : '💬'}</span>
                    <div>
                        <p>${activity.text}</p>
                        <small class="text-muted">${Formatter.dateTime(activity.date)}</small>
                    </div>
                    <span class="badge badge-primary">${activity.status}</span>
                </div>
            `).join('');
        }
    },
    
    // Load Conversations
    loadConversations() {
        const session = App.getSession();
        const user = session.user;
        const conversations = App.getConversations().filter(c => c.customerId === user.id);
        const container = document.getElementById('conversationsList');
        
        if (conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>No Conversations Yet</h3>
                    <p>Start a conversation with us about an EA you're interested in.</p>
                    <a href="../eas.html" class="btn btn-primary">Browse EAs</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = conversations.map(conv => {
            const product = App.getProductById(conv.productId);
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4>${product?.name || 'General Support'}</h4>
                                <p class="text-sm text-muted">Last message: ${Formatter.dateTime(conv.lastMessageTime)}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="badge badge-primary">${conv.status}</span>
                                <button class="btn btn-primary btn-sm" onclick="openConversation(${conv.id})">Open Chat</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Load Orders
    loadOrders() {
        const session = App.getSession();
        const user = session.user;
        const orders = App.getOrders().filter(o => o.customerId === user.id);
        const container = document.getElementById('ordersList');
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <h3>No Orders Yet</h3>
                    <p>Browse our EAs and create your first order.</p>
                    <a href="../eas.html" class="btn btn-primary">Browse EAs</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = orders.map(order => {
            const product = App.getProductById(order.productId);
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4>Order ${order.id}</h4>
                                <p class="text-sm">${product?.name || 'Unknown EA'}</p>
                                <p class="text-sm text-muted">${Formatter.currency(order.amount)} - ${Formatter.date(order.createdAt)}</p>
                            </div>
                            <span class="badge badge-${order.status === 'completed' ? 'success' : 'primary'}">${order.status}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Load Purchased EAs
    loadPurchasedEAs() {
        const session = App.getSession();
        const user = session.user;
        const completedOrders = App.getOrders().filter(o => 
            o.customerId === user.id && 
            (o.status === 'completed' || o.status === 'delivered')
        );
        const container = document.getElementById('purchasedList');
        
        if (completedOrders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✅</div>
                    <h3>No Purchased EAs</h3>
                    <p>Once you complete a purchase, your EAs will appear here.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = completedOrders.map(order => {
            const product = App.getProductById(order.productId);
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4>${product?.name || 'Unknown EA'}</h4>
                                <p class="text-sm text-muted">Purchased: ${Formatter.date(order.createdAt)}</p>
                            </div>
                            <button class="btn btn-outline btn-sm" onclick="downloadEA(${order.productId})">Download</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Load Downloads
    loadDownloads() {
        const session = App.getSession();
        const user = session.user;
        const completedOrders = App.getOrders().filter(o => 
            o.customerId === user.id && 
            (o.status === 'completed' || o.status === 'delivered')
        );
        const container = document.getElementById('downloadsList');
        
        if (completedOrders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⬇️</div>
                    <h3>No Downloads Available</h3>
                    <p>Your downloadable products will appear here after purchase.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = completedOrders.map(order => {
            const product = App.getProductById(order.productId);
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4>${product?.name || 'Unknown EA'}</h4>
                                <p class="text-sm text-muted">EA File + Installation Guide</p>
                            </div>
                            <div class="flex gap-2">
                                <button class="btn btn-outline btn-sm" onclick="downloadEA(${order.productId})">EA File</button>
                                <button class="btn btn-outline btn-sm" onclick="downloadGuide(${order.productId})">Guide</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Load Profile
    loadProfile() {
        const session = App.getSession();
        const user = session.user;
        
        document.getElementById('profileName').value = user.name;
        document.getElementById('profileEmail').value = user.email;
    },
    
    // Update Profile
    updateProfile(event) {
        event.preventDefault();
        
        const name = document.getElementById('profileName').value;
        const session = App.getSession();
        
        // Update user in storage
        const customers = App.getCustomers();
        const customerIndex = customers.findIndex(c => c.id === session.user.id);
        
        if (customerIndex !== -1) {
            customers[customerIndex].name = name;
            StorageUtil.set(App.STORAGE_KEYS.CUSTOMERS, customers);
            
            // Update session
            session.user.name = name;
            StorageUtil.set(App.STORAGE_KEYS.SESSION, session);
            
            // Update UI
            this.loadUserInfo();
            
            showToast('Profile updated successfully', 'success');
        }
    },
    
    // Create Order from Product
    createOrderFromProduct(productId) {
        const product = App.getProductById(productId);
        const session = App.getSession();
        
        if (!product || !session.isLoggedIn) return;
        
        // Create order
        const orders = App.getOrders();
        const newOrder = {
            id: `EA-${1000 + orders.length + 1}`,
            customerId: session.user.id,
            productId: productId,
            amount: product.price,
            status: 'payment_pending',
            paymentStatus: 'pending',
            deliveryStatus: 'pending',
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        StorageUtil.set(App.STORAGE_KEYS.ORDERS, orders);
        
        // Update customer stats
        const customers = App.getCustomers();
        const customerIndex = customers.findIndex(c => c.id === session.user.id);
        if (customerIndex !== -1) {
            customers[customerIndex].orders += 1;
            StorageUtil.set(App.STORAGE_KEYS.CUSTOMERS, customers);
        }
        
        // Add notification
        App.addNotification({
            type: 'new_order',
            title: 'New Order Created',
            message: `Order ${newOrder.id} for ${product.name} - ${Formatter.currency(product.price)}`
        });
        
        showToast('Order created successfully!', 'success');
        
        // Reload dashboard
        this.loadDashboardStats();
        this.loadOrders();
        
        // Switch to orders tab
        switchDashboardTab('orders', document.querySelector('[onclick="switchDashboardTab(\'orders\', this)"]'));
    }
};

// Global functions
function switchDashboardTab(tabName, element) {
    // Hide all tabs
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.dashboard-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
}

function openConversation(conversationId) {
    const conversations = App.getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
        const product = App.getProductById(conversation.productId);
        ChatSystem.currentConversationId = conversationId;
        ChatSystem.currentProductId = conversation.productId;
        ChatSystem.currentProductName = product?.name || 'General Support';
        ChatSystem.openChatWindow();
        ChatSystem.loadConversationMessages(conversationId);
    }
}

function downloadEA(productId) {
    const product = App.getProductById(productId);
    if (product) {
        showToast(`Downloading ${product.name}... (Demo)`, 'info');
        // In production, this would trigger a secure download
    }
}

function downloadGuide(productId) {
    const product = App.getProductById(productId);
    if (product) {
        showToast(`Downloading ${product.name} Installation Guide... (Demo)`, 'info');
        // In production, this would trigger a secure download
    }
}

// Make AccountManager globally available
window.AccountManager = AccountManager;
