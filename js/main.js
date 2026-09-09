// ============================================
// EA MARKETPLACE - MAIN SCRIPT
// ============================================

// Initialize Homepage
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    loadPerformanceOverview();
    loadBlogPreview();
    loadFaqPreview();
    initializeHeroChart();
});

// Load Featured Products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    // Load first 3 products as featured
    const featuredProducts = DEMO_DATA.products.slice(0, 3);
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="product-card" onclick="window.location.href='ea-details.html?slug=${product.slug}'">
            <div class="product-card-header">
                <div class="product-card-icon">${product.name.substring(0, 2)}</div>
                <h3 class="product-card-title">${product.name}</h3>
                <p class="product-card-description">${product.shortDescription}</p>
            </div>
            <div class="product-card-body">
                <div class="product-card-metrics">
                    <div class="product-card-metric">
                        <div class="product-card-metric-label">Win Rate</div>
                        <div class="product-card-metric-value positive">${product.performance.winRate}%</div>
                    </div>
                    <div class="product-card-metric">
                        <div class="product-card-metric-label">Drawdown</div>
                        <div class="product-card-metric-value">${product.performance.maxDrawdown}%</div>
                    </div>
                    <div class="product-card-metric">
                        <div class="product-card-metric-label">Platform</div>
                        <div class="product-card-metric-value">${product.platform}</div>
                    </div>
                    <div class="product-card-metric">
                        <div class="product-card-metric-label">Risk Level</div>
                        <div class="product-card-metric-value">${product.riskLevel}</div>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="badge badge-primary">DEMO DATA</span>
                    <a href="ea-details.html?slug=${product.slug}" class="btn btn-outline btn-sm">View Details</a>
                </div>
            </div>
            <div class="product-card-footer">
                <div>
                    <span class="product-price">$${product.price}</span>
                </div>
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); startChat(${product.id}, '${product.name}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Chat
                </button>
            </div>
        </div>
    `).join('');
}

// Load Performance Overview
function loadPerformanceOverview() {
    const container = document.getElementById('performanceOverview');
    if (!container) return;
    
    // Aggregate performance from first 3 products
    const products = DEMO_DATA.products.slice(0, 3);
    const avgWinRate = Math.round(products.reduce((sum, p) => sum + p.performance.winRate, 0) / products.length);
    const avgDrawdown = (products.reduce((sum, p) => sum + p.performance.maxDrawdown, 0) / products.length).toFixed(1);
    const avgProfitFactor = (products.reduce((sum, p) => sum + p.performance.profitFactor, 0) / products.length).toFixed(2);
    const totalTrades = products.reduce((sum, p) => sum + p.performance.totalTrades, 0);
    
    container.innerHTML = `
        <div class="performance-card">
            <div class="performance-value">${avgWinRate}%</div>
            <div class="performance-label">Average Win Rate</div>
            <div class="performance-change positive">↑ Demo Data</div>
        </div>
        <div class="performance-card">
            <div class="performance-value">${avgProfitFactor}</div>
            <div class="performance-label">Avg Profit Factor</div>
            <div class="performance-change positive">↑ Demo Data</div>
        </div>
        <div class="performance-card">
            <div class="performance-value">${avgDrawdown}%</div>
            <div class="performance-label">Avg Max Drawdown</div>
            <div class="performance-change positive">↓ Lower is Better</div>
        </div>
        <div class="performance-card">
            <div class="performance-value">${totalTrades.toLocaleString()}</div>
            <div class="performance-label">Total Trades</div>
            <div class="performance-change positive">Demo Period</div>
        </div>
    `;
}

// Load Blog Preview
function loadBlogPreview() {
    const container = document.getElementById('blogPreview');
    if (!container) return;
    
    const posts = DEMO_DATA.blogPosts.slice(0, 3);
    
    container.innerHTML = posts.map(post => `
        <div class="card" onclick="window.location.href='learn.html'">
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
    
    container.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item">
            <div class="faq-question">
                <span>${faq.question}</span>
                <span class="faq-icon">▼</span>
            </div>
            <div class="faq-answer">${faq.answer}</div>
        </div>
    `).join('');
}

// Initialize Hero Chart
function initializeHeroChart() {
    const canvas = document.getElementById('heroChartCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.offsetWidth;
    const height = canvas.parentElement.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    
    // Draw simple demo chart
    const data = [100, 105, 103, 110, 115, 112, 118, 125, 122, 130, 135, 132];
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue;
    const padding = 20;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw line chart
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = height - padding - ((value - minValue) / range) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = '#1a5cff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fill area under line
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(26, 92, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(26, 92, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
}
