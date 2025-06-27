import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, Zap, BarChart3, AlertTriangle, CheckCircle, XCircle, Target, DollarSign, Shield, Flame, Star } from 'lucide-react';

const CryptoMarketAnalyzer = () => {
  const [marketData, setMarketData] = useState({
    totalMarketCap: '',
    marketCapChange24h: '',
    totalVolume: '',
    volumeChange24h: '',
    btcDominance: '',
    fearGreedIndex: '',
    ethDominance: '',
    activeCryptocurrencies: ''
  });

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleInputChange = (field, value) => {
    setMarketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const analyzeMarket = async () => {
    setIsAnalyzing(true);
    
    // Add animation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = {
      marketCapChange: parseFloat(marketData.marketCapChange24h) || 0,
      volumeChange: parseFloat(marketData.volumeChange24h) || 0,
      btcDominance: parseFloat(marketData.btcDominance) || 50,
      ethDominance: parseFloat(marketData.ethDominance) || 15,
      fearGreed: parseInt(marketData.fearGreedIndex) || 50,
      totalVolume: parseFloat(marketData.totalVolume) || 0,
      totalMarketCap: parseFloat(marketData.totalMarketCap) || 0,
      activeCryptos: parseInt(marketData.activeCryptocurrencies) || 10000
    };

    // Enhanced analysis logic
    const volatility = Math.abs(data.marketCapChange) + Math.abs(data.volumeChange);
    const sentiment = data.fearGreed;
    const altcoinDominance = 100 - data.btcDominance - data.ethDominance;
    const volumeToMcapRatio = data.totalVolume / data.totalMarketCap * 100;

    // Scalping Analysis
    const scalpingScore = calculateScalpingScore(data, volatility, volumeToMcapRatio);
    const scalpingRecommendation = getScalpingRecommendation(scalpingScore, data);

    // Day Trading Analysis
    const dayTradingScore = calculateDayTradingScore(data, volatility, altcoinDominance);
    const dayTradingRecommendation = getDayTradingRecommendation(dayTradingScore, data);

    // Swing Trading Analysis
    const swingTradingScore = calculateSwingTradingScore(data, sentiment, altcoinDominance);
    const swingTradingRecommendation = getSwingTradingRecommendation(swingTradingScore, data);

    setAnalysis({
      scalping: { score: scalpingScore, ...scalpingRecommendation },
      dayTrading: { score: dayTradingScore, ...dayTradingRecommendation },
      swingTrading: { score: swingTradingScore, ...swingTradingRecommendation },
      marketCondition: getOverallMarketCondition(data, volatility, sentiment, altcoinDominance),
      marketMetrics: {
        volatility: volatility.toFixed(1),
        sentiment: getSentimentLabel(sentiment),
        altcoinSeason: altcoinDominance > 35 ? 'Active' : 'Dormant',
        volumeRatio: volumeToMcapRatio.toFixed(2)
      }
    });
    
    setIsAnalyzing(false);
  };

  const calculateScalpingScore = (data, volatility, volumeRatio) => {
    let score = 0;
    
    // High volume ratio is excellent for scalping
    if (volumeRatio > 15) score += 35;
    else if (volumeRatio > 10) score += 25;
    else if (volumeRatio > 5) score += 15;
    
    // Volume change momentum
    if (data.volumeChange > 30) score += 25;
    else if (data.volumeChange > 15) score += 15;
    else if (data.volumeChange > 0) score += 5;
    
    // Optimal volatility range for scalping
    if (volatility > 6 && volatility < 18) score += 25;
    else if (volatility > 3 && volatility < 25) score += 15;
    
    // BTC dominance effect on scalping
    if (data.btcDominance > 45 && data.btcDominance < 65) score += 10;
    
    // Fear/Greed extremes can create scalping opportunities
    if (data.fearGreed < 25 || data.fearGreed > 75) score += 5;
    
    return Math.min(score, 100);
  };

  const calculateDayTradingScore = (data, volatility, altcoinDominance) => {
    let score = 0;
    
    // Volatility sweet spot for day trading
    if (volatility > 10 && volatility < 30) score += 30;
    else if (volatility > 5) score += 20;
    
    // Market cap movement indicates trend strength
    if (Math.abs(data.marketCapChange) > 3) score += 25;
    else if (Math.abs(data.marketCapChange) > 1) score += 15;
    
    // Volume increase supports day trading
    if (data.volumeChange > 20) score += 20;
    else if (data.volumeChange > 10) score += 10;
    
    // Altcoin dominance for diverse opportunities
    if (altcoinDominance > 30) score += 15;
    else if (altcoinDominance > 25) score += 10;
    
    // Fear/Greed for momentum identification
    if (data.fearGreed < 35 || data.fearGreed > 65) score += 10;
    
    return Math.min(score, 100);
  };

  const calculateSwingTradingScore = (data, sentiment, altcoinDominance) => {
    let score = 0;
    
    // Extreme sentiment creates swing opportunities
    if (sentiment < 25) score += 35; // Extreme fear
    else if (sentiment > 75) score += 25; // Extreme greed
    else if (sentiment > 35 && sentiment < 65) score += 15; // Neutral
    
    // Moderate market cap change indicates sustainable trends
    if (Math.abs(data.marketCapChange) > 2 && Math.abs(data.marketCapChange) < 12) score += 25;
    
    // BTC dominance trends affect swing trading
    if (data.btcDominance > 40 && data.btcDominance < 60) score += 20;
    else if (data.btcDominance < 40 || data.btcDominance > 65) score += 10;
    
    // Altcoin season benefits swing traders
    if (altcoinDominance > 35) score += 15;
    
    // Volume consistency
    if (data.volumeChange > -10 && data.volumeChange < 50) score += 5;
    
    return Math.min(score, 100);
  };

  const getSentimentLabel = (score) => {
    if (score < 25) return 'Extreme Fear';
    if (score < 45) return 'Fear';
    if (score < 55) return 'Neutral';
    if (score < 75) return 'Greed';
    return 'Extreme Greed';
  };

  const getScalpingRecommendation = (score, data) => {
    if (score >= 70) {
      return {
        status: 'excellent',
        recommendation: 'Premium scalping conditions detected',
        tips: ['Target 1-5 minute timeframes', 'Focus on BTC/ETH major pairs', 'Use 0.1-0.3% profit targets', 'Tight stop losses (0.05-0.15%)'],
        risks: ['Watch for sudden news events', 'Monitor order book depth', 'Avoid low liquidity hours'],
        bestPairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT']
      };
    } else if (score >= 50) {
      return {
        status: 'good',
        recommendation: 'Favorable scalping environment',
        tips: ['Use 5-15 minute charts', 'Focus on trending pairs', 'Scale position sizes down', 'Target 0.2-0.5% profits'],
        risks: ['Avoid choppy market periods', 'Watch spread widening', 'Be patient for clear setups'],
        bestPairs: ['Major pairs only', 'High volume tokens']
      };
    } else {
      return {
        status: 'poor',
        recommendation: 'Challenging scalping conditions',
        tips: ['Consider waiting for better setups', 'Use micro position sizes', 'Focus on fewer trades', 'Extended timeframes'],
        risks: ['Low volume = high slippage', 'Tight ranges limit profits', 'Increased false signals'],
        bestPairs: ['Stick to BTC/ETH only']
      };
    }
  };

  const getDayTradingRecommendation = (score, data) => {
    if (score >= 70) {
      return {
        status: 'excellent',
        recommendation: 'Outstanding day trading opportunities',
        tips: ['Use 15-60 minute timeframes', 'Breakout and trend strategies', 'Target 1-3% profits', 'Trail stop losses'],
        risks: ['Manage position sizes carefully', 'Watch for overnight gaps', 'Set daily loss limits'],
        bestPairs: ['Trending altcoins', 'High volume pairs', 'News-driven tokens']
      };
    } else if (score >= 50) {
      return {
        status: 'good',
        recommendation: 'Solid day trading potential',
        tips: ['Focus on quality setups', 'Use confluence of indicators', '1-2% profit targets', 'Strict risk management'],
        risks: ['Avoid overtrading', 'Watch for false breakouts', 'Market can reverse quickly'],
        bestPairs: ['Established altcoins', 'Medium-cap tokens']
      };
    } else {
      return {
        status: 'poor',
        recommendation: 'Difficult day trading environment',
        tips: ['Reduce trade frequency', 'Range-bound strategies', 'Smaller position sizes', 'Focus on support/resistance'],
        risks: ['Choppy price action', 'Higher false signal rate', 'Sideways market grinding'],
        bestPairs: ['Major pairs only', 'Avoid small-caps']
      };
    }
  };

  const getSwingTradingRecommendation = (score, data) => {
    if (score >= 70) {
      return {
        status: 'excellent',
        recommendation: 'Exceptional swing trading setup',
        tips: ['Use daily/weekly charts', 'Target major reversals', '5-15% profit targets', 'Wide stop losses (3-8%)'],
        risks: ['Hold through volatility', 'Fundamental changes', 'Macro economic shifts'],
        bestPairs: ['Large-cap altcoins', 'DeFi leaders', 'Layer-1 protocols']
      };
    } else if (score >= 50) {
      return {
        status: 'good',
        recommendation: 'Good swing trading conditions',
        tips: ['Focus on weekly trends', 'Use multiple timeframes', '3-8% profit targets', 'Patient entry timing'],
        risks: ['Market may chop sideways', 'Requires patience', 'Economic events impact'],
        bestPairs: ['Established projects', 'Sector leaders']
      };
    } else {
      return {
        status: 'poor',
        recommendation: 'Limited swing opportunities',
        tips: ['Wait for clearer trends', 'Consider DCA strategies', 'Reduce position sizes', 'Focus on blue-chips'],
        risks: ['Range-bound markets', 'Higher whipsaw risk', 'Trend uncertainty'],
        bestPairs: ['BTC/ETH primarily', 'Top 10 coins only']
      };
    }
  };

  const getOverallMarketCondition = (data, volatility, sentiment, altcoinDominance) => {
    if (data.marketCapChange > 8 && data.volumeChange > 25) {
      return { condition: 'Explosive Bull Run', color: 'text-green-400', icon: Flame, bgColor: 'bg-gradient-to-r from-green-400 to-emerald-500' };
    } else if (data.marketCapChange > 3 && data.volumeChange > 10) {
      return { condition: 'Bull Market', color: 'text-green-500', icon: TrendingUp, bgColor: 'bg-gradient-to-r from-green-500 to-green-600' };
    } else if (data.marketCapChange < -8 && data.volumeChange > 25) {
      return { condition: 'Heavy Selling', color: 'text-red-400', icon: TrendingDown, bgColor: 'bg-gradient-to-r from-red-500 to-red-600' };
    } else if (data.marketCapChange < -3) {
      return { condition: 'Bear Market', color: 'text-red-500', icon: TrendingDown, bgColor: 'bg-gradient-to-r from-red-400 to-red-500' };
    } else if (volatility > 15) {
      return { condition: 'High Volatility', color: 'text-orange-400', icon: Activity, bgColor: 'bg-gradient-to-r from-orange-400 to-orange-500' };
    } else if (altcoinDominance > 35) {
      return { condition: 'Altcoin Season', color: 'text-purple-400', icon: Star, bgColor: 'bg-gradient-to-r from-purple-400 to-purple-500' };
    } else {
      return { condition: 'Consolidation', color: 'text-blue-400', icon: BarChart3, bgColor: 'bg-gradient-to-r from-blue-400 to-blue-500' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'good': return <CheckCircle className="w-6 h-6 text-yellow-400" />;
      case 'poor': return <XCircle className="w-6 h-6 text-red-400" />;
      default: return <AlertTriangle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'excellent': return 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300';
      case 'good': return 'bg-gradient-to-br from-yellow-400 to-orange-400 border-yellow-300';
      case 'poor': return 'bg-gradient-to-br from-red-400 to-pink-500 border-red-300';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-xl mr-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Web3Hausa Market Intelligence
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Advanced crypto market analysis powered by real-time data. Get professional trading insights for scalping, day trading, and swing trading strategies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-400" />
              Market Data Input
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Market Cap ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="1000000000"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="e.g., 2500000000000"
                      value={marketData.totalMarketCap}
                      onChange={(e) => handleInputChange('totalMarketCap', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Market Cap 24h Change (%)
                  </label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="e.g., 2.5 or -3.2"
                      value={marketData.marketCapChange24h}
                      onChange={(e) => handleInputChange('marketCapChange24h', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Volume 24h ($)
                  </label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="1000000000"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="e.g., 95000000000"
                      value={marketData.totalVolume}
                      onChange={(e) => handleInputChange('totalVolume', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Volume 24h Change (%)
                  </label>
                  <div className="relative">
                    <BarChart3 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="e.g., 15.3 or -8.7"
                      value={marketData.volumeChange24h}
                      onChange={(e) => handleInputChange('volumeChange24h', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bitcoin Dominance (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="e.g., 52.3"
                    value={marketData.btcDominance}
                    onChange={(e) => handleInputChange('btcDominance', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ethereum Dominance (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="e.g., 17.2"
                    value={marketData.ethDominance}
                    onChange={(e) => handleInputChange('ethDominance', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fear & Greed Index
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="e.g., 75"
                    value={marketData.fearGreedIndex}
                    onChange={(e) => handleInputChange('fearGreedIndex', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Active Cryptocurrencies
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="e.g., 13847"
                  value={marketData.activeCryptocurrencies}
                  onChange={(e) => handleInputChange('activeCryptocurrencies', e.target.value)}
                />
              </div>

              <button
                onClick={analyzeMarket}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Market...
                  </div>
                ) : (
                  'Analyze Market Conditions'
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysis && (
              <>
                {/* Overall Market Condition */}
                <div className={`${analysis.marketCondition.bgColor} p-6 rounded-2xl shadow-2xl border border-white/20`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <analysis.marketCondition.icon className="w-8 h-8 text-white mr-3" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Market Status</h3>
                        <p className="text-white/90 text-lg">{analysis.marketCondition.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/80 text-sm">Market Metrics</div>
                      <div className="text-white font-semibold">
                        Vol: {analysis.marketMetrics.volatility}% | {analysis.marketMetrics.sentiment}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trading Analysis Cards */}
                <div className="space-y-4">
                  {/* Scalping */}
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${getStatusGradient(analysis.scalping.status)} mr-3`}>
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Scalping</h3>
                          <p className="text-gray-300">{analysis.scalping.recommendation}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(analysis.scalping.status)}
                        <span className="ml-2 text-2xl font-bold text-white">{analysis.scalping.score}</span>
                        <span className="text-gray-400">/100</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Best Practices</h4>
                        <ul className="space-y-1 text-gray-300">
                          {analysis.scalping.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Risk Factors</h4>
                        <ul className="space-y-1 text-gray-300">
                          {analysis.scalping.risks.map((risk, index) => (
                            <li key={index}>• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Day Trading */}
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${getStatusGradient(analysis.dayTrading.status)} mr-3`}>
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Day Trading</h3>
                          <p className="text-gray-300">{analysis.dayTrading.recommendation}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(analysis.dayTrading.status)}
                        <span className="ml-2 text-2xl font-bold text-white">{analysis.dayTrading.score}</span>
                        <span className="text-gray-400">/100</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Strategy Tips</h4>
                        <ul className="space-y-1 text-gray-300">
                          {analysis.dayTrading.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Risk Factors</h4>
                        <ul className="space-y-1 text-gray-300">
                          {analysis.dayTrading.risks.map((risk, index) => (
                            <li key={index}>• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Swing Trading */}
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${getStatusGradient(analysis.swingTrading.status)} mr-3`}>
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Swing Trading</h3>
                          <p className="text-gray-300">{analysis.swingTrading.recommendation}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(analysis.swingTrading.status)}
                        <span className="ml-2 text-2xl font-bold text-white">{analysis.swingTrading.score}</span>
                        <span className="text-gray-400">/100</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Strategy Tips</h4>
                        <ul className="space-y-1 text-gray-300">
                          {analysis.swingTrading.tips.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Risk Factors</h4>
                        <ul className="space-y-1 text-gray-300">
                          {analysis.swingTrading.risks.map((risk, index) => (
                            <li key={index}>• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!analysis && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-12 rounded-2xl shadow-2xl text-center">
                <div className="mb-6">
                  <BarChart3 className="w-16 h-16 mx-auto text-gray-400 opacity-50" />
                </div>
                <p className="text-gray-300 text-lg mb-4">Ready to analyze market conditions</p>
                <p className="text-gray-400">Enter your CoinMarketCap data and click analyze to get professional trading insights</p>
              </div>
            )}
          </div>
        </div>

        {/* How to Use Guide */}
        <div className="mt-12 bg-white/5 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-blue-400" />
            How to Use This Professional Tool
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-400">📊 Data Collection</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Visit CoinMarketCap.com homepage</li>
                <li>• Copy Total Market Cap value</li>
                <li>• Note the 24h change percentage</li>
                <li>• Get Total Volume and its 24h change</li>
                <li>• Find Bitcoin & Ethereum dominance</li>
                <li>• Check Fear & Greed Index (separate site)</li>
                <li>• Count active cryptocurrencies</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-400">🎯 Score Interpretation</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• <span className="text-green-400">70-100:</span> Excellent conditions</li>
                <li>• <span className="text-yellow-400">50-69:</span> Good opportunities</li>
                <li>• <span className="text-red-400">0-49:</span> Challenging environment</li>
                <li>• Higher scores = Better conditions</li>
                <li>• Each strategy has unique scoring</li>
                <li>• Consider multiple factors together</li>
                <li>• Use alongside technical analysis</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-400">⚠️ Risk Management</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Never risk more than 2% per trade</li>
                <li>• Use stop losses on every position</li>
                <li>• Diversify across multiple pairs</li>
                <li>• Avoid overtrading in poor conditions</li>
                <li>• Keep position sizes smaller in volatility</li>
                <li>• Always have an exit strategy</li>
                <li>• Monitor news and fundamentals</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-400/30">
            <p className="text-center text-gray-300">
              <strong className="text-white">Disclaimer:</strong> This tool provides educational analysis only. 
              Cryptocurrency trading involves substantial risk. Always do your own research and never invest more than you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoMarketAnalyzer;