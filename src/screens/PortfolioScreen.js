import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, Modal, Alert, Dimensions, Animated 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addAsset, deleteAsset, updateAsset } from '../store/slices/portfolioSlice';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { calculatePortfolioAnalytics } from '../utils/analytics';
import { useTheme } from '@react-navigation/native'; // MİMARİ: Otonom Tema Entegrasyonu

const screenWidth = Dimensions.get('window').width;

/**
 * MİMARİ MÜDAHALE: Native Driver Destekli ve Temaya Duyarlı Liste Elemanı
 */
const PortfolioItem = React.memo(({ item, index, theme, onEdit, onDelete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true, // GPU ivmelendirmesi
    }).start();
  }, [index]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}>
      <View style={[styles.assetItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}>
        <View style={styles.assetMainInfo}>
          <Text style={[styles.assetName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.assetAmount, { color: theme.colors.text, opacity: 0.7 }]}>
            {parseFloat(Number(item.amount).toFixed(8))} {item.symbol.toUpperCase()}
          </Text>
          <Text style={[styles.pnlText, { color: item.pnlValue >= 0 ? '#4CAF50' : '#FF5252' }]}>
            PnL: {item.pnlValue >= 0 ? '+' : ''}${item.pnlValue.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.assetMetrics}>
          <Text style={[styles.assetTotalValue, { color: theme.colors.text }]}>
            ${item.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={[styles.weightBadge, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={[styles.weightText, { color: theme.colors.primary }]}>% {item.weightPercentage}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(item)}>
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#FF3D00" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

export default function PortfolioScreen() {
  const dispatch = useDispatch();
  const theme = useTheme(); // Merkezi temayı çekiyoruz
  const { assets } = useSelector((state) => state.portfolio);
  const { data: cryptoList } = useSelector((state) => state.crypto);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const validateInput = (text, setter) => {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(text)) setter(text);
  };

  const handleSave = () => {
    if (!selectedCoin || !amount || parseFloat(amount) <= 0 || !buyPrice || parseFloat(buyPrice) <= 0) {
      Alert.alert("Eksik Veri", "Lütfen varlık, geçerli bir miktar ve alış maliyeti girin.");
      return;
    }

    const safePrice = selectedCoin.current_price || selectedCoin.price || 0;
    const change24h = selectedCoin.price_change_percentage_24h || selectedCoin.priceChange24h || 0;

    if (safePrice === 0 || isNaN(safePrice)) {
      Alert.alert("Veri Hatası", "Piyasa fiyatı okunamadı.");
      return;
    }

    const assetData = {
      id: selectedCoin.id,
      name: selectedCoin.name || 'Bilinmiyor',
      symbol: selectedCoin.symbol || 'UNK',
      amount: parseFloat(amount),
      price: parseFloat(safePrice),
      buyPrice: parseFloat(buyPrice), 
      priceChange24h: parseFloat(change24h) 
    };

    isEditing ? dispatch(updateAsset(assetData)) : dispatch(addAsset(assetData));
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCoin(null); setAmount(''); setBuyPrice(''); setIsEditing(false);
  };

  const analytics = useMemo(() => calculatePortfolioAnalytics(assets), [assets]);

  const chartData = useMemo(() => {
    const validAssets = analytics.processedAssets.filter(item => item.totalValue > 0 && !isNaN(item.totalValue));
    return validAssets.map((item, index) => ({
      name: ` ${item.symbol ? item.symbol.toUpperCase() : 'UNK'}`, 
      population: parseFloat(item.totalValue.toFixed(2)), 
      color: ['#F7931A', '#627EEA', '#26A17B', '#9E9E9E', '#E4405F'][index % 5],
      legendFontColor: theme.colors.text, // Tema entegrasyonu
      legendFontSize: 12,
    }));
  }, [analytics.processedAssets, theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Analitik Dashboard</Text>

      {/* KAR/ZARAR VE VOLATİLİTE KARTI - Otonom Renkler */}
      <View style={[styles.summaryCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}>
        <Text style={[styles.summaryTitle, { color: theme.colors.text, opacity: 0.7 }]}>Toplam Portföy Değeri</Text>
        <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
          ${analytics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <View style={[styles.metricsRow, { borderTopColor: theme.colors.border }]}>
          <View style={styles.metricBox}>
            <Text style={[styles.metricLabel, { color: theme.colors.text, opacity: 0.7 }]}>24s Değişim</Text>
            <Text style={[styles.metricData, { color: analytics.weighted24hChange >= 0 ? '#4CAF50' : '#FF5252' }]}>
              {analytics.weighted24hChange >= 0 ? '+' : ''}{analytics.weighted24hChange}%
            </Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={[styles.metricLabel, { color: theme.colors.text, opacity: 0.7 }]}>Toplam PnL</Text>
            <Text style={[styles.metricData, { color: analytics.totalPnL >= 0 ? '#4CAF50' : '#FF5252' }]}>
              {analytics.totalPnL >= 0 ? '+' : '-'}${Math.abs(analytics.totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({analytics.pnlPercentage}%)
            </Text>
          </View>
        </View>
      </View>

      {chartData && chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 20}
          height={180}
          chartConfig={{ color: () => theme.colors.text }} // Tema entegrasyonu
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="analytics-outline" size={64} color={theme.colors.border} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>Veri Bulunamadı</Text>
        </View>
      )}

      {/* GPU İvmelendirmeli Liste */}
      <FlatList
        data={analytics.processedAssets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <PortfolioItem 
            item={item} 
            index={index} 
            theme={theme}
            onDelete={(id) => dispatch(deleteAsset(id))}
            onEdit={(asset) => {
              setSelectedCoin(asset);
              setAmount(asset.amount.toString());
              setBuyPrice(asset.buyPrice ? asset.buyPrice.toString() : '');
              setIsEditing(true);
              setModalVisible(true);
            }}
          />
        )}
      />

      <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Ionicons name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Yeni Varlık Ekle</Text>
      </TouchableOpacity>

      {/* Temaya Duyarlı Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{isEditing ? 'Analitik Güncelleme' : 'Varlık Ekle'}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={28} color={theme.colors.text} /></TouchableOpacity>
          </View>
          
          <Text style={[styles.label, { color: theme.colors.text }]}>Varlık Seçin</Text>
          <FlatList
            horizontal
            data={cryptoList.slice(0, 15)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.coinOption, 
                  { borderColor: selectedCoin?.id === item.id ? theme.colors.primary : theme.colors.border,
                    backgroundColor: selectedCoin?.id === item.id ? theme.colors.primary + '20' : 'transparent' 
                  }
                ]}
                onPress={() => {
                  setSelectedCoin(item);
                  if (!isEditing) setBuyPrice(item.current_price.toString());
                }}
              >
                <Text style={[styles.coinSymbol, { color: selectedCoin?.id === item.id ? theme.colors.primary : theme.colors.text }]}>
                  {item.symbol.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>Miktar</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border, borderWidth: 1 }]} 
            placeholder="0.00" 
            placeholderTextColor={theme.colors.text + '50'}
            keyboardType="decimal-pad" 
            value={amount} 
            onChangeText={(t) => validateInput(t, setAmount)} 
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>Birim Başına Alış Maliyeti ($)</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border, borderWidth: 1 }]} 
            placeholder="Örn: 64000" 
            placeholderTextColor={theme.colors.text + '50'}
            keyboardType="decimal-pad" 
            value={buyPrice} 
            onChangeText={(t) => validateInput(t, setBuyPrice)} 
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Cüzdanı Güncelle</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginVertical: 10 },
  summaryCard: { marginHorizontal: 15, marginBottom: 15, padding: 20, borderRadius: 16, alignItems: 'center' },
  summaryTitle: { fontSize: 13, fontWeight: '600', marginBottom: 5 },
  summaryValue: { fontSize: 28, fontWeight: 'bold' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15, borderTopWidth: 1, paddingTop: 15 },
  metricBox: { alignItems: 'center', flex: 1 },
  metricLabel: { fontSize: 12, marginBottom: 4 },
  metricData: { fontSize: 16, fontWeight: 'bold' },
  assetItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, marginHorizontal: 15, marginVertical: 6, borderRadius: 12, alignItems: 'center' },
  assetMainInfo: { flex: 1 },
  assetName: { fontSize: 16, fontWeight: '700' },
  assetAmount: { marginTop: 4, fontWeight: '500', fontSize: 13 },
  pnlText: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  assetMetrics: { alignItems: 'flex-end', marginRight: 10 },
  assetTotalValue: { fontSize: 15, fontWeight: 'bold' },
  weightBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  weightText: { fontWeight: '700', fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { padding: 8 },
  addButton: { position: 'absolute', bottom: 30, left: 20, right: 20, flexDirection: 'row', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginLeft: 8 },
  modalContainer: { flex: 1, padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 24, fontWeight: '800' },
  label: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  input: { padding: 15, borderRadius: 12, fontSize: 18, fontWeight: '600' },
  saveButton: { backgroundColor: '#00C853', padding: 18, borderRadius: 12, marginTop: 40, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  coinOption: { paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1.5, borderRadius: 10, marginRight: 10, height: 50, justifyContent: 'center' },
  coinSymbol: { fontWeight: '600' },
  emptyContainer: { height: 200, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 20, fontWeight: '800', marginTop: 15 }
});