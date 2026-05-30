import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isHapticEnabled: true, // Varsayılan olarak titreşim açık gelir
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Tüm uygulamadaki titreşimi açıp kapatacak aksiyon
    setHapticStatus: (state, action) => {
      state.isHapticEnabled = action.payload;
    },
  },
});

export const { setHapticStatus } = settingsSlice.actions;
export default settingsSlice.reducer;