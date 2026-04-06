import axiosClient from './axiosClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

/**
 * CoinGecko API'sinden piyasa verilerini asenkron olarak çeken ana servis fonksiyonu.
 * @param {string} currency - Karşılaştırma para birimi (varsayılan: 'usd')
 * @param {number} limit - Kaç adet coin çekileceği (varsayılan: 50)
 * @returns {Promise<Array>} - Çekilen kripto varlık listesi
 */
export const fetchMarketData = async (currency = 'usd', limit = 50) => {
  try {
    const response = await axiosClient.get(ENDPOINTS.COINS_MARKETS, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc', 
        per_page: limit,
        page: 1,
        sparkline: true, 
        price_change_percentage: '24h', 
      },
    });
    
    // axiosClient.js içindeki interceptor zaten response.data döndürdüğü için 
    // burada direkt olarak gelen veriyi döndürüyoruz.
    return response; 
  } catch (error) {
    throw error;
  }
};

/**
 * Belirli bir coinin son 7 günlük piyasa geçmişini çeker (Grafik için)
 * @param {string} coinId - Örn: 'bitcoin', 'ethereum'
 */
export const fetchCoinMarketChart = async (coinId) => {
  try {
    // CoinGecko API'sinden 7 günlük (days=7) USD bazında geçmiş fiyatları istiyoruz
    const response = await axiosClient.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: '7',
      }
    });
    
    // DİKKAT: Interceptor zaten data'yı elediği için doğrudan response.prices döndürüyoruz!
    return response.prices; 
  } catch (error) {
    console.error(`Grafik verisi çekilirken hata oluştu (${coinId}):`, error);
    throw error;
  }
};