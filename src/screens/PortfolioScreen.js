import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, Modal, Alert, Dimensions 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addAsset, deleteAsset, updateAsset } from '../store/slices/portfolioSlice';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { calculatePortfolioAnalytics } from '../utils/analytics';

const screenWidth = Dimensions.get('window').width;

export default function PortfolioScreen() {
  const dispatch = useDispatch();
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
    // API'den 24h değişimi alıyoruz, yoksa 0 (Offline toleransı)
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
      buyPrice: parseFloat(buyPrice), // Yeni Şema Alanı
      priceChange24h: parseFloat(change24h) // Yeni Şema Alanı
    };

    if (isEditing) {
      dispatch(updateAsset(assetData));
    } else {
      dispatch(addAsset(assetData));
    }

    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCoin(null);
    setAmount('');
    setBuyPrice('');
    setIsEditing(false);
  };

  // MİMARİ MÜDAHALE: Tüm analitiği tek bir fonksiyondan çekiyoruz
  const analytics = useMemo(() => calculatePortfolioAnalytics(assets), [assets]);

  const chartData = useMemo(() => {
    const validAssets = analytics.processedAssets.filter(item => item.totalValue > 0 && !isNaN(item.totalValue));
    return validAssets.map((item, index) => ({
      name: ` ${item.symbol ? item.symbol.toUpperCase() : 'UNK'}`, 
      population: parseFloat(item.totalValue.toFixed(2)), 
      color: ['#F7931A', '#627EEA', '#26A17B', '#9E9E9E', '#E4405F'][index % 5],
      legendFontColor: '#333',
      legendFontSize: 12,
    }));
  }, [analytics.processedAssets]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Analitik Dashboard</Text>

      {/* KAR/ZARAR VE VOLATİLİTE KARTI */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Toplam Portföy Değeri</Text>
        <Text style={styles.summaryValue}>
          ${analytics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>24s Değişim</Text>
            <Text style={[styles.metricData, { color: analytics.weighted24hChange >= 0 ? '#4CAF50' : '#FF5252' }]}>
              {analytics.weighted24hChange >= 0 ? '+' : ''}{analytics.weighted24hChange}%
            </Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Toplam PnL</Text>
            {/* GÖRSEL DÜZELTME: Zarar durumunda tutarın başına eksi (-) işareti ekliyoruz */}
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
          chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="analytics-outline" size={64} color="#D1D1D1" />
          <Text style={styles.emptyText}>Veri Bulunamadı</Text>
        </View>
      )}

      <FlatList
        data={analytics.processedAssets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.assetItem}>
            <View style={styles.assetMainInfo}>
              <Text style={styles.assetName}>{item.name}</Text>
              <Text style={styles.assetAmount}>
                {parseFloat(Number(item.amount).toFixed(8))} {item.symbol.toUpperCase()}
              </Text>
              <Text style={[styles.pnlText, { color: item.pnlValue >= 0 ? '#4CAF50' : '#FF5252' }]}>
                PnL: {item.pnlValue >= 0 ? '+' : ''}${item.pnlValue.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.assetMetrics}>
              <Text style={styles.assetTotalValue}>
                ${item.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
              <View style={styles.weightBadge}>
                <Text style={styles.weightText}>% {item.weightPercentage}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => {
                  setSelectedCoin(item);
                  setAmount(item.amount.toString());
                  setBuyPrice(item.buyPrice ? item.buyPrice.toString() : '');
                  setIsEditing(true);
                  setModalVisible(true);
                }}
              >
                <Ionicons name="create-outline" size={20} color="#2196F3" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => dispatch(deleteAsset(item.id))}>
                <Ionicons name="trash-outline" size={20} color="#FF3D00" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Ionicons name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Yeni Varlık Ekle</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isEditing ? 'Analitik Güncelleme' : 'Varlık Ekle'}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
          </View>
          
          <Text style={styles.label}>Varlık Seçin</Text>
          <FlatList
            horizontal
            data={cryptoList.slice(0, 15)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.coinOption, selectedCoin?.id === item.id && styles.selectedOption]}
                onPress={() => {
                  setSelectedCoin(item);
                  // UX MÜDAHALESİ: Kullanıcı coin seçtiğinde maliyet kutusuna o anki güncel fiyatı otomatik yazdırıyoruz.
                  if (!isEditing) {
                    setBuyPrice(item.current_price.toString());
                  }
                }}
              >
                <Text style={[styles.coinSymbol, selectedCoin?.id === item.id && styles.selectedText]}>{item.symbol.toUpperCase()}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />

          <Text style={styles.label}>Miktar</Text>
          <TextInput style={styles.input} placeholder="0.00" keyboardType="decimal-pad" value={amount} onChangeText={(t) => validateInput(t, setAmount)} />

          <Text style={styles.label}>Birim Başına Alış Maliyeti ($)</Text>
          <TextInput style={styles.input} placeholder="Örn: 64000" keyboardType="decimal-pad" value={buyPrice} onChangeText={(t) => validateInput(t, setBuyPrice)} />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Cüzdanı Güncelle</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginVertical: 10, color: '#1A1A1A' },
  summaryCard: { backgroundColor: '#1E293B', marginHorizontal: 15, marginBottom: 15, padding: 20, borderRadius: 16, alignItems: 'center' },
  summaryTitle: { color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 5 },
  summaryValue: { color: '#F8FAFC', fontSize: 28, fontWeight: 'bold' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15, borderTopWidth: 1, borderColor: '#334155', paddingTop: 15 },
  metricBox: { alignItems: 'center', flex: 1 },
  metricLabel: { color: '#94A3B8', fontSize: 12, marginBottom: 4 },
  metricData: { fontSize: 16, fontWeight: 'bold' },
  assetItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', marginHorizontal: 15, marginVertical: 6, borderRadius: 12, elevation: 2, alignItems: 'center' },
  assetMainInfo: { flex: 1 },
  assetName: { fontSize: 16, fontWeight: '700', color: '#333' },
  assetAmount: { color: '#777', marginTop: 4, fontWeight: '500', fontSize: 13 },
  pnlText: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  assetMetrics: { alignItems: 'flex-end', marginRight: 10 },
  assetTotalValue: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  weightBadge: { backgroundColor: '#E0F2FE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  weightText: { color: '#0284C7', fontWeight: '700', fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { padding: 8 },
  addButton: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#2196F3', flexDirection: 'row', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginLeft: 8 },
  modalContainer: { flex: 1, padding: 25, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 24, fontWeight: '800' },
  label: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 10, color: '#555' },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, fontSize: 18, fontWeight: '600' },
  saveButton: { backgroundColor: '#00C853', padding: 18, borderRadius: 12, marginTop: 40, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  coinOption: { paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1.5, borderColor: '#EEE', borderRadius: 10, marginRight: 10, height: 50, justifyContent: 'center' },
  selectedOption: { borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
  coinSymbol: { fontWeight: '600', color: '#666' },
  selectedText: { color: '#2196F3' },
  emptyContainer: { height: 200, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#1A1A1A', fontSize: 20, fontWeight: '800', marginTop: 15 }
});