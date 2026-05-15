import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity, Platform } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { LineChart } from 'react-native-chart-kit';
import { fetchCoinMarketChart } from '../api/cryptoService';
import { useTheme } from '@react-navigation/native'; // MİMARİ: Tema Hook'u eklendi

export default function DetailScreen({ route, navigation }) {
  const { coinId, coinName } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme(); // MİMARİ: Otonom temayı çekiyoruz
  const insets = useSafeAreaInsets();

  const coinData = useSelector((state) => 
    state.crypto.data.find((c) => c.id === coinId)
  );

  const favorites = useSelector((state) => state.favorites?.items || []);
  const isFavorite = favorites.includes(coinId);

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });
  }, [navigation]);

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

  const formatCompactNumber = (num) => {
    if (!num) return 'Veri Yok';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)} Mlr`; 
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)} Mn`;  
    return `$${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom', 'left', 'right']}>
      
      {/* Temaya duyarlı Custom Header */}
      <View style={[
        styles.customHeader, 
        { 
          paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 45 : 10),
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
          elevation: 0, shadowOpacity: 0 // Dark modda gölge sırıtmaması için kaldırdık
        }
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitleText, { color: theme.colors.text }]}>Varlık Detayı</Text>
        
        <TouchableOpacity onPress={() => dispatch(toggleFavorite(coinId))} style={styles.iconButton}>
          <Ionicons 
            name={isFavorite ? "star" : "star-outline"} 
            size={26} 
            color={isFavorite ? "#FFC107" : theme.colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{coinName}</Text>
          <Text style={[styles.currentPrice, { color: theme.colors.primary }]}>
            {coinData ? `$${coinData.current_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : ''}
          </Text>
        </View>

        <View style={styles.chartContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
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
              formatYLabel={(value) => {
                const num = parseFloat(value);
                if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
                if (num >= 10) return num.toFixed(0);
                if (num >= 1) return num.toFixed(3); 
                return num.toFixed(4);
              }}
              chartConfig={{
                // Grafik arka planını temanın ana arka planına eşitledik
                backgroundColor: theme.colors.background,
                backgroundGradientFrom: theme.colors.background,
                backgroundGradientTo: theme.colors.background,
                decimalPlaces: 4,
                color: (opacity = 1) => theme.colors.primary, 
                // Grafik yazılarının rengini otonom yaptık
                labelColor: (opacity = 1) => theme.colors.text, 
                style: { borderRadius: 16 },
                propsForLabels: { fontSize: 11, fontWeight: '600' },
                propsForDots: { r: '0' }
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        {coinData && (
          <View style={styles.statsWrapper}>
            <Text style={[styles.statsTitle, { color: theme.colors.text }]}>Piyasa İstatistikleri</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                <Text style={styles.statLabel}>Piyasa Değeri</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{formatCompactNumber(coinData.market_cap)}</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                <Text style={styles.statLabel}>24s Hacim</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{formatCompactNumber(coinData.total_volume)}</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                <Text style={styles.statLabel}>24s En Yüksek</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{formatCompactNumber(coinData.high_24h)}</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
                <Text style={styles.statLabel}>24s En Düşük</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{formatCompactNumber(coinData.low_24h)}</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitleText: { fontSize: 18, fontWeight: '700' },
  iconButton: { padding: 5 },
  header: { paddingHorizontal: 20, paddingTop: 25, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  currentPrice: { fontSize: 22, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  chartContainer: { marginTop: 30, alignItems: 'center', justifyContent: 'center', paddingRight: 10 },
  chart: { borderRadius: 16 },
  errorText: { color: '#FF3D00', fontWeight: '600' },
  statsWrapper: { marginTop: 30, paddingHorizontal: 20 },
  statsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', padding: 16, borderRadius: 12, marginBottom: 16 },
  statLabel: { fontSize: 13, color: '#9E9E9E', fontWeight: '500', marginBottom: 6 },
  statValue: { fontSize: 16, fontWeight: '700' }
});