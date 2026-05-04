import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * MİMARİ MÜDAHALE: Otonom Tema ve Cihaz Tercihi Entegrasyonu
 * useColorScheme kancası ile sistem tercihlerini asenkron dinliyoruz.
 */
import { useColorScheme } from 'react-native'; 
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons';

// Ekranlar
import Dashboard from './src/screens/Dashboard';
import DetailScreen from './src/screens/DetailScreen';
import PortfolioScreen from './src/screens/PortfolioScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); 

// MİMARİ TASARIM: SafeWealth Özel Renk Paletleri
const SafeWealthLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    background: '#FFFFFF',
    card: '#F8F9FA',
    text: '#121212',
    border: '#E0E0E0',
  },
};

const SafeWealthDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#2196F3',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#333333',
  },
};

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
        }} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme(); // Cihazın Appearance (Görünüm) tercihini dinle

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          {/* MİMARİ KİLİT: NavigationContainer seviyesinde otonom tema enjeksiyonu */}
          <NavigationContainer theme={scheme === 'dark' ? SafeWealthDarkTheme : SafeWealthLightTheme}>
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
                headerShown: false,
                tabBarStyle: {
                   backgroundColor: scheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
                   borderTopColor: scheme === 'dark' ? '#333333' : '#E0E0E0'
                }
              })}
            >
              <Tab.Screen name="Piyasalar" component={MarketStack} />
              <Tab.Screen name="Cüzdanım" component={PortfolioScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </Provider>
  );
}