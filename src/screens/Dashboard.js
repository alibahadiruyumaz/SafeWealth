import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Animated, RefreshControl, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from '../store/slices/cryptoSlice';
import { useNavigation, useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics'; 

/**
 * MİMARİ MÜDAHALE: Native Driver Destekli Liste Elemanı
 */
// YENİ: isHapticEnabled prop'u eklendi
const CryptoListItem = React.memo(({ item, index, theme, isHapticEnabled }) => {
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
    if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (price > 0.001) return price.toFixed(4);
    return price.toFixed(8);
  };

  const isPositive = item.price_change_percentage_24h >= 0;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] }}>
      <TouchableOpacity 
        style={[styles.itemContainer, { borderBottomColor: theme.colors.border }]}
        activeOpacity={0.7}
        onPress={() => {
          if (isHapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // KORUMA EKLENDİ
          navigation.navigate('Detail', { coinId: item.id, coinName: item.name });
        }}
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
  const favorites = useSelector((state) => state.favorites?.items || []); 
  
  // YENİ: Global Haptic ayarını Redux'tan çekiyoruz
  const { isHapticEnabled } = useSelector((state) => state.settings);

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); 

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCryptoData());
    }
  }, [status, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); 
    if (isHapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // KORUMA EKLENDİ
    
    try {
      await dispatch(fetchCryptoData()).unwrap(); 
      if (isHapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // KORUMA EKLENDİ
    } catch (err) {
      console.error("Senkronizasyon hatası:", err);
      if (isHapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // KORUMA EKLENDİ
    } finally {
      setRefreshing(false); 
    }
  }, [dispatch, isHapticEnabled]);

  const filteredData = useMemo(() => {
    return data.filter(coin => {
      const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorite = showFavoritesOnly ? favorites.includes(coin.id) : true;
      
      return coin.current_price > 0 && matchesSearch && matchesFavorite;
    });
  }, [data, searchQuery, showFavoritesOnly, favorites]);

  const renderItem = useCallback(({ item, index }) => (
    <CryptoListItem item={item} index={index} theme={theme} isHapticEnabled={isHapticEnabled} /> // YENİ: Prop olarak aktarıldı
  ), [theme, isHapticEnabled]);

  const renderEmptyState = () => {
    if (showFavoritesOnly && favorites.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="star-outline" size={64} color={theme.colors.border} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Favori Varlık Yok</Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.text }]}>
            Henüz hiçbir varlığı favorilerinize eklemediniz. Varlık detay ekranından yıldız ikonuna dokunarak favori listenizi oluşturabilirsiniz.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color={theme.colors.border} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Sonuç Bulunamadı</Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.text }]}>
          "{searchQuery}" ile eşleşen bir varlık piyasalarda yer almıyor.
        </Text>
      </View>
    );
  };

  if (status === 'loading' && data.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text, opacity: 0.7 }]}>Piyasa verileri senkronize ediliyor...</Text>
      </View>
    );
  }

  if (status === 'failed' && data.length === 0) {
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

      <View style={[styles.searchWrapper, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.text} style={{ opacity: 0.5 }} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Kripto varlık ara (Örn: Bitcoin)"
            placeholderTextColor={theme.colors.text + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[styles.filterBtn, !showFavoritesOnly && { backgroundColor: theme.colors.primary }]} 
            onPress={() => {
              if (showFavoritesOnly && isHapticEnabled) Haptics.selectionAsync(); // KORUMA EKLENDİ
              setShowFavoritesOnly(false);
            }}
          >
            <Text style={[styles.filterBtnText, { color: !showFavoritesOnly ? '#FFF' : theme.colors.text }]}>Tümü</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterBtn, showFavoritesOnly && { backgroundColor: theme.colors.primary }]} 
            onPress={() => {
              if (!showFavoritesOnly && isHapticEnabled) Haptics.selectionAsync(); // KORUMA EKLENDİ
              setShowFavoritesOnly(true);
            }}
          >
            <Ionicons name="star" size={14} color={showFavoritesOnly ? '#FFF' : theme.colors.text} style={{ marginRight: 6 }} />
            <Text style={[styles.filterBtnText, { color: showFavoritesOnly ? '#FFF' : theme.colors.text }]}>Favorilerim</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={filteredData.length === 0 ? styles.emptyListContent : styles.listContent}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={5}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState} 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text} 
            colors={[theme.colors.primary || '#3498db']} 
            progressBackgroundColor={theme.colors.card} 
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  
  searchWrapper: { paddingHorizontal: 20, paddingBottom: 10, zIndex: 1 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },
  
  filterRow: { 
    flexDirection: 'row', 
    marginTop: 12, 
    justifyContent: 'space-between', 
  },
  filterBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    marginHorizontal: 4, 
    borderRadius: 20, 
    backgroundColor: 'transparent' 
  },
  filterBtnText: { fontSize: 14, fontWeight: '600' },

  listContent: { paddingBottom: 20 },
  emptyListContent: { flexGrow: 1, justifyContent: 'center' }, 
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  nameContainer: { flex: 1 },
  coinName: { fontSize: 17, fontWeight: '700' },
  coinSymbol: { fontSize: 13, marginTop: 2, fontWeight: '600' },
  priceContainer: { alignItems: 'flex-end' },
  coinPrice: { fontSize: 16, fontWeight: '700' },
  coinPercentage: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  loadingText: { marginTop: 12, fontWeight: '500' },
  errorText: { color: '#FF3D00', fontWeight: '600', marginTop: 10 },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 50 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  emptySubtitle: { fontSize: 15, textAlign: 'center', opacity: 0.6, lineHeight: 22 },
});