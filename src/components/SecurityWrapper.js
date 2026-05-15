import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Uygulama açılır açılmaz donanım kontrolünü beklemeden direkt prompt'u tetikle
    const initAuth = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (compatible && enrolled) {
        setIsSupported(true);
        // Kontrol bittiği saniye beklemeden şifre/parmak izi sor (Hızlandırma Yapıldı)
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'SafeWealth Portföyüne Giriş',
          fallbackLabel: 'Şifre Kullan',
          disableDeviceFallback: false,
          cancelLabel: 'İptal',
        });

        if (result.success) {
          setIsAuthenticated(true);
        }
      } else {
        // Cihazda parmak izi yoksa içeri al
        setIsAuthenticated(true);
      }
    };
    
    initAuth();
  }, []);

  const handleManualAuthentication = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'SafeWealth Portföyüne Giriş',
      fallbackLabel: 'Şifre Kullan',
      disableDeviceFallback: false,
      cancelLabel: 'İptal',
    });

    if (result.success) {
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="shield-checkmark" size={80} color="#3498db" />
      </View>
      <Text style={styles.title}>SafeWealth</Text>
      <Text style={styles.subtitle}>Portföyünüz kilitli ve güvende.</Text>

      {isSupported && (
        <TouchableOpacity style={styles.button} onPress={handleManualAuthentication}>
          <Ionicons name="finger-print" size={24} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Kilidi Aç</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Koyu tema arka planı
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    padding: 20,
    borderRadius: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});