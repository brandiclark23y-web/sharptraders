// ============================================
// EA MARKETPLACE - MAIN SCRIPT (FIXED)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    loadPerformanceOverview();
    loadBlogPreview();
    loadFaqPreview();
});

// Load Featured Products with proper design
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = App.getProducts().slice(0, 3);
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="card product-card">
            <div class="card-header">
                <div class="flex items-center gap-3">
                    <div class="product-card-icon">${product.name.substring(0, 2).toUpperCase()}</div>
                    <div>
                        <h3 class="product-card-title">${product.name}</h3>
                        <span class="badge badge-primary">${product.performance.source}</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="product-card-description">${product.shortDescription}</p>
                
                <div class="grid grid-3 gap-3 mt-4">
                    <div class="text-center">
                        <div class="text-sm text-muted">Win Rate</div>
                        <div class="text-lg font-bold text-success">${product.performance.winRate}%</div>
                    </div>
                    <div class="text-center">
                        <div class="text-sm text-muted">Drawdown</div>
                        <div class="text-lg font-bold">${product.performance.maxDrawdown}%</div>
                    </div>
                    <div class="text-center">
                        <div class="text-sm text-muted">Platform</div>
                        <div class="text-lg font-bold">${product.platform}</div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-4">
                    <span class="risk-badge risk-${product.riskLevel.toLowerCase()}">${product.riskLevel} Risk</span>
                    <span class="text-xl font-bold">${Formatter.currency(product.price)}</span>
                </div>
            </div>
            <div class="card-footer">
                <div class="flex gap-2">
                    <button class="btn btn-primary btn-sm flex-1" onclick="window.location.href='eas/product.html?slug=${product.slug}'">
                        View EA
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="startProductChat(${product.id}, '${product.name}')">
                        💬
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Performance Overview
function loadPerformanceOverview() {
    const container = document.getElementById('performanceOverview');
    if (!container) return;
    
    const products = App.getProducts().slice(0, 3);
    
    const metrics = [
        {
            label: 'Average Win Rate',
            value: `${Math.round(products.reduce((sum, p) => sum + p.performance.winRate, 0) / products.length)}%`,
            trend: 'positive'
        },
        {
            label: 'Avg Profit Factor',
            value: (products.reduce((sum, p) => sum + p.performance.profitFactor, 0) / products.length).toFixed(2),
            trend: 'positive'
        },
        {
            label: 'Avg Max Drawdown',
            value: `${(products.reduce((sum, p) => sum + p.performance.maxDrawdown, 0) / products.length).toFixed(1)}%`,
            trend: 'negative'
        },
        {
            label: 'Total Trades',
            value: products.reduce((sum, p) => sum + p.performance.totalTrades, 0).toLocaleString(),
            trend: 'positive'
        }
    ];
    
    container.innerHTML = metrics.map(metric => `
        <div class="card">
            <div class="card-body text-center">
                <div class="text-3xl font-bold mb-2">${metric.value}</div>
                <div class="text-sm text-secondary">${metric.label}</div>
                <span class="badge badge-primary mt-2">DEMO DATA</span>
            </div>
        </div>
    `).join('');
}

// Load Blog Preview
function loadBlogPreview() {
    const container = document.getElementById('blogPreview');
    if (!container) return;
    
    const posts = DEMO_DATA.blogPosts.slice(0, 3);
    
    container.innerHTML = posts.map(post => `
        <div class="card">
            <div class="card-body">
                <span class="badge badge-primary mb-3">${post.category}</span>
                <h3 class="mb-2">${post.title}</h3>
                <p class="text-sm mb-4">${post.excerpt}</p>
                <div class="flex justify-between text-sm text-muted">
                    <span>${post.readTime}</span>
                    <span>${Formatter.date(post.date)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load FAQ Preview
function loadFaqPreview() {
    const container = document.getElementById('faqPreview');
    if (!container) return;
    
    const faqs = DEMO_DATA.faqs.slice(0, 3);
    
    container.innerHTML = faqs.map(faq => `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
                <span>${faq.question}</span>
                <span class="faq-icon">▼</span>
            </div>
            <div class="faq-answer">${faq.answer}</div>
        </div>
    `).join('');
}

// Toggle FAQ
function toggleFaq(element) {
    element.parentElement.classList.toggle('active');
}

// Global chat functions
function startProductChat(productId, productName) {
    if (typeof ChatSystem !== 'undefined') {
        ChatSystem.startProductChat(productId, productName);
    }
}
