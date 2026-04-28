import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { StatusBar } from 'expo-status-bar';

// Güvenli alan (SafeArea) sağlayıcısı
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigasyon importları
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // YENİ EKLENDİ

// İkonlar için
import { Ionicons } from '@expo/vector-icons';

// Sayfalarımız
import Dashboard from './src/screens/Dashboard';
import DetailScreen from './src/screens/DetailScreen';
import PortfolioScreen from './src/screens/PortfolioScreen'; // YENİ EKLENDİ

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // YENİ EKLENDİ

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
      <StatusBar style="auto" />
    </Provider>
  );
}