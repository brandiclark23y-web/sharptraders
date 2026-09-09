// ============================================
// EA MARKETPLACE - ADMIN DASHBOARD MANAGEMENT
// ============================================

const AdminManager = {
    // Initialize Admin Dashboard
    init() {
        const session = App.getSession();
        
        if (!session.isAdmin) {
            window.location.href = 'login.html';
            return;
        }
        
        this.loadDashboardStats();
        this.loadConversations();
        this.loadCustomers();
        this.loadProducts();
        this.loadOrders();
        this.loadPerformance();
        this.loadBlog();
        this.loadFaq();
        this.loadSettings();
    },
    
    // Load Dashboard Stats
    loadDashboardStats() {
        const orders = App.getOrders();
        const customers = App.getCustomers();
        const conversations = App.getConversations();
        const products = App.getProducts();
        
        const totalRevenue = orders
            .filter(o => o.status === 'completed' || o.status === 'delivered')
            .reduce((sum, o) => sum + o.amount, 0);
        
        document.getElementById('adminTotalRevenue').textContent = Formatter.currency(totalRevenue);
        document.getElementById('adminTotalOrders').textContent = orders.length;
        document.getElementById('adminPendingOrders').textContent = orders.filter(o => o.status === 'payment_pending').length;
        document.getElementById('adminCompletedOrders').textContent = orders.filter(o => o.status === 'completed').length;
        document.getElementById('adminTotalCustomers').textContent = customers.length;
        document.getElementById('adminNewConversations').textContent = conversations.filter(c => c.status === 'new').length;
        document.getElementById('adminActiveConversations').textContent = conversations.filter(c => c.status === 'active').length;
        document.getElementById('adminTotalProducts').textContent = products.length;
    },
    
    // Load Conversations
    loadConversations() {
        const conversations = App.getConversations();
        const container = document.getElementById('adminConversationsList');
        
        if (conversations.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No conversations yet.</p></div>';
            return;
        }
        
        container.innerHTML = conversations.map(conv => {
            const product = App.getProductById(conv.productId);
            const customer = App.getCustomers().find(c => c.id === conv.customerId);
            
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="flex justify-between items-center">
                            <div>
                                <h4>${customer?.name || 'Guest'} - ${product?.name || 'General'}</h4>
                                <p class="text-sm text-muted">Last message: ${Formatter.dateTime(conv.lastMessageTime)}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="badge badge-primary">${conv.status}</span>
                                <button class="btn btn-outline btn-sm" onclick="AdminManager.openConversation(${conv.id})">Open</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Open Conversation
    openConversation(conversationId) {
        const conversation = App.getConversations().find(c => c.id === conversationId);
        if (!conversation) return;
        
        const product = App.getProductById(conversation.productId);
        const customer = App.getCustomers().find(c => c.id === conversation.customerId);
        
        // Create modal with conversation details
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'conversationModal';
        modal.innerHTML = `
            <div class="modal">
                <button class="modal-close" onclick="document.getElementById('conversationModal').remove()">×</button>
                <h3>Conversation with ${customer?.name || 'Guest'}</h3>
                <p class="text-sm text-muted mb-4">Product: ${product?.name || 'General'} | Status: ${conversation.status}</p>
                
                <div class="chat-messages" style="max-height:300px;overflow-y:auto;margin-bottom:16px;">
                    ${conversation.messages.map(msg => `
                        <div class="chat-message ${msg.type}">
                            <div class="chat-message-content">
                                <div>${msg.text}</div>
                                <span class="chat-message-time">${Formatter.time(msg.timestamp)}</span>
                            </div>
                        </div>
                    `).join('') || '<p class="text-muted">No messages yet.</p>'}
                </div>
                
                <div class="flex gap-2 mb-4">
                    <input type="text" id="adminReplyInput" class="form-input" placeholder="Type a reply..." onkeypress="if(event.key==='Enter') AdminManager.replyToConversation(${conversationId})">
                    <button class="btn btn-primary" onclick="AdminManager.replyToConversation(${conversationId})">Send</button>
                </div>
                
                <div class="flex gap-2">
                    <button class="btn btn-outline btn-sm" onclick="AdminManager.updateConversationStatus(${conversationId}, 'active')">Mark Active</button>
                    <button class="btn btn-outline btn-sm" onclick="AdminManager.updateConversationStatus(${conversationId}, 'waiting')">Waiting for Customer</button>
                    <button class="btn btn-outline btn-sm" onclick="AdminManager.updateConversationStatus(${conversationId}, 'closed')">Close</button>
                    <button class="btn btn-primary btn-sm" onclick="AdminManager.createOrderFromConversation(${conversationId})">Create Order</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // Reply to Conversation
    replyToConversation(conversationId) {
        const input = document.getElementById('adminReplyInput');
        if (!input) return;
        
        const replyText = input.value.trim();
        if (!replyText) return;
        
        const conversations = App.getConversations();
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);
        
        if (conversationIndex !== -1) {
            conversations[conversationIndex].messages.push({
                text: replyText,
                type: 'received',
                timestamp: new Date().toISOString()
            });
            conversations[conversationIndex].lastMessageTime = new Date().toISOString();
            
            StorageUtil.set(App.STORAGE_KEYS.CONVERSATIONS, conversations);
            
            // Update modal
            document.getElementById('conversationModal').remove();
            this.openConversation(conversationId);
            
            showToast('Reply sent successfully', 'success');
        }
    },
    
    // Update Conversation Status
    updateConversationStatus(conversationId, status) {
        const conversations = App.getConversations();
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);
        
        if (conversationIndex !== -1) {
            conversations[conversationIndex].status = status;
            StorageUtil.set(App.STORAGE_KEYS.CONVERSATIONS, conversations);
            
            // Refresh UI
            document.getElementById('conversationModal').remove();
            this.loadConversations();
            
            showToast(`Conversation marked as ${status}`, 'success');
        }
    },
    
    // Create Order from Conversation
    createOrderFromConversation(conversationId) {
        const conversation = App.getConversations().find(c => c.id === conversationId);
        if (!conversation) return;
        
        const product = App.getProductById(conversation.productId);
        if (!product) return;
        
        const orders = App.getOrders();
        const newOrder = {
            id: `EA-${1000 + orders.length + 1}`,
            customerId: conversation.customerId,
            productId: product.id,
            amount: product.price,
            status: 'payment_pending',
            paymentStatus: 'pending',
            deliveryStatus: 'pending',
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        StorageUtil.set(App.STORAGE_KEYS.ORDERS, orders);
        
        // Add notification
        App.addNotification({
            type: 'new_order',
            title: 'New Order Created',
            message: `Order ${newOrder.id} for ${product.name} - ${Formatter.currency(product.price)}`
        });
        
        // Close modal
        document.getElementById('conversationModal').remove();
        
        // Update conversation status
        this.updateConversationStatus(conversationId, 'payment');
        
        showToast('Order created successfully!', 'success');
        this.loadDashboardStats();
    },
    
    // Load Customers
    loadCustomers() {
        const customers = App.getCustomers();
        const container = document.getElementById('adminCustomersList');
        
        if (customers.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No customers yet.</p></div>';
            return;
        }
        
        container.innerHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Registration Date</th>
                            <th>Orders</th>
                            <th>Total Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customers.map(customer => `
                            <tr>
                                <td>${customer.name}</td>
                                <td>${customer.email}</td>
                                <td>${Formatter.date(customer.registrationDate)}</td>
                                <td>${customer.orders || 0}</td>
                                <td>${Formatter.currency(customer.totalSpent || 0)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    // Load Products
    loadProducts() {
        const products = App.getProducts();
        const container = document.getElementById('adminProductsList');
        
        if (products.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No products yet.</p></div>';
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4>${product.name}</h4>
                            <p class="text-sm text-muted">${product.platform} - ${product.strategy} - ${Formatter.currency(product.price)}</p>
                        </div>
                        <div class="flex gap-2">
                            <button class="btn btn-outline btn-sm" onclick="AdminManager.editProduct(${product.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="AdminManager.deleteProduct(${product.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Edit Product
    editProduct(productId) {
        const product = App.getProductById(productId);
        if (!product) return;
        
        // Create edit modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'editProductModal';
        modal.innerHTML = `
            <div class="modal">
                <button class="modal-close" onclick="document.getElementById('editProductModal').remove()">×</button>
                <h3>Edit Product</h3>
                <form onsubmit="AdminManager.saveProduct(event, ${productId})">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="editName" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Price</label>
                        <input type="number" class="form-input" id="editPrice" value="${product.price}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-textarea" id="editDescription" required>${product.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Platform</label>
                        <select class="form-select" id="editPlatform">
                            <option value="MT4" ${product.platform === 'MT4' ? 'selected' : ''}>MT4</option>
                            <option value="MT5" ${product.platform === 'MT5' ? 'selected' : ''}>MT5</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Risk Level</label>
                        <select class="form-select" id="editRisk">
                            <option value="Low" ${product.riskLevel === 'Low' ? 'selected' : ''}>Low</option>
                            <option value="Medium" ${product.riskLevel === 'Medium' ? 'selected' : ''}>Medium</option>
                            <option value="High" ${product.riskLevel === 'High' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // Save Product
    saveProduct(event, productId) {
        event.preventDefault();
        
        const updates = {
            name: document.getElementById('editName').value,
            price: parseInt(document.getElementById('editPrice').value),
            description: document.getElementById('editDescription').value,
            platform: document.getElementById('editPlatform').value,
            riskLevel: document.getElementById('editRisk').value
        };
        
        if (App.updateProduct(productId, updates)) {
            document.getElementById('editProductModal').remove();
            this.loadProducts();
            showToast('Product updated successfully', 'success');
        }
    },
    
    // Delete Product
    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            let products = App.getProducts();
            products = products.filter(p => p.id !== productId);
            StorageUtil.set(App.STORAGE_KEYS.PRODUCTS, products);
            
            this.loadProducts();
            showToast('Product deleted', 'success');
        }
    },
    
    // Show Add Product Form
    showAddProductForm() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'addProductModal';
        modal.innerHTML = `
            <div class="modal">
                <button class="modal-close" onclick="document.getElementById('addProductModal').remove()">×</button>
                <h3>Add New EA</h3>
                <form onsubmit="AdminManager.addProduct(event)">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="newName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Price</label>
                        <input type="number" class="form-input" id="newPrice" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Platform</label>
                        <select class="form-select" id="newPlatform">
                            <option value="MT4">MT4</option>
                            <option value="MT5">MT5</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Strategy</label>
                        <input type="text" class="form-input" id="newStrategy" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Risk Level</label>
                        <select class="form-select" id="newRisk">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-textarea" id="newDescription" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Product</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // Add Product
    addProduct(event) {
        event.preventDefault();
        
        const products = App.getProducts();
        const newProduct = {
            id: products.length + 1,
            slug: document.getElementById('newName').value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: document.getElementById('newName').value,
            price: parseInt(document.getElementById('newPrice').value),
            platform: document.getElementById('newPlatform').value,
            strategy: document.getElementById('newStrategy').value,
            riskLevel: document.getElementById('newRisk').value,
            shortDescription: document.getElementById('newDescription').value.substring(0, 100),
            description: document.getElementById('newDescription').value,
            performance: {
                winRate: 0,
                maxDrawdown: 0,
                profitFactor: 0,
                totalTrades: 0,
                testingPeriod: 'N/A',
                source: 'DEMO DATA',
                lastUpdated: new Date().toISOString().split('T')[0]
            },
            features: [],
            supportedBrokers: ['IC Markets', 'Pepperstone'],
            recommendedPairs: ['EURUSD'],
            minimumDeposit: 500,
            timeframe: 'M5'
        };
        
        products.push(newProduct);
        StorageUtil.set(App.STORAGE_KEYS.PRODUCTS, products);
        
        document.getElementById('addProductModal').remove();
        this.loadProducts();
        showToast('Product added successfully', 'success');
    },
    
    // Load Orders
    loadOrders() {
        const orders = App.getOrders();
        const container = document.getElementById('adminOrdersList');
        
        if (orders.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No orders yet.</p></div>';
            return;
        }
        
        container.innerHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(order => {
                            const product = App.getProductById(order.productId);
                            const customer = App.getCustomers().find(c => c.id === order.customerId);
                            
                            return `
                                <tr>
                                    <td>${order.id}</td>
                                    <td>${customer?.name || 'Unknown'}</td>
                                    <td>${product?.name || 'Unknown'}</td>
                                    <td>${Formatter.currency(order.amount)}</td>
                                    <td><span class="badge badge-primary">${order.status}</span></td>
                                    <td>
                                        <div class="flex gap-2">
                                            <button class="btn btn-outline btn-sm" onclick="AdminManager.updateOrderStatus('${order.id}', 'paid')">Mark Paid</button>
                                            <button class="btn btn-outline btn-sm" onclick="AdminManager.updateOrderStatus('${order.id}', 'delivered')">Mark Delivered</button>
                                            <button class="btn btn-outline btn-sm" onclick="AdminManager.updateOrderStatus('${order.id}', 'completed')">Complete</button>
                                        </div>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    // Update Order Status
    updateOrderStatus(orderId, status) {
        const orders = App.getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            
            if (status === 'paid') {
                orders[orderIndex].paymentStatus = 'paid';
            } else if (status === 'delivered') {
                orders[orderIndex].deliveryStatus = 'delivered';
            }
            
            StorageUtil.set(App.STORAGE_KEYS.ORDERS, orders);
            
            this.loadOrders();
            this.loadDashboardStats();
            
            // Add notification
            App.addNotification({
                type: 'order_update',
                title: 'Order Updated',
                message: `Order ${orderId} marked as ${status}`
            });
            
            showToast('Order status updated', 'success');
        }
    },
    
    // Load Performance
    loadPerformance() {
        const products = App.getProducts();
        const container = document.getElementById('adminPerformanceList');
        
        container.innerHTML = products.map(product => `
            <div class="card mb-3">
                <div class="card-body">
                    <h4>${product.name}</h4>
                    <div class="grid grid-4 gap-4 mt-4">
                        <div class="form-group">
                            <label class="form-label">Win Rate (%)</label>
                            <input type="number" class="form-input" value="${product.performance.winRate}" onchange="AdminManager.updatePerformance(${product.id}, 'winRate', this.value)">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Max Drawdown (%)</label>
                            <input type="number" class="form-input" value="${product.performance.maxDrawdown}" onchange="AdminManager.updatePerformance(${product.id}, 'maxDrawdown', this.value)">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Profit Factor</label>
                            <input type="number" step="0.01" class="form-input" value="${product.performance.profitFactor}" onchange="AdminManager.updatePerformance(${product.id}, 'profitFactor', this.value)">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Total Trades</label>
                            <input type="number" class="form-input" value="${product.performance.totalTrades}" onchange="AdminManager.updatePerformance(${product.id}, 'totalTrades', this.value)">
                        </div>
                    </div>
                    <p class="text-sm text-muted mt-2">Source: ${product.performance.source} | Last Updated: ${product.performance.lastUpdated}</p>
                </div>
            </div>
        `).join('');
    },
    
    // Update Performance
    updatePerformance(productId, field, value) {
        const product = App.getProductById(productId);
        if (!product) return;
        
        const updates = {
            performance: {
                ...product.performance,
                [field]: parseFloat(value),
                lastUpdated: new Date().toISOString().split('T')[0]
            }
        };
        
        App.updateProduct(productId, updates);
        showToast('Performance updated', 'success');
    },
    
    // Load Blog
    loadBlog() {
        const posts = DEMO_DATA.blogPosts;
        const container = document.getElementById('adminBlogList');
        
        container.innerHTML = posts.map(post => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4>${post.title}</h4>
                            <p class="text-sm text-muted">${post.category} - ${post.readTime}</p>
                        </div>
                        <div class="flex gap-2">
                            <button class="btn btn-outline btn-sm" onclick="AdminManager.editBlogPost(${post.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="AdminManager.deleteBlogPost(${post.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Load FAQ
    loadFaq() {
        const faqs = DEMO_DATA.faqs;
        const container = document.getElementById('adminFaqList');
        
        container.innerHTML = faqs.map((faq, index) => `
            <div class="card mb-3">
                <div class="card-body">
                    <h4>${faq.question}</h4>
                    <p class="text-sm text-muted">${faq.answer}</p>
                    <div class="flex gap-2 mt-3">
                        <button class="btn btn-outline btn-sm" onclick="AdminManager.editFaq(${index})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="AdminManager.deleteFaq(${index})">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Load Settings
    loadSettings() {
        const container = document.getElementById('adminSettings');
        
        container.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h3>Site Settings</h3>
                    <div class="form-group">
                        <label class="form-label">Site Name</label>
                        <input type="text" class="form-input" value="EAMarket">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Contact Email</label>
                        <input type="email" class="form-input" value="support@eamarket.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Support Phone</label>
                        <input type="tel" class="form-input" placeholder="+1 (555) 123-4567">
                    </div>
                    <button class="btn btn-primary" onclick="showToast('Settings saved', 'success')">Save Settings</button>
                </div>
            </div>
        `;
    },
    
    // Logout
    logout() {
        App.logoutUser();
        window.location.href = 'login.html';
    }
};

// Global functions
function switchAdminTab(tabName, element) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
}

// Make AdminManager globally available
window.AdminManager = AdminManager;
