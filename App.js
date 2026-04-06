import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { StatusBar } from 'expo-status-bar';

// YENİ: Güvenli alan (SafeArea) sağlayıcısı
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Navigasyon importları
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Sayfalarımız
import Dashboard from './src/screens/Dashboard';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      {/* Uygulamanın en dışını SafeAreaProvider ile sarıyoruz */}
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Dashboard">
            
            <Stack.Screen 
              name="Dashboard" 
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
        </NavigationContainer>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </Provider>
  );
}