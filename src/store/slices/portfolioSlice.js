import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assets: [], 
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addAsset: (state, action) => {
      // YENİ MANTIK: Gelen coin listede zaten var mı diye bakıyoruz
      const existingIndex = state.assets.findIndex(asset => asset.id === action.payload.id);
      
      if (existingIndex !== -1) {
        // Eğer zaten varsa, yeni girilen miktarı eskisinin üstüne ekle (Örn: 3 + 2 = 5 USDT)
        state.assets[existingIndex].amount += action.payload.amount;
      } else {
        // Listede hiç yoksa yeni bir satır olarak ekle
        state.assets.push(action.payload);
      }
    },
    updateAsset: (state, action) => {
      const index = state.assets.findIndex(asset => asset.id === action.payload.id);
      if (index !== -1) {
        state.assets[index] = action.payload; 
      }
    },
    deleteAsset: (state, action) => {
      state.assets = state.assets.filter(asset => asset.id !== action.payload);
    },
    // YENİ EKLENEN KOD: Portföyü tamamen sıfırlar (Ayarlar sayfasındaki buton için)
    clearPortfolio: (state) => {
      state.assets = [];
    },
  },
});

// clearPortfolio aksiyonunu da dışa aktarıyoruz
export const { addAsset, updateAsset, deleteAsset, clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;