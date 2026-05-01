import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import cryptoReducer from './slices/cryptoSlice';
import favoritesReducer from './slices/favoritesSlice';
import portfolioReducer from './slices/portfolioSlice';

// MİMARİ KARAR: Sadece yerelde kalması gereken kullanıcı verilerini seçiyoruz.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  
  whitelist: ['favorites', 'portfolio'], 
};

const rootReducer = combineReducers({
  crypto: cryptoReducer,
  favorites: favoritesReducer,
  portfolio: portfolioReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist'in dahili aksiyonlarını serileştirme hatalarından gizler
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);