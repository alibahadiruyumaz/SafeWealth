import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMarketData } from '../../api/cryptoService';

/**
 * Asenkron Thunk: API'den veriyi çekip Redux state'ine aktaran köprü.
 * Proje raporundaki "dış verilerin global state'e aktarılması" gereksinimini karşılar.
 */
export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      // 3. Haftada yazdığımız asenkron servis fonksiyonunu çağırıyoruz
      const response = await fetchMarketData();
      return response; // Başarılı olursa bu veri 'fulfilled' durumunda action.payload olacak
    } catch (error) {
      // Hata durumunda axiosClient'taki interceptor'dan gelen hatayı Redux'a iletiyoruz
      return rejectWithValue(error.message || 'Veri çekilirken asenkron bir hata oluştu');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    data: [],        // Çekilen coin listesi burada tutulacak
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,     // Hata mesajları
  },
  reducers: {}, // Şimdilik sadece asenkron işlemlerimiz olduğu için burası boş
  extraReducers: (builder) => {
    builder
      // İstek başladığında (Ağ gecikmesi / Latency toleransı anı)
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // İstek başarılı olduğunda veriyi state'e yaz
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      // İstek başarısız olduğunda (Örn: İnternet koptuğunda)
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; 
      });
  },
});

export default cryptoSlice.reducer;