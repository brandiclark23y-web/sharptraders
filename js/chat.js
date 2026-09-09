// ============================================
// EA MARKETPLACE - ENHANCED CHAT SYSTEM
// ============================================

const ChatSystem = {
    // Current chat state
    currentConversationId: null,
    currentProductId: null,
    currentProductName: null,
    
    // Initialize Chat
    init() {
        this.updateChatUI();
        this.loadUnreadCount();
    },
    
    // Start General Chat
    startGeneralChat() {
        this.currentProductId = null;
        this.currentProductName = 'General Support';
        this.openChatWindow();
    },
    
    // Start Product Chat
    startProductChat(productId, productName) {
        this.currentProductId = productId;
        this.currentProductName = productName;
        
        // Find or create conversation
        const conversation = this.findOrCreateConversation(productId);
        this.currentConversationId = conversation.id;
        
        this.openChatWindow();
        this.loadConversationMessages(conversation.id);
    },
    
    // Find or Create Conversation
    findOrCreateConversation(productId) {
        const conversations = App.getConversations();
        const session = App.getSession();
        
        let conversation = conversations.find(c => 
            c.productId === productId && 
            c.customerId === (session.user?.id || 'guest')
        );
        
        if (!conversation) {
            conversation = {
                id: conversations.length + 1,
                customerId: session.user?.id || 'guest',
                productId: productId,
                status: 'new',
                messages: [],
                createdAt: new Date().toISOString(),
                lastMessageTime: new Date().toISOString(),
                unreadCount: 0
            };
            
            conversations.push(conversation);
            StorageUtil.set(App.STORAGE_KEYS.CONVERSATIONS, conversations);
            
            // Add notification
            App.addNotification({
                type: 'new_conversation',
                title: 'New Conversation',
                message: `${session.user?.name || 'Guest'} is asking about ${this.currentProductName}`,
                productId: productId
            });
        }
        
        return conversation;
    },
    
    // Open Chat Window
    openChatWindow() {
        const widget = document.getElementById('chatWidget');
        const body = document.getElementById('chatBody');
        const input = document.querySelector('.chat-widget-input');
        const minimizeBtn = document.querySelector('.chat-widget-minimize');
        
        if (widget) {
            widget.classList.remove('minimized');
            widget.style.width = '380px';
            widget.style.height = '500px';
            
            if (body) body.style.display = 'flex';
            if (input) input.style.display = 'flex';
            if (minimizeBtn) minimizeBtn.textContent = '×';
            
            // Add product context header
            const header = widget.querySelector('.chat-widget-header');
            if (header && this.currentProductName) {
                header.innerHTML = `
                    <div>
                        <div class="text-sm font-medium">Chat with Seller</div>
                        <div class="text-xs" style="opacity:0.9;">Regarding: ${this.currentProductName}</div>
                    </div>
                    <button class="chat-widget-minimize" onclick="toggleChatWidget()">×</button>
                `;
            }
            
            // Load messages if conversation exists
            if (this.currentConversationId) {
                this.loadConversationMessages(this.currentConversationId);
            } else {
                this.showWelcomeMessage();
            }
        }
    },
    
    // Show Welcome Message
    showWelcomeMessage() {
        const body = document.getElementById('chatBody');
        if (!body) return;
        
        body.innerHTML = `
            <div class="chat-message received">
                <div class="chat-message-content">
                    <div>Hello! How can I help you today?</div>
                    <span class="chat-message-time">${Formatter.time(new Date().toISOString())}</span>
                </div>
            </div>
        `;
    },
    
    // Load Conversation Messages
    loadConversationMessages(conversationId) {
        const conversations = App.getConversations();
        const conversation = conversations.find(c => c.id === conversationId);
        
        if (!conversation) return;
        
        const body = document.getElementById('chatBody');
        if (!body) return;
        
        // Clear previous messages
        body.innerHTML = '';
        
        // Add system message about product
        if (this.currentProductName && this.currentProductName !== 'General Support') {
            const product = App.getProductById(this.currentProductId);
            body.innerHTML += `
                <div style="text-align:center;margin:16px 0;font-size:0.75rem;color:#6b7280;">
                    Conversation about: ${this.currentProductName}${product ? ` ($${product.price})` : ''}
                </div>
            `;
        }
        
        // Load messages
        if (conversation.messages && conversation.messages.length > 0) {
            conversation.messages.forEach(message => {
                this.addMessageToChat(message.text, message.type, message.timestamp);
            });
        } else {
            this.showWelcomeMessage();
        }
        
        // Mark as read
        conversation.unreadCount = 0;
        StorageUtil.set(App.STORAGE_KEYS.CONVERSATIONS, conversations);
        
        // Scroll to bottom
        body.scrollTop = body.scrollHeight;
    },
    
    // Send Message
    sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        
        const messageText = input.value.trim();
        if (!messageText) return;
        
        // Clear input
        input.value = '';
        
        // Add message to UI
        this.addMessageToChat(messageText, 'sent', new Date().toISOString());
        
        // Save message to conversation
        this.saveMessage(messageText, 'sent');
        
        // Simulate seller response
        setTimeout(() => {
            this.simulateSellerResponse();
        }, 1500);
    },
    
    // Add Message to Chat UI
    addMessageToChat(text, type, timestamp) {
        const body = document.getElementById('chatBody');
        if (!body) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        const content = document.createElement('div');
        content.className = 'chat-message-content';
        content.textContent = text;
        
        const time = document.createElement('span');
        time.className = 'chat-message-time';
        time.textContent = Formatter.time(timestamp);
        
        content.appendChild(time);
        messageDiv.appendChild(content);
        body.appendChild(messageDiv);
        body.scrollTop = body.scrollHeight;
    },
    
    // Save Message to Storage
    saveMessage(text, type) {
        if (!this.currentConversationId) return;
        
        const conversations = App.getConversations();
        const conversationIndex = conversations.findIndex(c => c.id === this.currentConversationId);
        
        if (conversationIndex !== -1) {
            conversations[conversationIndex].messages.push({
                text: text,
                type: type,
                timestamp: new Date().toISOString()
            });
            conversations[conversationIndex].lastMessageTime = new Date().toISOString();
            conversations[conversationIndex].status = 'active';
            
            StorageUtil.set(App.STORAGE_KEYS.CONVERSATIONS, conversations);
        }
    },
    
    // Simulate Seller Response
    simulateSellerResponse() {
        const responses = [
            "Thanks for your message! I'll help you with that.",
            "Great question. Let me provide more details.",
            "Yes, absolutely. Would you like to know more?",
            "I recommend reviewing the performance data for more information.",
            "We can discuss setup and configuration. What would you like to know?"
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Add seller message
        this.addMessageToChat(response, 'received', new Date().toISOString());
        this.saveMessage(response, 'received');
        
        // Update conversation status
        this.updateConversationStatus('active');
    },
    
    // Update Conversation Status
    updateConversationStatus(status) {
        if (!this.currentConversationId) return;
        
        const conversations = App.getConversations();
        const conversationIndex = conversations.findIndex(c => c.id === this.currentConversationId);
        
        if (conversationIndex !== -1) {
            conversations[conversationIndex].status = status;
            StorageUtil.set(App.STORAGE_KEYS.CONVERSATIONS, conversations);
        }
    },
    
    // Toggle Chat Widget
    toggleChatWidget() {
        const widget = document.getElementById('chatWidget');
        const body = document.getElementById('chatBody');
        const input = document.querySelector('.chat-widget-input');
        
        if (widget.classList.contains('minimized')) {
            widget.classList.remove('minimized');
            widget.style.width = '380px';
            widget.style.height = '500px';
            if (body) body.style.display = 'flex';
            if (input) input.style.display = 'flex';
        } else {
            widget.classList.add('minimized');
            widget.style.width = '60px';
            widget.style.height = '60px';
            if (body) body.style.display = 'none';
            if (input) input.style.display = 'none';
        }
    },
    
    // Handle Enter Key
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    },
    
    // Update Chat UI
    updateChatUI() {
        // Update unread count
        this.loadUnreadCount();
    },
    
    // Load Unread Count
    loadUnreadCount() {
        const conversations = App.getConversations();
        const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        
        const badge = document.getElementById('chatUnreadBadge');
        if (badge) {
            if (totalUnread > 0) {
                badge.textContent = totalUnread;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
};

// Global functions for backward compatibility
function toggleChatWidget() {
    ChatSystem.toggleChatWidget();
}

function startChat(productId, productName) {
    if (productId && productName) {
        ChatSystem.startProductChat(productId, productName);
    } else {
        ChatSystem.startGeneralChat();
    }
}

function startGeneralChat() {
    ChatSystem.startGeneralChat();
}

function startProductChat(productId, productName) {
    ChatSystem.startProductChat(productId, productName);
}

function sendChatMessage() {
    ChatSystem.sendMessage();
}

function handleChatKeyPress(event) {
    ChatSystem.handleKeyPress(event);
}

// Initialize Chat System
document.addEventListener('DOMContentLoaded', function() {
    ChatSystem.init();
});

// Make ChatSystem globally available
window.ChatSystem = ChatSystem;
