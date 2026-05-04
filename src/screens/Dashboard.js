import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '../store/slices/cryptoSlice';
import { useNavigation, useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

/**
 * MİMARİ MÜDAHALE: Native Driver Destekli ve Temaya Duyarlı Liste Elemanı
 */
const CryptoListItem = React.memo(({ item, index, theme }) => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      delay: index * 40,
      useNativeDriver: true,
    }).start();
  }, [index]);

  const formatPrice = (price) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price > 0.001) {
      return price.toFixed(4);
    } else {
      return price.toFixed(8);
    }
  };

  const isPositive = item.price_change_percentage_24h >= 0;

  return (
    <Animated.View 
      style={{ 
        opacity: fadeAnim, 
        transform: [{ 
          translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) 
        }] 
      }}
    >
      <TouchableOpacity 
        style={[styles.itemContainer, { borderBottomColor: theme.colors.border }]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Detail', { 
          coinId: item.id, 
          coinName: item.name 
        })}
      >
        <View style={styles.nameContainer}>
          <Text style={[styles.coinName, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.coinSymbol, { color: theme.colors.text, opacity: 0.6 }]}>{item.symbol.toUpperCase()}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.coinPrice, { color: theme.colors.text }]}>${formatPrice(item.current_price)}</Text>
          <Text style={[styles.coinPercentage, { color: isPositive ? '#00C853' : '#FF3D00' }]}>
            {isPositive ? '▲' : '▼'} {Math.abs(item.price_change_percentage_24h || 0).toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function Dashboard() {
  const dispatch = useDispatch();
  const theme = useTheme(); 
  
  const { data, status, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCryptoData());
    }
  }, [status, dispatch]);

  const filteredData = useMemo(() => {
    return data.filter(coin => coin.current_price > 0);
  }, [data]);

  const renderItem = useCallback(({ item, index }) => (
    <CryptoListItem item={item} index={index} theme={theme} />
  ), [theme]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  if (status === 'loading') {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text, opacity: 0.7 }]}>Piyasa verileri senkronize ediliyor...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="warning-outline" size={48} color="#FF3D00" />
        <Text style={styles.errorText}>Bağlantı Hatası: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.headerContainer, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Piyasalar</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text, opacity: 0.6 }]}>Canlı Varlık Değerleri</Text>
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
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  listContent: { paddingBottom: 20 },
  itemContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  nameContainer: { flex: 1 },
  coinName: { fontSize: 17, fontWeight: '700' },
  coinSymbol: { fontSize: 13, marginTop: 2, fontWeight: '600' },
  priceContainer: { alignItems: 'flex-end' },
  coinPrice: { fontSize: 16, fontWeight: '700' },
  coinPercentage: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  loadingText: { marginTop: 12, fontWeight: '500' },
  errorText: { color: '#FF3D00', fontWeight: '600', marginTop: 10 }
});