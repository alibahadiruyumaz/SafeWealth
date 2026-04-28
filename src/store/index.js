import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './slices/cryptoSlice';
import favoritesReducer from './slices/favoritesSlice';
import portfolioReducer from './slices/portfolioSlice'; // YENİ: 6. Hafta Portföy hafızası eklendi

/**
 * Single Source of Truth (Tek Doğru Kaynağı)
 * Uygulamanın bellek yönetimini optimize eden ve tüm verilerin tutulduğu ana Redux deposu.
 */
export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    favorites: favoritesReducer,
    portfolio: portfolioReducer, // "İleride eklenecek" dediğimiz portföy yöneticisi artık aktif.
  },
  // Redux Toolkit varsayılan olarak middleware'leri otomatik yapılandırır,
  // bu sayede RAM tüketimi asgari seviyede tutulur.
});