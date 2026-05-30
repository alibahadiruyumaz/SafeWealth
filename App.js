import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native'; // Platform importunu sildik
import { Provider, useSelector } from 'react-redux'; 
import { store, persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons';

import Dashboard from './src/screens/Dashboard';
import DetailScreen from './src/screens/DetailScreen';
import PortfolioScreen from './src/screens/PortfolioScreen'; 
import SecurityWrapper from './src/components/SecurityWrapper'; 
import OnboardingScreen from './src/screens/OnboardingScreen'; 
import SettingsScreen from './src/screens/SettingsScreen'; 

const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator(); 

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
      <Stack.Screen name="DashboardStack" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Varlık Detayı', headerBackTitle: 'Geri' }} />
    </Stack.Navigator>
  );
}

// ALT SEKMELER BİLEŞENİ
function TabNavigator() {
  const scheme = useColorScheme();
  
  // Titreşim anahtarını Redux'tan çekiyoruz
  const { isHapticEnabled } = useSelector((state) => state.settings);

  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: () => {
          // DÜZELTME: Sadece bizim Global State'e (isHapticEnabled) bakacak. Açtıysan titreyecek, kapattıysan susacak!
          if (isHapticEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Piyasalar') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Cüzdanım') iconName = focused ? 'wallet' : 'wallet-outline';
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
  );
}

export default function App() {
  const scheme = useColorScheme(); 
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('@hasOnboarded');
        if (value === null) setIsFirstLaunch(true);
        else setIsFirstLaunch(false);
      } catch (error) {
        setIsFirstLaunch(false);
      }
    };
    checkOnboarding();
  }, []);

  if (isFirstLaunch === null) {
    return <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? '#121212' : '#FFFFFF' }} />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider style={{ backgroundColor: scheme === 'dark' ? '#121212' : '#FFFFFF' }}>
          <NavigationContainer theme={scheme === 'dark' ? SafeWealthDarkTheme : SafeWealthLightTheme}>
            {isFirstLaunch ? (
              <OnboardingScreen onFinish={() => setIsFirstLaunch(false)} />
            ) : (
              <SecurityWrapper>
                <RootStack.Navigator 
                  screenOptions={{ 
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: { backgroundColor: scheme === 'dark' ? '#121212' : '#FFFFFF' }
                  }}
                >
                  <RootStack.Screen name="MainTabs" component={TabNavigator} />
                  <RootStack.Screen name="Settings" component={SettingsScreen} />
                </RootStack.Navigator>
              </SecurityWrapper>
            )}
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </Provider>
  );
}