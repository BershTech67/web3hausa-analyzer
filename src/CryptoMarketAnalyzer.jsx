import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Activity, BarChart3, Star, Flame
} from 'lucide-react';

const CryptoMarketAnalyzer = () => {
  const [marketData, setMarketData] = useState({
    totalMarketCap: '',
    marketCapChange24h: '',
    totalVolume: '',
    volumeChange24h: '',
    btcDominance: '',
    ethDominance: '',
    fearGreedIndex: '',
    activeCryptocurrencies: ''
  });

  const [analysis, setAnalysis] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMarketData(prev => ({ ...prev, [name]: value }));
  };

  const analyzeMarket = () => {
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

    const volatility = Math.abs(data.marketCapChange) + Math.abs(data.volumeChange);
    const sentiment = data.fearGreed;
    const altcoinDominance = 100 - data.btcDominance - data.ethDominance;
    const volumeToMcapRatio = (data.totalVolume / data.totalMarketCap) * 100;

    let marketCondition = 'Neutral';
    let recommendation = 'Ka duba sauran alamomi kafin yanke hukunci.';
    let Icon = BarChart3;

    if (data.marketCapChange > 8 && data.volumeChange > 25) {
      marketCondition = 'Babban Hauhawar Kasuwa';
      recommendation = 'Dacewa da Scalping & Day Trading';
      Icon = Flame;
    } else if (data.marketCapChange > 3 && data.volumeChange > 10) {
      marketCondition = 'Bull Market (Hawan Kasuwa)';
      recommendation = 'Yana da kyau ga Day da Swing trading';
      Icon = TrendingUp;
    } else if (data.marketCapChange < -8 && data.volumeChange > 25) {
      marketCondition = 'Kasuwar Sayi Sosai (Heavy Selling)';
      recommendation = 'Scalping hadari – jira ko yi short da hankali';
      Icon = TrendingDown;
    } else if (volatility > 15) {
      marketCondition = 'Babban Canjin Farashi (Volatility)';
      recommendation = 'Dace da ƙwararrun yan ciniki kawai';
      Icon = Activity;
    } else if (altcoinDominance > 35) {
      marketCondition = 'Lokacin Altcoin';
      recommendation = 'Swing traders na iya cin gajiyar hakan';
      Icon = Star;
    }

    setAnalysis({ marketCondition, recommendation, Icon });
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <div className="text-center mb-6">
        <img src="https://web3hausa.xyz/logo.png" alt="Web3Hausa Logo" className="mx-auto w-24 mb-2" />
        <h1 className="text-3xl font-bold text-green-700">Web3Hausa – Crypto Market Analyzer</h1>
        <p className="text-sm text-gray-600 mt-1">Ana nazarin yanayin kasuwa domin Scalping, Day Trading, da Swing Trading</p>
      </div>

      <h2 className="text-xl font-semibold mb-2 text-green-700">🧠 Shin Yau Ranar Ciniki Ce?</h2>
      <p className="text-sm text-gray-600 mb-4">
        Wannan kayan aiki zai taimaka maka ka fahimci yanayin kasuwa ta hanyar amfani da bayanai daga CoinMarketCap. Cike filayen da ke ƙasa domin sanin ko yau rana ce mai kyau don scalping, day trading ko swing trading.
      </p>

      <div className="space-y-2">
        {Object.keys(marketData).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key.replace(/([A-Z])/g, ' $1')}
            value={marketData[key]}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ))}
        <button onClick={analyzeMarket} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Duba Yanayin Kasuwa
        </button>
      </div>

      {analysis && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <analysis.Icon className="w-6 h-6 inline mr-2 text-green-500" />
          <strong>{analysis.marketCondition}</strong>
          <p className="mt-2 text-gray-800">{analysis.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default CryptoMarketAnalyzer;