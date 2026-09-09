// ============================================
// EA MARKETPLACE - PRODUCTS MANAGEMENT
// ============================================

const ProductManager = {
    // Load Products to Store Page
    loadProductsToStore(containerId = 'productGrid') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const products = App.getProducts();
        const filteredProducts = this.applyFilters(products);
        
        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3 class="empty-state-title">No EAs Found</h3>
                    <p class="empty-state-description">Try adjusting your filters or search terms.</p>
                    <button class="btn btn-primary" onclick="ProductManager.clearFilters()">Clear Filters</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredProducts.map(product => 
            this.createProductCard(product)
        ).join('');
    },
    
    // Create Product Card HTML
    createProductCard(product) {
        return `
            <div class="product-card" onclick="window.location.href='eas/product.html?slug=${product.slug}'">
                <div class="product-card-header">
                    <div class="product-card-icon">${product.name.substring(0, 2).toUpperCase()}</div>
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
                            <div class="product-card-metric-label">Profit Factor</div>
                            <div class="product-card-metric-value">${product.performance.profitFactor}</div>
                        </div>
                        <div class="product-card-metric">
                            <div class="product-card-metric-label">Platform</div>
                            <div class="product-card-metric-value">${product.platform}</div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center mb-3">
                        <span class="risk-badge risk-${product.riskLevel.toLowerCase()}">${product.riskLevel} Risk</span>
                        <span class="badge badge-primary">${product.performance.source}</span>
                    </div>
                </div>
                <div class="product-card-footer">
                    <div>
                        <span class="product-price">$${product.price}</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); startProductChat(${product.id}, '${product.name}')">
                            💬 Chat
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.location.href='eas/product.html?slug=${product.slug}'">
                            View EA
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Apply Filters
    applyFilters(products) {
        let filtered = [...products];
        
        // Get active filters
        const activeFilters = {
            platform: this.getActiveFilter('platform'),
            strategy: this.getActiveFilter('strategy'),
            risk: this.getActiveFilter('risk')
        };
        
        // Apply platform filter
        if (activeFilters.platform) {
            filtered = filtered.filter(p => p.platform === activeFilters.platform);
        }
        
        // Apply strategy filter
        if (activeFilters.strategy) {
            filtered = filtered.filter(p => p.strategy.toLowerCase() === activeFilters.strategy.toLowerCase());
        }
        
        // Apply risk filter
        if (activeFilters.risk) {
            filtered = filtered.filter(p => p.riskLevel.toLowerCase() === activeFilters.risk.toLowerCase());
        }
        
        // Apply search
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.shortDescription.toLowerCase().includes(searchTerm) ||
                p.strategy.toLowerCase().includes(searchTerm) ||
                p.platform.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply sorting
        const sortBy = document.getElementById('sortSelect')?.value;
        if (sortBy) {
            filtered = this.sortProducts(filtered, sortBy);
        }
        
        return filtered;
    },
    
    // Get Active Filter
    getActiveFilter(type) {
        const activeFilter = document.querySelector(`.filter-option.active[data-filter-type="${type}"]`);
        return activeFilter ? activeFilter.dataset.value : null;
    },
    
    // Sort Products
    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch(sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'win-rate':
                return sorted.sort((a, b) => b.performance.winRate - a.performance.winRate);
            case 'drawdown':
                return sorted.sort((a, b) => a.performance.maxDrawdown - b.performance.maxDrawdown);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.performance.lastUpdated) - new Date(a.performance.lastUpdated));
            case 'popular':
            default:
                return sorted.sort((a, b) => b.performance.totalTrades - a.performance.totalTrades);
        }
    },
    
    // Clear Filters
    clearFilters() {
        document.querySelectorAll('.filter-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = 'popular';
        }
        
        this.loadProductsToStore();
    },
    
    // Set Filter
    setFilter(type, value, element) {
        // Remove active class from siblings
        element.parentElement.querySelectorAll('.filter-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to clicked element
        element.classList.add('active');
        
        // Reload products
        this.loadProductsToStore();
    },
    
    // Load Product Details Page
    loadProductDetails() {
        const slug = getUrlParameter('slug');
        if (!slug) {
            window.location.href = 'eas.html';
            return;
        }
        
        const product = App.getProductBySlug(slug);
        if (!product) {
            document.getElementById('productDetails').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">❌</div>
                    <h3 class="empty-state-title">Product Not Found</h3>
                    <p class="empty-state-description">The EA you're looking for doesn't exist.</p>
                    <a href="eas.html" class="btn btn-primary">Back to Store</a>
                </div>
            `;
            return;
        }
        
        // Update page title
        document.title = `${product.name} - EA Marketplace`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = product.shortDescription;
        }
        
        // Populate product details
        this.populateProductDetails(product);
    },
    
    // Populate Product Details
    populateProductDetails(product) {
        const container = document.getElementById('productDetails');
        if (!container) return;
        
        container.innerHTML = `
            <div class="product-details-header">
                <div class="flex justify-between items-start">
                    <div>
                        <h1>${product.name}</h1>
                        <p class="text-secondary">${product.shortDescription}</p>
                    </div>
                    <span class="badge badge-primary">${product.performance.source}</span>
                </div>
                
                <div class="grid grid-4 gap-4 mt-6">
                    <div class="performance-card">
                        <div class="performance-value positive">${product.performance.winRate}%</div>
                        <div class="performance-label">Win Rate</div>
                    </div>
                    <div class="performance-card">
                        <div class="performance-value">${product.performance.maxDrawdown}%</div>
                        <div class="performance-label">Max Drawdown</div>
                    </div>
                    <div class="performance-card">
                        <div class="performance-value">${product.performance.profitFactor}</div>
                        <div class="performance-label">Profit Factor</div>
                    </div>
                    <div class="performance-card">
                        <div class="performance-value">${product.performance.totalTrades}</div>
                        <div class="performance-label">Total Trades</div>
                    </div>
                </div>
                
                <div class="flex gap-4 mt-6">
                    <button class="btn btn-primary btn-lg" onclick="startProductChat(${product.id}, '${product.name}')">
                        💬 Chat with Seller
                    </button>
                    <button class="btn btn-secondary btn-lg" onclick="createOrderFromProduct(${product.id})">
                        Get Started
                    </button>
                </div>
            </div>
            
            <div class="product-details-sections mt-8">
                <div class="tabs">
                    <button class="tab active" onclick="switchProductTab('overview', this)">Overview</button>
                    <button class="tab" onclick="switchProductTab('features', this)">Features</button>
                    <button class="tab" onclick="switchProductTab('performance', this)">Performance</button>
                    <button class="tab" onclick="switchProductTab('faq', this)">FAQ</button>
                </div>
                
                <div id="productTabContent">
                    <!-- Tab content loaded dynamically -->
                </div>
            </div>
        `;
        
        // Load overview tab by default
        this.loadProductTab('overview', product);
        
        // Initialize compare button
        this.initializeCompareButton(product);
    },
    
    // Load Product Tab
    loadProductTab(tabName, product) {
        const content = document.getElementById('productTabContent');
        if (!content) return;
        
        switch(tabName) {
            case 'overview':
                content.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3>About ${product.name}</h3>
                            <p>${product.description}</p>
                            
                            <h4 class="mt-4">Strategy</h4>
                            <p>${product.strategy} - ${product.riskLevel} Risk</p>
                            
                            <h4 class="mt-4">Supported Platforms</h4>
                            <p>${product.platform}</p>
                            
                            <h4 class="mt-4">Supported Brokers</h4>
                            <p>${product.supportedBrokers.join(', ')}</p>
                            
                            <h4 class="mt-4">Recommended Setup</h4>
                            <ul>
                                <li>Minimum Deposit: $${product.minimumDeposit}</li>
                                <li>Timeframe: ${product.timeframe}</li>
                                <li>Recommended Pairs: ${product.recommendedPairs.join(', ')}</li>
                            </ul>
                        </div>
                    </div>
                `;
                break;
                
            case 'features':
                content.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3>Features</h3>
                            <ul>
                                ${product.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
                break;
                
            case 'performance':
                content.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3>Performance Statistics</h3>
                            <div class="grid grid-3 gap-4">
                                <div class="performance-card">
                                    <div class="performance-label">Win Rate</div>
                                    <div class="performance-value">${product.performance.winRate}%</div>
                                </div>
                                <div class="performance-card">
                                    <div class="performance-label">Average Trade</div>
                                    <div class="performance-value">$${product.performance.averageTrade}</div>
                                </div>
                                <div class="performance-card">
                                    <div class="performance-label">Largest Win</div>
                                    <div class="performance-value positive">$${product.performance.largestWin}</div>
                                </div>
                                <div class="performance-card">
                                    <div class="performance-label">Largest Loss</div>
                                    <div class="performance-value negative">$${product.performance.largestLoss}</div>
                                </div>
                                <div class="performance-card">
                                    <div class="performance-label">Testing Period</div>
                                    <div class="performance-value">${product.performance.testingPeriod}</div>
                                </div>
                                <div class="performance-card">
                                    <div class="performance-label">Last Updated</div>
                                    <div class="performance-value">${product.performance.lastUpdated}</div>
                                </div>
                            </div>
                            
                            <div class="risk-disclosure mt-4">
                                <span class="risk-disclosure-icon">⚠️</span>
                                <p class="risk-disclosure-text">
                                    <strong>${product.performance.source} - FOR DEVELOPMENT PURPOSES ONLY</strong><br>
                                    Past performance does not guarantee future results. Trading involves substantial risk.
                                </p>
                            </div>
                            
                            <div class="chart-container mt-4">
                                <canvas id="performanceChart"></canvas>
                            </div>
                        </div>
                    </div>
                `;
                
                // Initialize chart after content is loaded
                setTimeout(() => {
                    this.initializePerformanceChart(product);
                }, 100);
                break;
                
            case 'faq':
                content.innerHTML = `
                    <div class="faq-list">
                        ${DEMO_DATA.faqs.map((faq, index) => `
                            <div class="faq-item">
                                <div class="faq-question" onclick="toggleFaq(this)">
                                    <span>${faq.question}</span>
                                    <span class="faq-icon">▼</span>
                                </div>
                                <div class="faq-answer">${faq.answer}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
        }
    },
    
    // Initialize Performance Chart
    initializePerformanceChart(product) {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.parentElement.offsetWidth;
        const height = 300;
        canvas.width = width;
        canvas.height = height;
        
        // Draw simple equity curve from monthly performance
        const monthlyData = product.monthlyPerformance || [];
        const data = monthlyData.map(m => m.pnl);
        
        if (data.length === 0) return;
        
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const range = maxValue - minValue || 1;
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw title
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Monthly Performance (%)', width / 2, 20);
        
        // Draw grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw bars
        const barWidth = (chartWidth / data.length) * 0.7;
        const barGap = (chartWidth / data.length) * 0.3;
        
        data.forEach((value, index) => {
            const x = padding + (chartWidth / data.length) * index + barGap / 2;
            const barHeight = (Math.abs(value) / range) * chartHeight;
            const y = value >= 0 
                ? padding + (chartHeight / 2) - barHeight
                : padding + (chartHeight / 2);
            
            ctx.fillStyle = value >= 0 ? '#10b981' : '#ef4444';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw month label
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(monthlyData[index].month, x + barWidth / 2, height - 10);
        });
        
        // Draw zero line
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight / 2);
        ctx.lineTo(width - padding, padding + chartHeight / 2);
        ctx.stroke();
    },
    
    // Initialize Compare Button
    initializeCompareButton(product) {
        const compareBtn = document.getElementById('compareButton');
        if (!compareBtn) return;
        
        compareBtn.addEventListener('click', () => {
            let comparison = StorageUtil.get(App.STORAGE_KEYS.COMPARISON) || [];
            
            if (comparison.includes(product.id)) {
                comparison = comparison.filter(id => id !== product.id);
                compareBtn.textContent = 'Add to Compare';
                compareBtn.classList.remove('active');
            } else {
                if (comparison.length >= 3) {
                    showToast('You can compare up to 3 EAs', 'warning');
                    return;
                }
                comparison.push(product.id);
                compareBtn.textContent = 'Added to Compare';
                compareBtn.classList.add('active');
            }
            
            StorageUtil.set(App.STORAGE_KEYS.COMPARISON, comparison);
            showToast('Comparison updated', 'success');
        });
    }
};

// Global functions
function switchProductTab(tabName, element) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }
    
    // Load tab content
    const slug = getUrlParameter('slug');
    const product = App.getProductBySlug(slug);
    if (product) {
        ProductManager.loadProductTab(tabName, product);
    }
}

function toggleFaq(element) {
    const faqItem = element.parentElement;
    faqItem.classList.toggle('active');
}

function startProductChat(productId, productName) {
    startChat(productId, productName);
}

function createOrderFromProduct(productId) {
    const session = App.getSession();
    
    if (!session.isLoggedIn) {
        showToast('Please login to create an order', 'warning');
        setTimeout(() => {
            window.location.href = 'account/login.html';
        }, 1000);
        return;
    }
    
    window.location.href = `account/dashboard.html?createOrder=${productId}`;
}

// Make ProductManager globally available
window.ProductManager = ProductManager;
