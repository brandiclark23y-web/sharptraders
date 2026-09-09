// ============================================
// EA MARKETPLACE - DEMO DATA
// All performance data is DEMO DATA for development
// ============================================

const DEMO_DATA = {
    products: [
        {
            id: 1,
            slug: 'mamprussi-scalper',
            name: 'Mamprussi Scalper',
            shortDescription: 'High-frequency scalping EA optimized for major currency pairs',
            description: 'Mamprussi Scalper is a sophisticated automated trading system designed for high-frequency scalping on major currency pairs. The EA uses advanced price action analysis combined with momentum indicators to identify short-term trading opportunities.',
            price: 49,
            platform: 'MT5',
            strategy: 'Scalping',
            riskLevel: 'Medium',
            features: [
                'Advanced price action analysis',
                'Built-in risk management',
                'News filter protection',
                'Customizable lot sizing',
                'Real-time performance tracking'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'XM', 'FXCM'],
            recommendedPairs: ['EURUSD', 'GBPUSD', 'USDJPY'],
            minimumDeposit: 500,
            timeframe: 'M5',
            performance: {
                winRate: 78,
                maxDrawdown: 12.4,
                profitFactor: 1.82,
                totalTrades: 1240,
                testingPeriod: '12 months',
                averageTrade: 0.42,
                largestWin: 125,
                largestLoss: -85,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-15'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 8.5 },
                { month: 'Feb', pnl: 6.2 },
                { month: 'Mar', pnl: -2.1 },
                { month: 'Apr', pnl: 9.8 },
                { month: 'May', pnl: 7.4 },
                { month: 'Jun', pnl: 5.9 },
                { month: 'Jul', pnl: -1.8 },
                { month: 'Aug', pnl: 11.2 },
                { month: 'Sep', pnl: 8.7 },
                { month: 'Oct', pnl: 6.5 },
                { month: 'Nov', pnl: 4.3 },
                { month: 'Dec', pnl: 7.8 }
            ],
            tags: ['scalping', 'high-frequency', 'major-pairs']
        },
        {
            id: 2,
            slug: 'trend-rider',
            name: 'Trend Rider',
            shortDescription: 'Long-term trend following system with adaptive position sizing',
            description: 'Trend Rider is designed to capture medium to long-term market trends. It uses a combination of moving averages and trend strength indicators to enter and exit positions.',
            price: 89,
            platform: 'MT4',
            strategy: 'Trend',
            riskLevel: 'Low',
            features: [
                'Adaptive trend detection',
                'Multi-timeframe analysis',
                'Automated position sizing',
                'Drawdown protection',
                'Email notifications'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'OANDA'],
            recommendedPairs: ['EURUSD', 'GBPUSD', 'AUDUSD', 'USDCAD'],
            minimumDeposit: 1000,
            timeframe: 'H1',
            performance: {
                winRate: 62,
                maxDrawdown: 8.7,
                profitFactor: 2.15,
                totalTrades: 486,
                testingPeriod: '18 months',
                averageTrade: 0.68,
                largestWin: 340,
                largestLoss: -120,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-10'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 5.2 },
                { month: 'Feb', pnl: 4.8 },
                { month: 'Mar', pnl: 3.1 },
                { month: 'Apr', pnl: 6.7 },
                { month: 'May', pnl: -1.5 },
                { month: 'Jun', pnl: 4.2 },
                { month: 'Jul', pnl: 7.8 },
                { month: 'Aug', pnl: 5.6 },
                { month: 'Sep', pnl: 3.9 },
                { month: 'Oct', pnl: 2.8 },
                { month: 'Nov', pnl: 4.5 },
                { month: 'Dec', pnl: 6.1 }
            ],
            tags: ['trend', 'long-term', 'low-risk']
        },
        {
            id: 3,
            slug: 'alpha-trader',
            name: 'Alpha Trader',
            shortDescription: 'Multi-strategy EA combining momentum and mean reversion',
            description: 'Alpha Trader uses a sophisticated combination of momentum and mean reversion strategies to identify high-probability trading opportunities.',
            price: 129,
            platform: 'MT5',
            strategy: 'Multi-Strategy',
            riskLevel: 'Medium',
            features: [
                'Dual strategy engine',
                'Market regime detection',
                'Correlation analysis',
                'Advanced money management',
                'Real-time alerts'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'FXCM', 'XM'],
            recommendedPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'EURGBP'],
            minimumDeposit: 2000,
            timeframe: 'M15',
            performance: {
                winRate: 71,
                maxDrawdown: 15.2,
                profitFactor: 1.95,
                totalTrades: 892,
                testingPeriod: '15 months',
                averageTrade: 0.55,
                largestWin: 210,
                largestLoss: -145,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-12'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 7.1 },
                { month: 'Feb', pnl: 5.4 },
                { month: 'Mar', pnl: 8.9 },
                { month: 'Apr', pnl: -3.2 },
                { month: 'May', pnl: 6.8 },
                { month: 'Jun', pnl: 9.4 },
                { month: 'Jul', pnl: 4.7 },
                { month: 'Aug', pnl: 7.2 },
                { month: 'Sep', pnl: -1.9 },
                { month: 'Oct', pnl: 8.3 },
                { month: 'Nov', pnl: 5.6 },
                { month: 'Dec', pnl: 6.9 }
            ],
            tags: ['multi-strategy', 'momentum', 'mean-reversion']
        },
        {
            id: 4,
            slug: 'vortex-ea',
            name: 'Vortex EA',
            shortDescription: 'Volatility-based breakout system for dynamic markets',
            description: 'Vortex EA specializes in volatility-based breakout trading. It identifies key support and resistance levels and trades breakouts with precision.',
            price: 79,
            platform: 'MT4',
            strategy: 'Breakout',
            riskLevel: 'High',
            features: [
                'Volatility analysis',
                'Breakout detection',
                'False breakout filter',
                'Time-based filters',
                'Custom indicators'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'OANDA', 'FXCM'],
            recommendedPairs: ['GBPUSD', 'EURJPY', 'GBPJPY'],
            minimumDeposit: 1500,
            timeframe: 'H4',
            performance: {
                winRate: 58,
                maxDrawdown: 22.8,
                profitFactor: 1.65,
                totalTrades: 654,
                testingPeriod: '9 months',
                averageTrade: 0.75,
                largestWin: 450,
                largestLoss: -230,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-08'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 9.8 },
                { month: 'Feb', pnl: -4.5 },
                { month: 'Mar', pnl: 12.3 },
                { month: 'Apr', pnl: 7.6 },
                { month: 'May', pnl: -2.8 },
                { month: 'Jun', pnl: 10.5 },
                { month: 'Jul', pnl: 5.9 },
                { month: 'Aug', pnl: 8.4 },
                { month: 'Sep', pnl: 11.2 },
                { month: 'Oct', pnl: -5.7 },
                { month: 'Nov', pnl: 9.3 },
                { month: 'Dec', pnl: 6.8 }
            ],
            tags: ['breakout', 'volatility', 'high-risk']
        },
        {
            id: 5,
            slug: 'smart-entry',
            name: 'Smart Entry',
            shortDescription: 'AI-powered entry optimization system',
            description: 'Smart Entry uses machine learning algorithms to optimize trade entries and reduce slippage.',
            price: 149,
            platform: 'MT5',
            strategy: 'AI-Optimized',
            riskLevel: 'Low',
            features: [
                'Machine learning algorithms',
                'Entry optimization',
                'Slippage reduction',
                'Smart risk management',
                'Performance analytics'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'XM'],
            recommendedPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'],
            minimumDeposit: 3000,
            timeframe: 'M30',
            performance: {
                winRate: 75,
                maxDrawdown: 9.3,
                profitFactor: 2.28,
                totalTrades: 734,
                testingPeriod: '10 months',
                averageTrade: 0.48,
                largestWin: 185,
                largestLoss: -95,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-14'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 6.4 },
                { month: 'Feb', pnl: 5.8 },
                { month: 'Mar', pnl: 7.2 },
                { month: 'Apr', pnl: 4.9 },
                { month: 'May', pnl: 8.1 },
                { month: 'Jun', pnl: 6.7 },
                { month: 'Jul', pnl: 5.3 },
                { month: 'Aug', pnl: 7.8 },
                { month: 'Sep', pnl: 6.2 },
                { month: 'Oct', pnl: 4.6 },
                { month: 'Nov', pnl: 5.9 },
                { month: 'Dec', pnl: 7.5 }
            ],
            tags: ['ai', 'low-risk', 'optimized']
        },
        {
            id: 6,
            slug: 'precision-scalper',
            name: 'Precision Scalper',
            shortDescription: 'Ultra-precise scalping system for experienced traders',
            description: 'Precision Scalper is designed for experienced traders who understand the risks of high-frequency trading.',
            price: 59,
            platform: 'MT4',
            strategy: 'Scalping',
            riskLevel: 'High',
            features: [
                'Ultra-fast execution',
                'Tight spread analysis',
                'Multi-pair scanning',
                'Risk limit controls',
                'Session filters'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'FXCM'],
            recommendedPairs: ['EURUSD', 'USDJPY', 'GBPUSD'],
            minimumDeposit: 750,
            timeframe: 'M1',
            performance: {
                winRate: 82,
                maxDrawdown: 18.6,
                profitFactor: 1.45,
                totalTrades: 2850,
                testingPeriod: '6 months',
                averageTrade: 0.18,
                largestWin: 45,
                largestLoss: -38,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-11'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 15.2 },
                { month: 'Feb', pnl: 12.8 },
                { month: 'Mar', pnl: -8.4 },
                { month: 'Apr', pnl: 18.6 },
                { month: 'May', pnl: 14.3 },
                { month: 'Jun', pnl: 11.7 },
                { month: 'Jul', pnl: 9.5 },
                { month: 'Aug', pnl: 16.8 },
                { month: 'Sep', pnl: 13.2 },
                { month: 'Oct', pnl: -6.9 },
                { month: 'Nov', pnl: 15.4 },
                { month: 'Dec', pnl: 12.1 }
            ],
            tags: ['scalping', 'high-frequency', 'experienced']
        },
        {
            id: 7,
            slug: 'momentum-pro',
            name: 'Momentum Pro',
            shortDescription: 'Professional momentum trading system with advanced filters',
            description: 'Momentum Pro identifies strong market momentum and trades in the direction of the trend with advanced confirmation filters.',
            price: 99,
            platform: 'MT5',
            strategy: 'Momentum',
            riskLevel: 'Medium',
            features: [
                'Momentum detection',
                'Trend confirmation',
                'Volume analysis',
                'Custom filters',
                'Risk management suite'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'OANDA', 'XM'],
            recommendedPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'EURJPY'],
            minimumDeposit: 1200,
            timeframe: 'H1',
            performance: {
                winRate: 68,
                maxDrawdown: 14.1,
                profitFactor: 1.78,
                totalTrades: 768,
                testingPeriod: '14 months',
                averageTrade: 0.52,
                largestWin: 280,
                largestLoss: -160,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-13'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 8.7 },
                { month: 'Feb', pnl: 6.3 },
                { month: 'Mar', pnl: 9.5 },
                { month: 'Apr', pnl: -2.4 },
                { month: 'May', pnl: 7.8 },
                { month: 'Jun', pnl: 10.2 },
                { month: 'Jul', pnl: 5.6 },
                { month: 'Aug', pnl: 8.9 },
                { month: 'Sep', pnl: 7.1 },
                { month: 'Oct', pnl: 4.8 },
                { month: 'Nov', pnl: 9.7 },
                { month: 'Dec', pnl: 6.5 }
            ],
            tags: ['momentum', 'trend', 'medium-risk']
        },
        {
            id: 8,
            slug: 'forex-hunter',
            name: 'Forex Hunter',
            shortDescription: 'Aggressive hunting system for volatile market conditions',
            description: 'Forex Hunter is designed to capitalize on market volatility and news events with aggressive position management.',
            price: 119,
            platform: 'MT4',
            strategy: 'Aggressive',
            riskLevel: 'High',
            features: [
                'Volatility tracking',
                'News trading',
                'Aggressive entries',
                'Stop loss optimization',
                'Session analysis'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'FXCM'],
            recommendedPairs: ['GBPUSD', 'EURJPY', 'GBPJPY', 'USDCHF'],
            minimumDeposit: 2500,
            timeframe: 'M15',
            performance: {
                winRate: 55,
                maxDrawdown: 28.4,
                profitFactor: 1.52,
                totalTrades: 546,
                testingPeriod: '8 months',
                averageTrade: 0.92,
                largestWin: 520,
                largestLoss: -310,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-09'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 18.4 },
                { month: 'Feb', pnl: -12.6 },
                { month: 'Mar', pnl: 22.8 },
                { month: 'Apr', pnl: 15.3 },
                { month: 'May', pnl: -8.9 },
                { month: 'Jun', pnl: 19.7 },
                { month: 'Jul', pnl: 11.5 },
                { month: 'Aug', pnl: 16.2 },
                { month: 'Sep', pnl: -5.4 },
                { month: 'Oct', pnl: 20.6 },
                { month: 'Nov', pnl: 14.8 },
                { month: 'Dec', pnl: 8.3 }
            ],
            tags: ['aggressive', 'volatility', 'high-risk']
        },
        {
            id: 9,
            slug: 'titan-ea',
            name: 'Titan EA',
            shortDescription: 'Institutional-grade trading system with advanced risk management',
            description: 'Titan EA brings institutional-grade trading strategies to retail traders with sophisticated risk management.',
            price: 199,
            platform: 'MT5',
            strategy: 'Institutional',
            riskLevel: 'Low',
            features: [
                'Institutional strategies',
                'Advanced risk management',
                'Portfolio optimization',
                'Market microstructure',
                'Professional analytics'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'OANDA', 'XM', 'FXCM'],
            recommendedPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'],
            minimumDeposit: 5000,
            timeframe: 'H4',
            performance: {
                winRate: 65,
                maxDrawdown: 7.2,
                profitFactor: 2.45,
                totalTrades: 328,
                testingPeriod: '20 months',
                averageTrade: 0.85,
                largestWin: 380,
                largestLoss: -140,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-16'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 4.8 },
                { month: 'Feb', pnl: 5.6 },
                { month: 'Mar', pnl: 3.9 },
                { month: 'Apr', pnl: 6.2 },
                { month: 'May', pnl: 4.1 },
                { month: 'Jun', pnl: 5.8 },
                { month: 'Jul', pnl: 4.7 },
                { month: 'Aug', pnl: 6.5 },
                { month: 'Sep', pnl: 3.8 },
                { month: 'Oct', pnl: 5.4 },
                { month: 'Nov', pnl: 4.3 },
                { month: 'Dec', pnl: 5.9 }
            ],
            tags: ['institutional', 'low-risk', 'professional']
        },
        {
            id: 10,
            slug: 'quantum-trader',
            name: 'Quantum Trader',
            shortDescription: 'Quantum-inspired algorithm for predictive market analysis',
            description: 'Quantum Trader uses advanced mathematical models inspired by quantum computing principles to predict market movements.',
            price: 179,
            platform: 'MT5',
            strategy: 'Algorithmic',
            riskLevel: 'Medium',
            features: [
                'Quantum algorithms',
                'Predictive analytics',
                'Pattern recognition',
                'Neural networks',
                'Adaptive learning'
            ],
            supportedBrokers: ['IC Markets', 'Pepperstone', 'XM'],
            recommendedPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'EURGBP'],
            minimumDeposit: 3500,
            timeframe: 'M30',
            performance: {
                winRate: 72,
                maxDrawdown: 13.8,
                profitFactor: 1.88,
                totalTrades: 642,
                testingPeriod: '11 months',
                averageTrade: 0.58,
                largestWin: 240,
                largestLoss: -130,
                source: 'DEMO DATA',
                lastUpdated: '2024-01-15'
            },
            monthlyPerformance: [
                { month: 'Jan', pnl: 7.9 },
                { month: 'Feb', pnl: 6.4 },
                { month: 'Mar', pnl: 8.7 },
                { month: 'Apr', pnl: -1.8 },
                { month: 'May', pnl: 7.2 },
                { month: 'Jun', pnl: 9.1 },
                { month: 'Jul', pnl: 5.8 },
                { month: 'Aug', pnl: 8.3 },
                { month: 'Sep', pnl: 6.9 },
                { month: 'Oct', pnl: 4.5 },
                { month: 'Nov', pnl: 7.6 },
                { month: 'Dec', pnl: 8.8 }
            ],
            tags: ['algorithmic', 'ai', 'predictive']
        }
    ],
    
    conversations: [
        {
            id: 1,
            customerId: 1,
            productId: 1,
            status: 'active',
            lastMessage: 'Yes, which broker are you using?',
            lastMessageTime: '2024-01-15T10:30:00',
            unreadCount: 0
        },
        {
            id: 2,
            customerId: 2,
            productId: 2,
            status: 'new',
            lastMessage: 'Hi, is Trend Rider suitable for beginners?',
            lastMessageTime: '2024-01-15T11:45:00',
            unreadCount: 1
        },
        {
            id: 3,
            customerId: 3,
            productId: 3,
            status: 'payment',
            lastMessage: 'Payment received, preparing your EA files.',
            lastMessageTime: '2024-01-15T09:15:00',
            unreadCount: 0
        }
    ],
    
    customers: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            registrationDate: '2024-01-10',
            totalSpent: 178,
            orders: 2,
            conversations: 1
        },
        {
            id: 2,
            name: 'Sarah Smith',
            email: 'sarah.smith@example.com',
            registrationDate: '2024-01-12',
            totalSpent: 89,
            orders: 1,
            conversations: 1
        },
        {
            id: 3,
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            registrationDate: '2024-01-14',
            totalSpent: 129,
            orders: 1,
            conversations: 1
        }
    ],
    
    orders: [
        {
            id: 'EA-1042',
            customerId: 3,
            productId: 3,
            amount: 129,
            status: 'paid',
            paymentStatus: 'paid',
            deliveryStatus: 'pending',
            createdAt: '2024-01-14T14:00:00'
        },
        {
            id: 'EA-1041',
            customerId: 1,
            productId: 1,
            amount: 49,
            status: 'completed',
            paymentStatus: 'paid',
            deliveryStatus: 'delivered',
            createdAt: '2024-01-10T10:00:00'
        },
        {
            id: 'EA-1040',
            customerId: 2,
            productId: 2,
            amount: 89,
            status: 'paid',
            paymentStatus: 'paid',
            deliveryStatus: 'delivered',
            createdAt: '2024-01-12T15:30:00'
        }
    ],
    
    faqs: [
        {
            question: 'What is an Expert Advisor (EA)?',
            answer: 'An Expert Advisor (EA) is an automated trading system that runs on MetaTrader platforms. It can analyze markets, identify trading opportunities, and execute trades automatically based on predefined rules and algorithms.'
        },
        {
            question: 'Which platforms are supported?',
            answer: 'Our EAs are compatible with MetaTrader 4 (MT4) and MetaTrader 5 (MT5) platforms. Each product page clearly indicates which platform is supported.'
        },
        {
            question: 'How do I install an EA?',
            answer: 'Installation is straightforward. After purchase, you\'ll receive detailed instructions and video tutorials. Typically, you copy the EA file to the appropriate folder in your MetaTrader installation and enable automated trading.'
        },
        {
            question: 'Can I test the EA on a demo account?',
            answer: 'Yes, we highly recommend testing on a demo account first. This allows you to understand the EA\'s behavior and performance without risking real funds.'
        },
        {
            question: 'Which brokers are supported?',
            answer: 'Our EAs work with most major forex brokers that support MetaTrader platforms. We recommend using ECN brokers with low spreads for optimal performance.'
        },
        {
            question: 'Do you provide installation support?',
            answer: 'Yes, we provide comprehensive installation support. You can chat directly with our team if you need assistance.'
        },
        {
            question: 'Do you provide updates?',
            answer: 'Yes, we provide regular updates to improve performance and adapt to changing market conditions. Updates are included with your purchase.'
        },
        {
            question: 'What happens after purchase?',
            answer: 'After payment, you\'ll receive immediate access to download the EA file along with installation instructions and documentation.'
        },
        {
            question: 'Do you offer refunds?',
            answer: 'Due to the digital nature of our products, we generally do not offer refunds. However, we provide full support to ensure you get the most from your purchase.'
        },
        {
            question: 'Does an EA guarantee profit?',
            answer: 'No trading system can guarantee profits. Automated trading involves substantial risk, and past performance does not guarantee future results. Always trade responsibly and never risk more than you can afford to lose.'
        }
    ],
    
    blogPosts: [
        {
            id: 1,
            title: 'What Is an Expert Advisor (EA)?',
            category: 'Expert Advisors',
            excerpt: 'Learn about automated trading systems and how they work on MetaTrader platforms.',
            date: '2024-01-15',
            readTime: '5 min read'
        },
        {
            id: 2,
            title: 'MT4 vs MT5: Which Platform Should You Choose?',
            category: 'Platforms',
            excerpt: 'A comprehensive comparison of MetaTrader 4 and MetaTrader 5 for automated trading.',
            date: '2024-01-12',
            readTime: '7 min read'
        },
        {
            id: 3,
            title: 'How to Install an Expert Advisor',
            category: 'Tutorials',
            excerpt: 'Step-by-step guide to installing and configuring EAs on MetaTrader.',
            date: '2024-01-10',
            readTime: '6 min read'
        },
        {
            id: 4,
            title: 'Understanding Drawdown in Trading',
            category: 'Risk Management',
            excerpt: 'What is drawdown and why it matters for your trading strategy.',
            date: '2024-01-08',
            readTime: '4 min read'
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEMO_DATA;
}
