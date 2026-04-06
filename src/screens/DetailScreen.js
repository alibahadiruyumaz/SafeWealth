import React, { useState, useEffect } from 'react';
// YENİ: TouchableOpacity import edildi
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// YENİ: Yıldız ikonu için Ionicons eklendi
import { Ionicons } from '@expo/vector-icons'; 

// YENİ: useDispatch ve toggleFavorite action'ı eklendi
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';

import { LineChart } from 'react-native-chart-kit';
import { fetchCoinMarketChart } from '../api/cryptoService';

// YENİ: Parametrelere 'navigation' eklendi ki üst bara buton koyabilelim
export default function DetailScreen({ route, navigation }) {
  const { coinId, coinName } = route.params;
  const dispatch = useDispatch();

  // REDUX: Tıklanan coinin detaylı verilerini merkezi hafızadan buluyoruz
  const coinData = useSelector((state) => 
    state.crypto.data.find((c) => c.id === coinId)
  );

  // REDUX YENİ: Favori listesini çekiyoruz ve bu coin favorilerde mi kontrol ediyoruz
  // (Eğer favorites henüz yüklenmediyse çökmemesi için boş dizi atıyoruz)
  const favorites = useSelector((state) => state.favorites?.items || []);
  const isFavorite = favorites.includes(coinId);

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // YENİ: Sağ üst köşeye yıldız butonunu yerleştiriyoruz
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => dispatch(toggleFavorite(coinId))}
          style={{ padding: 5 }} // Tıklama alanını biraz genişlettik
        >
          <Ionicons 
            name={isFavorite ? "star" : "star-outline"} 
            size={26} 
            color={isFavorite ? "#FFC107" : "#121212"} // Doluysa altın sarısı, boşsa siyah
          />
        </TouchableOpacity>
      ),
    });
  }, [isFavorite, coinId, navigation, dispatch]);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await fetchCoinMarketChart(coinId);
        const priceList = data.map(item => item[1]);
        setPrices(priceList);
      } catch (err) {
        setError('Grafik verisi yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [coinId]);

  const screenWidth = Dimensions.get('window').width;

  // Büyük sayıları (Milyar/Milyon) kısaltmak ve formatlamak için güvenli yardımcı fonksiyon
  const formatCompactNumber = (num) => {
    if (!num) return 'Veri Yok';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)} Mlr`; // Milyar
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)} Mn`;  // Milyon
    return `$${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>{coinName}</Text>
          <Text style={styles.currentPrice}>
            {coinData ? `$${coinData.current_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : ''}
          </Text>
        </View>

        <View style={styles.chartContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <LineChart
              data={{
                labels: [],
                datasets: [{ data: prices }]
              }}
              width={screenWidth - 20} 
              height={260} 
              withDots={false}
              withInnerLines={false}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0, 
                // Çizgi rengini daha koyu ve doygun bir mavi yaptık (rgba içindeki 243'ü 180'e çektik veya direkt 0, 102, 255 yapabiliriz)
                color: (opacity = 1) => `rgba(0, 82, 204, ${opacity})`, 
                // Yandaki rakamların rengini de biraz daha okunaklı (koyu gri) yaptık
                labelColor: (opacity = 1) => `rgba(66, 66, 66, ${opacity})`, 
                style: { borderRadius: 16 },
                propsForLabels: {
                  fontSize: 11,
                  fontWeight: '600' // Rakamları biraz daha kalınlaştırdık
                },
                propsForDots: { r: '0' }
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        {coinData && (
          <View style={styles.statsWrapper}>
            <Text style={styles.statsTitle}>Piyasa İstatistikleri</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Piyasa Değeri</Text>
                <Text style={styles.statValue}>{formatCompactNumber(coinData.market_cap)}</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>24s Hacim</Text>
                <Text style={styles.statValue}>{formatCompactNumber(coinData.total_volume)}</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>24s En Yüksek</Text>
                <Text style={styles.statValue}>{formatCompactNumber(coinData.high_24h)}</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>24s En Düşük</Text>
                <Text style={styles.statValue}>{formatCompactNumber(coinData.low_24h)}</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  scrollContent: {
    paddingBottom: 40
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center'
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#121212',
    textAlign: 'center' 
  },
  currentPrice: { 
    fontSize: 22, 
    color: '#2196F3', 
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center' 
  },
  chartContainer: {
    marginTop: 30, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingRight: 10 
  },
  chart: {
    borderRadius: 16,
  },
  errorText: {
    color: '#FF3D00',
    fontWeight: '600'
  },
  statsWrapper: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#121212',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '500',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    color: '#121212',
    fontWeight: '700',
  }
});