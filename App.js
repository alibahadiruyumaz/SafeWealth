import React from 'react';
import { Provider } from 'react-redux';
// MİMARİ GÜNCELLEME: persistor objesini import ediyoruz
import { store, persistor } from './src/store';
// MİMARİ GÜNCELLEME: Asenkron I/O işlemini yönetecek kapı (Gate) bileşeni
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';

// Güvenli alan (SafeArea) sağlayıcısı
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigasyon importları
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 

// İkonlar için
import { Ionicons } from '@expo/vector-icons';

// Sayfalarımız
import Dashboard from './src/screens/Dashboard';
import DetailScreen from './src/screens/DetailScreen';
import PortfolioScreen from './src/screens/PortfolioScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); 

// Piyasalar sekmesi içinde "Detay" sayfasına gidebilmek için bir Stack
function MarketStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DashboardStack" 
        component={Dashboard} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen} 
        options={{ 
          title: 'Varlık Detayı',
          headerBackTitle: 'Geri',
          headerTintColor: '#121212',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      {/* 
        MİMARİ KİLİT NOKTA: PersistGate 
        Cihaz hafızasındaki (AsyncStorage) veriler Redux'a yüklenene kadar UI bloke edilir.
        'loading={null}' yerine ileride projenin kurumsal renklerine uygun bir Splash ekranı da eklenebilir.
      */}
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            {/* Ana Navigatörümüz artık Tab (Alt Menü) */}
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Piyasalar') {
                    iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                  } else if (route.name === 'Cüzdanım') {
                    iconName = focused ? 'wallet' : 'wallet-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2196F3',
                tabBarInactiveTintColor: 'gray',
                headerShown: false, // Üstte Tab'ın kendi başlığını kapatıyoruz
              })}
            >
              <Tab.Screen name="Piyasalar" component={MarketStack} />
              <Tab.Screen name="Cüzdanım" component={PortfolioScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
      <StatusBar style="auto" />
    </Provider>
  );
}