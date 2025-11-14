import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import BackgroundWall from './BackgroundWall';
import { useTheme } from '../context/ThemeProvider';

export default function LocationPermissionModal({ visible, onAllow, onDeny }) {
  const Colors = useTheme();

  useEffect(() => {
    console.log('\n🟡 [MODAL] ========== LocationPermissionModal MOUNTED ==========');
    console.log('🟡 [MODAL] Initial visible prop:', visible);
  }, []);

  useEffect(() => {
    console.log('\n🔵 [MODAL] ========== visible prop CHANGED ==========');
    console.log('🔵 [MODAL] New visible value:', visible);
    console.log('🔵 [MODAL] Timestamp:', new Date().toISOString());
    if (visible) {
      console.log('✅ [MODAL] Modal should now be VISIBLE on screen');
    } else {
      console.log('❌ [MODAL] Modal should now be HIDDEN');
    }
  }, [visible]);

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

  if (!visible) {
    console.log('🚫 [MODAL] Returning null (visible=false)');
    return null;
  }

  console.log('✅ [MODAL] Rendering modal (visible=true)');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={() => {
        console.log('🔙 [MODAL] onRequestClose triggered');
        onDeny();
      }}
    >
      <View style={styles.modal}>
        <BackgroundWall blur={true} opacity={0.8} />
        
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📍</Text>
          </View>

          <Text style={styles.title}>Enable Location Services</Text>

          <Text style={styles.message}>
            We need access to your precise location to send you personalized notifications and offers when you're near our partners.{"\n\n"}
            Location data is collected in the background even when the app is closed to enable geofencing features.{"\n\n"}
            {Platform.OS === 'ios' && "Please select 'Allow While Using App' in the next screen.\n\n"}
            Your location data is processed by MoEngage for analytics and location-based notifications.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
  <TouchableOpacity 
    style={styles.allowButton} 
    onPress={() => {
      console.log('✅ [MODAL] "Allow Location" button pressed');
      onAllow();
    }}
  >
    <Text style={styles.allowButtonText}>Allow Location</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={styles.denyButton} 
    onPress={() => {
      console.log('❌ [MODAL] "Not Now" button pressed');
      onDeny();
    }}
  >
    <Text style={styles.denyButtonText}>Not Now</Text>
  </TouchableOpacity>
</View>
        </View>
      </View>
    </Modal>
  );
}