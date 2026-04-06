import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [], // Favori coin ID'lerini burada tutacağız (Örn: ['bitcoin', 'ethereum'])
  },
  reducers: {
    // Favorilere ekle/çıkar mantığını tek fonksiyonda (toggle) hallediyoruz
    toggleFavorite: (state, action) => {
      const coinId = action.payload;
      const index = state.items.indexOf(coinId);
      
      if (index >= 0) {
        // Varsa listeden çıkar
        state.items.splice(index, 1);
      } else {
        // Yoksa listeye ekle
        state.items.push(coinId);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;