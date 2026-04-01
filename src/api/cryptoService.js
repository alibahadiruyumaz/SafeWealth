import axiosClient from './axiosClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

/**
 * CoinGecko API'sinden piyasa verilerini asenkron olarak çeken ana servis fonksiyonu.
 * @param {string} currency - Karşılaştırma para birimi (varsayılan: 'usd')
 * @param {number} limit - Kaç adet coin çekileceği (varsayılan: 10)
 * @returns {Promise<Array>} - Çekilen kripto varlık listesi
 */
export const fetchMarketData = async (currency = 'usd', limit = 50) => {
  try {
    const response = await axiosClient.get(ENDPOINTS.COINS_MARKETS, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc', // Piyasa değerine göre büyükten küçüğe sırala
        per_page: limit,
        page: 1,
        sparkline: true, // İleride Line Chart (Çizgi Grafik) çizerken kullanacağımız 7 günlük mini fiyat geçmişi
        price_change_percentage: '24h', // 24 saatlik değişim yüzdesi
      },
    });
    
    // axiosClient.js içindeki interceptor zaten response.data döndürdüğü için 
    // burada direkt olarak gelen veriyi döndürüyoruz.
    return response; 
  } catch (error) {
    // Merkezi hata yönetimimiz hatayı konsola yazdırdı, 
    // burada state yönetimi (Redux) için hatayı yukarı fırlatıyoruz.
    throw error;
  }
};