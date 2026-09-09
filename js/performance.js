// ============================================
// EA MARKETPLACE - PERFORMANCE MANAGEMENT
// ============================================

const PerformanceManager = {
    init() {
        this.loadEASelector();
    },
    
    loadEASelector() {
        const select = document.getElementById('performanceEASelect');
        if (!select) return;
        
        const products = App.getProducts();
        
        select.innerHTML = `
            <option value="">Select an EA...</option>
            ${products.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
        `;
    },
    
    loadPerformance() {
        const select = document.getElementById('performanceEASelect');
        const container = document.getElementById('performanceDisplay');
        
        if (!select || !container || !select.value) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📈</div>
                    <h3>Select an EA</h3>
                    <p class="empty-state-description">Choose an EA to view its performance statistics.</p>
                </div>
            `;
            return;
        }
        
        const product = App.getProductById(parseInt(select.value));
        if (!product) return;
        
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="flex justify-between items-center">
                        <h2>${product.name} - Performance</h2>
                        <span class="badge badge-primary">${product.performance.source}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="grid grid-4 gap-4 mb-8">
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
                    
                    <div class="grid grid-4 gap-4 mb-8">
                        <div class="performance-card">
                            <div class="performance-value">${Formatter.currency(product.performance.averageTrade)}</div>
                            <div class="performance-label">Average Trade</div>
                        </div>
                        <div class="performance-card">
                            <div class="performance-value positive">${Formatter.currency(product.performance.largestWin)}</div>
                            <div class="performance-label">Largest Win</div>
                        </div>
                        <div class="performance-card">
                            <div class="performance-value negative">${Formatter.currency(product.performance.largestLoss)}</div>
                            <div class="performance-label">Largest Loss</div>
                        </div>
                        <div class="performance-card">
                            <div class="performance-value">${product.performance.testingPeriod}</div>
                            <div class="performance-label">Testing Period</div>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <h3>Monthly Performance</h3>
                        <canvas id="monthlyPerformanceChart"></canvas>
                    </div>
                    
                    <div class="risk-disclosure mt-4">
                        <span class="risk-disclosure-icon">⚠️</span>
                        <p class="risk-disclosure-text">
                            <strong>${product.performance.source} - FOR DEMONSTRATION ONLY</strong><br>
                            Last Updated: ${product.performance.lastUpdated}
                            <br><br>
                            Past performance does not guarantee future results. Trading involves substantial risk.
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Initialize chart
        setTimeout(() => {
            this.initializeChart(product);
        }, 100);
    },
    
    initializeChart(product) {
        const canvas = document.getElementById('monthlyPerformanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.parentElement.offsetWidth;
        const height = 300;
        canvas.width = width;
        canvas.height = height;
        
        const monthlyData = product.monthlyPerformance || [];
        
        if (monthlyData.length === 0) return;
        
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw bars
        const barWidth = (chartWidth / monthlyData.length) * 0.7;
        const barGap = (chartWidth / monthlyData.length) * 0.3;
        
        monthlyData.forEach((data, index) => {
            const x = padding + (chartWidth / monthlyData.length) * index + barGap / 2;
            const barHeight = Math.abs(data.pnl) * 5;
            const y = data.pnl >= 0 
                ? padding + (chartHeight / 2) - barHeight
                : padding + (chartHeight / 2);
            
            ctx.fillStyle = data.pnl >= 0 ? '#10b981' : '#ef4444';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw month label
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.month, x + barWidth / 2, height - 10);
            
            // Draw value
            ctx.fillStyle = data.pnl >= 0 ? '#10b981' : '#ef4444';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.fillText(`${data.pnl}%`, x + barWidth / 2, y - 5);
        });
        
        // Draw zero line
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight / 2);
        ctx.lineTo(width - padding, padding + chartHeight / 2);
        ctx.stroke();
    }
};

document.addEventListener('DOMContentLoaded', function() {
    PerformanceManager.init();
});

window.PerformanceManager = PerformanceManager;
