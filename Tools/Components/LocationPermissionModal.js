import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { I18n } from 'i18n-js';
import translations from '../../assets/Localization/Localize.json';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';
import { useAppContext } from '../../src/js/reducers/AppReducer';

const i18n = new I18n(translations);

export default function LocationPermissionModal({ visible, onAllow, onDeny }) {
  const Colors = useTheme();
  const { state } = useAppContext();
  i18n.translations = state.i18ntranslation;
  i18n.locale = global.locale || 'en';

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '85%',
      backgroundColor: Colors.whiteColor,
      padding: widthPercentageToDP(5),
      borderRadius: widthPercentageToDP(4),
      alignItems: 'center',
    },
    iconContainer: {
      width: widthPercentageToDP(20),
      height: widthPercentageToDP(20),
      backgroundColor: Colors.bluelightShadeColor,
      borderRadius: widthPercentageToDP(20),
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: heightPercentageToDP(2),
    },
    iconText: {
      fontSize: widthPercentageToDP(10),
      color: Colors.whiteColor,
    },
    title: {
      includeFontPadding: false,
      fontFamily: 'Cairo-Bold',
      fontSize: widthPercentageToDP(5.5),
      textAlign: 'center',
      color: Colors.black,
      marginBottom: heightPercentageToDP(1),
    },
    message: {
      includeFontPadding: false,
      fontFamily: 'Cairo-Regular',
      fontSize: widthPercentageToDP(4),
      textAlign: 'center',
      color: Colors.inputfontColor,
      marginBottom: heightPercentageToDP(3),
      lineHeight: widthPercentageToDP(4) * 1.5,
    },
    buttonContainer: {
      width: '100%',
      gap: heightPercentageToDP(1.5),
    },
    allowButton: {
      backgroundColor: Colors.blueColor,
      paddingVertical: heightPercentageToDP(1.5),
      borderRadius: heightPercentageToDP(5),
      alignItems: 'center',
      justifyContent: 'center',
    },
    denyButton: {
      backgroundColor: 'transparent',
      paddingVertical: heightPercentageToDP(1.5),
      borderRadius: heightPercentageToDP(5),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.inputfontColor,
    },
    allowButtonText: {
      includeFontPadding: false,
      fontFamily: 'Cairo-Bold',
      fontSize: widthPercentageToDP(4.5),
      color: Colors.whiteColor,
    },
    denyButtonText: {
      includeFontPadding: false,
      fontFamily: 'Cairo-Regular',
      fontSize: widthPercentageToDP(4),
      color: Colors.inputfontColor,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onDeny}
    >
      <View style={styles.modal}>
        <BackgroundWall blur={true} opacity={0.8} />
        
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📍</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
  {i18n.locale === 'ar' 
    ? 'تفعيل خدمات الموقع'
    : 'Enable Location Services'}
</Text>

          {/* Message */}
          <Text style={styles.message}>
  {i18n.locale === 'ar'
    ? 'نحتاج إلى الوصول إلى موقعك الدقيق (إحداثيات GPS) لإرسال إشعارات وعروض مخصصة عندما تكون بالقرب من شركائنا.\n\nسيتم جمع بيانات الموقع في الخلفية حتى عندما يكون التطبيق مغلقًا لتمكين ميزات التسييج الجغرافي.\n\nيتم معالجة بيانات موقعك بواسطة MoEngage لأغراض التحليلات والإشعارات المستندة إلى الموقع.'
    : 'We need access to your precise location (GPS coordinates) to send you personalized notifications and offers when you\'re near our partners.\n\nLocation data is collected in the background even when the app is closed to enable geofencing features.\n\nYour location data is processed by MoEngage for analytics and location-based notifications.'}
</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
  <TouchableOpacity 
    style={styles.allowButton} 
    onPress={onAllow}
  >
    <Text style={styles.allowButtonText}>
      {i18n.locale === 'ar' ? 'السماح بالموقع' : 'Allow Location'}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.denyButton} 
    onPress={onDeny}
  >
    <Text style={styles.denyButtonText}>
      {i18n.locale === 'ar' ? 'ليس الآن' : 'Not Now'}
    </Text>
  </TouchableOpacity>
</View>
        </View>
      </View>
    </Modal>
  );
}