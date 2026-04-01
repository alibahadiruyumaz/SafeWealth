import React, { useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '../store/slices/cryptoSlice';

/**
 * Figma Tasarımına Sadık Liste Elemanı
 * React.memo ile sarmalanarak sadece verisi değiştiğinde re-render olur.
 */
const CryptoListItem = React.memo(({ item }) => {
  // Dinamik Hassasiyet: Fiyat çok küçükse daha fazla basamak gösterir (Shiba Inu vb.)
  const formatPrice = (price) => {
    if (price >= 1) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price > 0.001) {
      return price.toFixed(4);
    } else {
      return price.toFixed(8); // Çok küçük fiyatlı coinler için 8 basamak
    }
  };

  const isPositive = item.price_change_percentage_24h >= 0;

  return (
    <View style={styles.itemContainer}>
      {/* SOL SÜTUN: İsim ve Sembol */}
      <View style={styles.nameContainer}>
        <Text style={styles.coinName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
      </View>
      
      {/* SAĞ SÜTUN: Fiyat ve Değişim */}
      <View style={styles.priceContainer}>
        <Text style={styles.coinPrice}>${formatPrice(item.current_price)}</Text>
        <Text style={[styles.coinPercentage, { color: isPositive ? '#00C853' : '#FF3D00' }]}>
          {isPositive ? '▲' : '▼'} {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
        </Text>
      </View>
    </View>
  );
});

export default function Dashboard() {
  const dispatch = useDispatch();
  
  // Redux Store'dan verileri çekiyoruz
  const { data, status, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    // Sayfa açıldığında eğer veri yoksa API isteğini başlatır
    if (status === 'idle') {
      dispatch(fetchCryptoData());
    }
  }, [status, dispatch]);

  // Filtreleme: Fiyatı 0 olan anlamsız verileri temizler
  const filteredData = useMemo(() => {
    return data.filter(coin => coin.current_price > 0);
  }, [data]);

  // Performans Optimizasyonları
  const renderItem = useCallback(({ item }) => <CryptoListItem item={item} />, []);
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Yüklenme Ekranı
  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Piyasa verileri senkronize ediliyor...</Text>
      </View>
    );
  }

  // Hata Ekranı
  if (status === 'failed') {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Bağlantı Hatası: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Piyasa Takibi</Text>
        <Text style={styles.headerSubtitle}>Canlı Varlık Değerleri</Text>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={5}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,    // 30'dan 50'ye çıkardık, artık kamera deliğinden tamamen bağımsız ve ferah duracak.
    paddingBottom: 25, // Alt kısımla mesafeyi de biraz artırarak başlığın "sıkışmış" hissini tamamen yok ettik.
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#121212',
    letterSpacing: -0.5,
    marginBottom: 4 // Alt başlıkla arasını biraz açtık
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: '#9E9E9E', 
    fontWeight: '500',
    marginTop: 4 
  },
  listContent: {
    paddingBottom: 20
  },
  itemContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  nameContainer: { 
    flex: 1 
  },
  coinName: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#121212' 
  },
  coinSymbol: { 
    fontSize: 13, 
    color: '#9E9E9E', 
    marginTop: 2, 
    fontWeight: '600' 
  },
  priceContainer: { 
    alignItems: 'flex-end' 
  },
  coinPrice: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#121212' 
  },
  coinPercentage: { 
    fontSize: 13, 
    fontWeight: '600', 
    marginTop: 4 
  },
  loadingText: {
    marginTop: 12,
    color: '#9E9E9E',
    fontWeight: '500'
  },
  errorText: {
    color: '#FF3D00',
    fontWeight: '600'
  }
});