// ============================================
// EA MARKETPLACE - COMPARISON FUNCTIONALITY
// ============================================

const CompareManager = {
    selectedEAs: [],
    
    init() {
        this.loadSelectedFromStorage();
        this.renderSelectionButtons();
        this.renderComparisonTable();
    },
    
    loadSelectedFromStorage() {
        this.selectedEAs = StorageUtil.get(App.STORAGE_KEYS.COMPARISON) || [];
        if (this.selectedEAs.length > 3) {
            this.selectedEAs = this.selectedEAs.slice(0, 3);
        }
    },
    
    renderSelectionButtons() {
        const container = document.getElementById('compareSelection');
        if (!container) return;
        
        const products = App.getProducts();
        
        container.innerHTML = products.map(product => `
            <button class="btn ${this.selectedEAs.includes(product.id) ? 'btn-primary' : 'btn-outline'}" 
                    onclick="CompareManager.toggleSelection(${product.id})">
                ${product.name}
            </button>
        `).join('');
    },
    
    toggleSelection(productId) {
        const index = this.selectedEAs.indexOf(productId);
        
        if (index !== -1) {
            this.selectedEAs.splice(index, 1);
        } else {
            if (this.selectedEAs.length >= 3) {
                showToast('You can compare up to 3 EAs', 'warning');
                return;
            }
            this.selectedEAs.push(productId);
        }
        
        StorageUtil.set(App.STORAGE_KEYS.COMPARISON, this.selectedEAs);
        this.renderSelectionButtons();
        this.renderComparisonTable();
    },
    
    renderComparisonTable() {
        const container = document.getElementById('comparisonTable');
        if (!container) return;
        
        if (this.selectedEAs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <h3>No EAs Selected</h3>
                    <p class="empty-state-description">Select EAs above to compare their features.</p>
                </div>
            `;
            return;
        }
        
        const products = this.selectedEAs.map(id => App.getProductById(id)).filter(p => p);
        
        if (products.length === 0) return;
        
        container.innerHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            ${products.map(p => `<th>${p.name}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Price</strong></td>
                            ${products.map(p => `<td>${Formatter.currency(p.price)}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Platform</strong></td>
                            ${products.map(p => `<td>${p.platform}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Strategy</strong></td>
                            ${products.map(p => `<td>${p.strategy}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Risk Level</strong></td>
                            ${products.map(p => `<td><span class="risk-badge risk-${p.riskLevel.toLowerCase()}">${p.riskLevel}</span></td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Win Rate</strong></td>
                            ${products.map(p => `<td class="positive">${p.performance.winRate}%</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Max Drawdown</strong></td>
                            ${products.map(p => `<td>${p.performance.maxDrawdown}%</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Profit Factor</strong></td>
                            ${products.map(p => `<td>${p.performance.profitFactor}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Total Trades</strong></td>
                            ${products.map(p => `<td>${p.performance.totalTrades}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Testing Period</strong></td>
                            ${products.map(p => `<td>${p.performance.testingPeriod}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Minimum Deposit</strong></td>
                            ${products.map(p => `<td>${Formatter.currency(p.minimumDeposit)}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Timeframe</strong></td>
                            ${products.map(p => `<td>${p.timeframe}</td>`).join('')}
                        </tr>
                        <tr>
                            <td><strong>Action</strong></td>
                            ${products.map(p => `<td><a href="eas/product.html?slug=${p.slug}" class="btn btn-primary btn-sm">View Details</a></td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="risk-disclosure mt-4">
                <span class="risk-disclosure-icon">⚠️</span>
                <p class="risk-disclosure-text">
                    All performance data shown is DEMO DATA for demonstration purposes only.
                    Past performance does not guarantee future results.
                </p>
            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    CompareManager.init();
});

window.CompareManager = CompareManager;
