// src/utils/analytics.js

export const calculatePortfolioAnalytics = (assets) => {
    if (!assets || assets.length === 0) {
        return { totalValue: 0, totalPnL: 0, pnlPercentage: 0, weighted24hChange: 0, processedAssets: [] };
    }

    let totalValue = 0;
    let totalCost = 0;
    let sumWeightedChange = 0;

    // 1. Aşama: Bireysel Varlık Metrikleri
    const processedAssets = assets.map(asset => {
        const amount = parseFloat(asset.amount) || 0;
        const currentPrice = parseFloat(asset.price) || 0;
        // Fallback: Eski verilerde buyPrice yoksa currentPrice'ı maliyet kabul et (Sıfıra bölmeyi engeller)
        const buyPrice = parseFloat(asset.buyPrice) || currentPrice; 
        const change24h = parseFloat(asset.priceChange24h) || 0; // API'den gelecek

        const assetCurrentValue = amount * currentPrice;
        const assetCostValue = amount * buyPrice;
        
        const pnlValue = assetCurrentValue - assetCostValue;
        const pnlPercentage = assetCostValue > 0 ? (pnlValue / assetCostValue) * 100 : 0;

        totalValue += (isNaN(assetCurrentValue) ? 0 : assetCurrentValue);
        totalCost += (isNaN(assetCostValue) ? 0 : assetCostValue);
        sumWeightedChange += (assetCurrentValue * change24h);

        return {
            ...asset,
            totalValue: isNaN(assetCurrentValue) ? 0 : assetCurrentValue,
            pnlValue: isNaN(pnlValue) ? 0 : pnlValue,
            pnlPercentage: isNaN(pnlPercentage) ? 0 : Number(pnlPercentage.toFixed(2))
        };
    });

    // 2. Aşama: Portföy Ağırlıkları (Risk Dağılımı)
    const finalizedAssets = processedAssets.map(asset => {
        const weight = totalValue > 0 ? (asset.totalValue / totalValue) * 100 : 0;
        return {
            ...asset,
            weightPercentage: isNaN(weight) ? 0 : Number(weight.toFixed(2))
        };
    }).sort((a, b) => b.weightPercentage - a.weightPercentage);

    // 3. Aşama: Global Portföy Metrikleri
    const totalPnL = totalValue - totalCost;
    const pnlPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    const weighted24hChange = totalValue > 0 ? (sumWeightedChange / totalValue) : 0;

    return {
        totalValue,
        totalPnL,
        pnlPercentage: Number(pnlPercentage.toFixed(2)),
        weighted24hChange: Number(weighted24hChange.toFixed(2)),
        processedAssets: finalizedAssets
    };
};