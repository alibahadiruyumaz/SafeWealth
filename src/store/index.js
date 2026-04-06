import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './slices/cryptoSlice';
import favoritesReducer from './slices/favoritesSlice';

/**
 * Single Source of Truth (Tek Doğru Kaynağı)
 * Uygulamanın bellek yönetimini optimize eden ve tüm verilerin tutulduğu ana Redux deposu.
 */
export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    favorites: favoritesReducer,
    // İlerleyen haftalarda AsyncStorage ile çekeceğimiz kullanıcı bakiyelerini 
    // yönetecek olan "portfolioReducer" da buraya eklenecek.
  },
  // Redux Toolkit varsayılan olarak middleware'leri otomatik yapılandırır,
  // bu sayede RAM tüketimi asgari seviyede tutulur.
});