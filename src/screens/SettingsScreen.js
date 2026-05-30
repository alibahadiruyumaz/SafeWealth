import React, { useState } from 'react'; 
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, Platform } from 'react-native'; // YENİ: Platform EKLENDİ
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';
import { clearPortfolio } from '../store/slices/portfolioSlice';
import { setHapticStatus } from '../store/slices/settingsSlice';

export default function SettingsScreen({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  
  // GLOBAL AYAR: Titreşim durumunu Redux State'ten çekiyoruz
  const { isHapticEnabled } = useSelector((state) => state.settings);
  
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);

  const toggleHaptic = () => {
    // YENİ: Sadece iOS ise bizim titreşimi ver (Android zaten kendi titreşiyor)
    if (!isHapticEnabled && Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // Redux'taki global değeri tersine çeviriyoruz
    dispatch(setHapticStatus(!isHapticEnabled));
  };

  const handleResetRequest = () => {
    if (isHapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsResetModalVisible(true);
  };

  const executeReset = () => {
    if (isHapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(clearPortfolio());
    setIsResetModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Ayarlar</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>TERCİHLER</Text>
        
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: '#FF9500' }]}>
              <Ionicons name="phone-portrait-outline" size={20} color="#FFF" />
            </View>
            <Text style={[styles.settingText, { color: theme.colors.text }]}>Dokunsal Geri Bildirim</Text>
          </View>
          <Switch
            value={isHapticEnabled}
            onValueChange={toggleHaptic}
            trackColor={{ false: "#767577", true: theme.colors.primary }}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 30 }]}>VERİ YÖNETİMİ</Text>
        
        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: theme.colors.card }]} 
          onPress={handleResetRequest}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: '#FF3B30' }]}>
              <Ionicons name="trash-outline" size={20} color="#FFF" />
            </View>
            <Text style={[styles.settingText, { color: '#FF3B30', fontWeight: '600' }]}>Tüm Portföyü Sıfırla</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 30 }]}>HAKKINDA</Text>
        
        <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconBox, { backgroundColor: '#34C759' }]}>
              <Ionicons name="information-circle-outline" size={20} color="#FFF" />
            </View>
            <Text style={[styles.settingText, { color: theme.colors.text }]}>Sürüm</Text>
          </View>
          <Text style={{ color: theme.colors.text, opacity: 0.5, fontWeight: '600' }}>v1.0.0 (Release)</Text>
        </View>

      </View>

      {/* MODAL UYARI PENCERESİ */}
      <Modal visible={isResetModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.customAlert, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={[styles.alertIconBox, { backgroundColor: '#FF3B30' + '20' }]}>
              <Ionicons name="warning" size={36} color="#FF3B30" />
            </View>
            <Text style={[styles.alertTitle, { color: theme.colors.text }]}>Portföyü Sıfırla</Text>
            <Text style={[styles.alertMessage, { color: theme.colors.text }]}>
              Cüzdanınızdaki tüm varlıklar kalıcı olarak silinecek. Bu işlemi onaylıyor musunuz?
            </Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity style={[styles.alertBtn, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]} onPress={() => setIsResetModalVisible(false)}>
                <Text style={[styles.alertBtnText, { color: theme.colors.text }]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.alertBtn, { backgroundColor: '#FF3B30' }]} onPress={executeReset}>
                <Text style={[styles.alertBtnText, { color: '#FFF' }]}>Evet, Sıfırla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  backBtn: { padding: 5, marginLeft: -5 }, 
  content: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', opacity: 0.5, marginBottom: 10, letterSpacing: 1, marginLeft: 10 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 12, marginBottom: 10 },
  settingInfo: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingText: { fontSize: 16, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  customAlert: { width: '100%', maxWidth: 340, borderRadius: 20, padding: 25, alignItems: 'center', borderWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 },
  alertIconBox: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  alertTitle: { fontSize: 22, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  alertMessage: { fontSize: 15, textAlign: 'center', opacity: 0.8, lineHeight: 22, marginBottom: 25 },
  alertButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 },
  alertBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  alertBtnText: { fontSize: 16, fontWeight: '700' }
});