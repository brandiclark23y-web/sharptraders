// ============================================
// EA MARKETPLACE - CHAT SYSTEM
// ============================================

let chatState = {
    isOpen: false,
    currentProduct: null,
    messages: [],
    conversationId: null
};

// Toggle Chat Widget
function toggleChatWidget() {
    chatState.isOpen = !chatState.isOpen;
    const widget = document.getElementById('chatWidget');
    const body = document.getElementById('chatBody');
    const input = document.querySelector('.chat-widget-input');
    const minimizeBtn = document.getElementById('chatMinimizeBtn');
    
    if (chatState.isOpen) {
        widget.classList.remove('minimized');
        body.style.display = 'block';
        input.style.display = 'flex';
        minimizeBtn.textContent = '×';
    } else {
        widget.classList.add('minimized');
        body.style.display = 'none';
        input.style.display = 'none';
        minimizeBtn.textContent = '−';
    }
}

// Start Chat with Product Context
function startChat(productId, productName) {
    chatState.currentProduct = { id: productId, name: productName };
    chatState.isOpen = true;
    
    const widget = document.getElementById('chatWidget');
    const body = document.getElementById('chatBody');
    const input = document.querySelector('.chat-widget-input');
    const minimizeBtn = document.getElementById('chatMinimizeBtn');
    
    widget.classList.remove('minimized');
    body.style.display = 'block';
    input.style.display = 'flex';
    minimizeBtn.textContent = '×';
    
    // Add system message about product context
    addSystemMessage(`Chat about: ${productName}`);
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 100);
}

// Add System Message
function addSystemMessage(text) {
    const body = document.getElementById('chatBody');
    const systemMessage = document.createElement('div');
    systemMessage.style.cssText = `
        text-align: center;
        margin: 16px 0;
        font-size: 0.75rem;
        color: #6b7280;
    `;
    systemMessage.textContent = text;
    body.appendChild(systemMessage);
    body.scrollTop = body.scrollHeight;
}

// Send Chat Message
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'sent');
    input.value = '';
    
    // Simulate seller response
    setTimeout(() => {
        const responses = [
            "Thanks for your message! I'll help you with that.",
            "That's a great question. Let me explain.",
            "Yes, absolutely. Would you like more details?",
            "I recommend checking the performance data for more information.",
            "We can discuss pricing and setup. What would you like to know?"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'received');
        
        // Show typing indicator
        showTypingIndicator();
    }, 1000);
    
    // Show typing indicator immediately
    showTypingIndicator();
}

// Add Message to Chat
function addMessage(text, type) {
    const body = document.getElementById('chatBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    
    const content = document.createElement('div');
    content.className = 'chat-message-content';
    content.textContent = text;
    
    const time = document.createElement('span');
    time.className = 'chat-message-time';
    time.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    content.appendChild(time);
    messageDiv.appendChild(content);
    body.appendChild(messageDiv);
    body.scrollTop = body.scrollHeight;
    
    // Store message in state
    chatState.messages.push({ text, type, timestamp: new Date() });
}

// Show Typing Indicator
function showTypingIndicator() {
    const body = document.getElementById('chatBody');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message received';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="chat-message-content">
            <span style="color:#9ca3af;">Typing...</span>
        </div>
    `;
    body.appendChild(typingDiv);
    body.scrollTop = body.scrollHeight;
    
    // Remove typing indicator after 2 seconds
    setTimeout(() => {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }, 2000);
}

// Handle Enter Key in Chat Input
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}
