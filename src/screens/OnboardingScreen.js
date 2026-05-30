import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const slides = [
  { 
    id: '1', 
    title: 'SafeWealth\'e Hoş Geldiniz', 
    description: 'Kripto varlık piyasasını cebinizden sıfır gecikmeyle takip edin.', 
    icon: 'analytics-outline' 
  },
  { 
    id: '2', 
    title: 'Gizlilik Öncelikli', 
    description: 'Biyometrik güvenlik duvarı ile finansal verileriniz sadece size ait kalsın.', 
    icon: 'shield-checkmark-outline' 
  },
  { 
    id: '3', 
    title: 'Akıllı Portföy Yönetimi', 
    description: 'Yatırımlarınızın Kâr/Zarar (PnL) durumunu anlık olarak analiz edin.', 
    icon: 'pie-chart-outline' 
  }
];

export default function OnboardingScreen({ onFinish }) {
  const theme = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef();

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const handleStart = async () => {
    // Kullanıcının tanıtımı izlediğini cihaza kaydediyoruz
    await AsyncStorage.setItem('@hasOnboarded', 'true');
    onFinish(); // App.js'e "tanıtım bitti, uygulamayı aç" mesajı yolluyoruz
  };

  const Slide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.card }]}>
          <Ionicons name={item.icon} size={80} color={theme.colors.primary} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({ item }) => <Slide item={item} />}
        keyExtractor={item => item.id}
      />
      <View style={styles.footer}>
        {/* Sayfa Göstergeleri (Noktalar) */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && {
                  backgroundColor: theme.colors.primary,
                  width: 20,
                },
              ]}
            />
          ))}
        </View>

        {/* Başla Butonu (Sadece Son Sayfada Görünür) */}
        {currentSlideIndex === slides.length - 1 ? (
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: theme.colors.primary }]} 
            onPress={handleStart}
          >
            <Text style={styles.btnText}>Hemen Başla</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.btnPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { width, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconCircle: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 40, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 15 },
  description: { fontSize: 16, textAlign: 'center', opacity: 0.7, lineHeight: 24 },
  footer: { height: height * 0.20, justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 30 },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  indicator: { height: 8, width: 8, backgroundColor: 'grey', marginHorizontal: 4, borderRadius: 4 },
  btn: { flex: 1, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  btnText: { fontWeight: 'bold', fontSize: 18, color: '#FFF' },
  btnPlaceholder: { flex: 1, marginTop: 30 }
});