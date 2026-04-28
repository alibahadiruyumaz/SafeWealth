import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, Modal, Alert 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addAsset, deleteAsset, updateAsset } from '../store/slices/portfolioSlice';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function PortfolioScreen() {
  const dispatch = useDispatch();
  const { assets } = useSelector((state) => state.portfolio);
  const { data: cryptoList } = useSelector((state) => state.crypto);

  // Form State'leri
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // --- HOCANIN İSTEDİĞİ REGEX DOĞRULAMASI ---
  const validateInput = (text) => {
    // Regex: Sadece rakam ve bir adet nokta (.) kabul eder (Örn: 12.5)
    // Harf veya eksi değer girilmesini engeller.
    const regex = /^\d*\.?\d*$/;
    if (regex.test(text)) {
      setAmount(text);
    }
  };

  const handleSave = () => {
    if (!selectedCoin || !amount || parseFloat(amount) <= 0) {
      Alert.alert("Hata", "Lütfen geçerli bir varlık ve miktar giriniz.");
      return;
    }

    const assetData = {
      id: selectedCoin.id,
      name: selectedCoin.name,
      symbol: selectedCoin.symbol,
      amount: parseFloat(amount),
      price: selectedCoin.current_price,
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
    setIsEditing(false);
  };

  // Pasta Grafiği Verisi (Dinamik)
  const chartData = assets.map((item, index) => ({
    name: item.symbol.toUpperCase(),
    population: item.amount * item.price,
    color: ['#F7931A', '#627EEA', '#26A17B', '#9E9E9E'][index % 4],
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cüzdanım</Text>

      {/* PASTA GRAFİK (DİNAMİK) */}
      {assets.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth}
          height={200}
          chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz varlık eklemediniz.</Text>
        </View>
      )}

      {/* VARLIK LİSTESİ (CRUD: READ) */}
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.assetItem}>
            <View>
              <Text style={styles.assetName}>{item.name}</Text>
              <Text style={styles.assetAmount}>{item.amount} {item.symbol.toUpperCase()}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => {
                setSelectedCoin(item);
                setAmount(item.amount.toString());
                setIsEditing(true);
                setModalVisible(true);
              }}>
                <Text style={styles.editBtn}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch(deleteAsset(item.id))}>
                <Text style={styles.deleteBtn}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* EKLEME BUTONU */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => { resetForm(); setModalVisible(true); }}
      >
        <Text style={styles.addButtonText}>+ Yeni Varlık Ekle</Text>
      </TouchableOpacity>

      {/* VARLIK EKLEME MODALI (CRUD: CREATE/UPDATE) */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{isEditing ? 'Varlığı Güncelle' : 'Varlık Ekle'}</Text>
          
          <Text style={styles.label}>Varlık Seçin (BTC, ETH...)</Text>
          <FlatList
            horizontal
            data={cryptoList.slice(0, 10)} // İlk 10 coini gösterelim
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.coinOption, selectedCoin?.id === item.id && styles.selectedOption]}
                onPress={() => setSelectedCoin(item)}
              >
                <Text>{item.symbol.toUpperCase()}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />

          <Text style={styles.label}>Miktar Giriniz</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: 0.5"
            keyboardType="numeric"
            value={amount}
            onChangeText={validateInput} // Regex Kontrolü Burada
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButton}>Kapat</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginVertical: 20 },
  assetItem: { 
    flexDirection: 'row', justifyContent: 'space-between', padding: 20,
    borderBottomWidth: 1, borderBottomColor: '#EEE' 
  },
  assetName: { fontSize: 18, fontWeight: '700' },
  assetAmount: { color: '#666' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  editBtn: { color: '#2196F3', marginRight: 15, fontWeight: '600' },
  deleteBtn: { color: '#FF3D00', fontWeight: '600' },
  addButton: { 
    backgroundColor: '#2196F3', padding: 15, margin: 20, borderRadius: 10, alignItems: 'center' 
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalContainer: { flex: 1, padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 10, fontSize: 18 },
  saveButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontWeight: 'bold' },
  closeButton: { color: '#999', textAlign: 'center', marginTop: 20 },
  coinOption: { padding: 15, borderWidth: 1, borderColor: '#EEE', borderRadius: 10, marginRight: 10, height: 50 },
  selectedOption: { borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
  emptyContainer: { height: 200, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#AAA' }
});