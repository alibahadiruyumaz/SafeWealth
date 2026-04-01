import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';

// Merkezi Axios örneğimizi (Instance) oluşturuyoruz
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 saniye zaman aşımı toleransı
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptors (Araya Giriciler): Yanıtları veya hataları UI katmanına ulaşmadan önce burada yakalıyoruz
axiosClient.interceptors.response.use(
  (response) => {
    // Sadece bize lazım olan "data" kısmını döndürerek gereksiz veri yükünden kurtuluyoruz
    return response.data;
  },
  (error) => {
    // Projede vadedilen "Gelişmiş Asenkron Hata Yönetimi" kısmı
    if (error.response) {
      // Sunucuya ulaşıldı ama hata döndü (Örn: 429 Rate Limit aşıldı)
      console.error(`[API Sunucu Hatası]: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      // İstek yapıldı ama cevap alınamadı (Ağ gecikmesi veya internet koptu)
      console.error('[API Ağ Hatası]: Sunucudan yanıt alınamadı. Bağlantınızı kontrol edin.');
    } else {
      // İsteği oluştururken bir hata meydana geldi
      console.error('[API İstemci Hatası]:', error.message);
    }
    
    // Hatayı Promise zincirinde aşağıya iletiyoruz
    return Promise.reject(error);
  }
);

export default axiosClient;