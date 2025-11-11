// import 'react-native-gesture-handler';
import SecureStore from './Tools/Components/SecureStore';
import React, { useEffect, useState } from 'react';
import { Linking, StatusBar, StyleSheet, View,Text, AppState, Appearance} from 'react-native';
import Localisation from './Tools/Components/Localisation';
import { ThemeProvider } from './Tools/context/ThemeProvider';
import * as Tools from './Tools/Components/Tools'
import LightColors from './Tools/constants/LightColors';
import AppProvider from './src/js/reducers/AppReducer';
import ReactMoE, { MoEAnalyticsConfig, MoEInitConfig, MoEPushConfig,MoEngageLogConfig, MoEngageLogLevel } from 'react-native-moengage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import RNBootSplash from 'react-native-bootsplash';
import geofenceManager from './Tools/Components/GeofenceManager';
import LocationPermissionModal from './Tools/Components/LocationPermissionModal';
// import SecureStore from './Tools/Components/SecureStore';

export default function App (props) {
  const [fontload,setFontLoad]=useState(false);
  const [isEnabledForReleaseBuild,setisEnabledForReleaseBuild]=useState(true);
  
  const [notification,setNotification]=useState(undefined);
    const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [locationPermissionChecked, setLocationPermissionChecked] = useState(false);
  useEffect(()=>{
    console.log('🚀 [App.js] ========================================');
    console.log('🚀 [App.js] APP STARTING - MOENGAGE INITIALIZATION');
    console.log('🚀 [App.js] ========================================');

    const moEInitConfig = new MoEInitConfig(
      // MoEPushConfig.defaultConfig(),
      new MoEPushConfig(true),
      new MoEngageLogConfig(MoEngageLogLevel.VERBOSE, isEnabledForReleaseBuild),
      new MoEAnalyticsConfig(true)
    );

    console.log('📱 [App.js] MoEngage Config Created:');
    console.log('   - Push Enabled: true');
    console.log('   - Log Level: VERBOSE');
    console.log('   - Analytics Enabled: true');

    ReactMoE.setEventListener("pushTokenGenerated", (payload) => {
      console.log("🔔 [App.js] Push Token Generated:", payload);
    });
    // console.log("pushClickedTest");
    ReactMoE.setEventListener("pushClicked", (notificationPayload) => {
      console.log("🔔 [App.js] Push Notification Clicked");
      console.log("🔔 [App.js] Payload:", notificationPayload);
      setNotification(notificationPayload);
    });

    ReactMoE.setEventListener("geoFenceTriggered", (geofencePayload) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log("🌍 ========================================");
  console.log("🌍 [GEOFENCE TRIGGERED] Time:", timestamp);
  console.log("🌍 ========================================");
  console.log("🌍 Payload:", JSON.stringify(geofencePayload, null, 2));
  console.log("🌍 ========================================");
  // This will log when user enters/exits a geofence
  // MoEngage automatically handles showing notifications
  // based on your dashboard configuration
});

ReactMoE.setEventListener("geoFenceEvent", (geofenceEvent) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log("📍 ========================================");
  console.log("📍 [GEOFENCE EVENT] Time:", timestamp);
  console.log("📍 ========================================");
  console.log("📍 Event:", JSON.stringify(geofenceEvent, null, 2));
  console.log("📍 ========================================");
});

    console.log('🔧 [App.js] Event listeners registered:');
    console.log('   - pushTokenGenerated ✅');
    console.log('   - pushClicked ✅');
    console.log('   - geoFenceTriggered ✅');
    console.log('   - geoFenceEvent ✅');

    console.log('🔧 [App.js] Initializing MoEngage SDK...');
    console.log('🔑 [App.js] Workspace ID: DCMBBW4GE1CX78NNNXFU1VN8');
    ReactMoE.initialize("DCMBBW4GE1CX78NNNXFU1VN8", moEInitConfig);
    console.log('✅ [App.js] MoEngage SDK initialized');
    global.profileUpdate=false;
    global.initProfile=undefined;
    global.rateVisible=false;
    global.loadingBar=0;
    global.showRegister=false;
    global.showHamView=true;
    global.checkBio=false;
    global.bgColor=Tools.hextorgb(LightColors.bluelightShadeColor);
    global.pageContent=undefined;
    global.AdVisible=undefined;
    
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    
    errorFix();
    setFontLoad(true);
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
      ReactMoE.showInApp();
    }, 1000);

     console.log('📍 [App.js] Starting geofencing initialization...');
     initializeGeofencing();

    return () => {
      // This code will run when the component unmounts
      // You can perform any cleanup tasks here, such as
      // canceling network requests, unsubscribing from subscriptions, etc.
      SecureStore.setItemAsync('initLogin','');

    };
  },[])

  useEffect(() => {
  const subscription = AppState.addEventListener('change', nextAppState => {
    console.log('App State Changed:', nextAppState);
    geofenceManager.handleAppStateChange(nextAppState);
  });

  return () => {
    subscription?.remove();
  };
}, []);
  
  const errorFix=()=>{
    global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
    global.FormData = global.originalFormData || global.FormData;
    
    if (window.FETCH_SUPPORT) {
      window.FETCH_SUPPORT.blob = false;
    } else {
      global.Blob = global.originalBlob || global.Blob;
      global.FileReader = global.originalFileReader || global.FileReader;
    }
  }

  const initializeGeofencing = async () => {
  console.log('🎯 [App.js] initializeGeofencing() called');
  try {
    const askedBefore = await SecureStore.getItemAsync('locationPermissionAsked');
    console.log('🔍 [App.js] Checked if permission was asked before:', askedBefore);

    if (askedBefore === 'true') {
      console.log('✅ [App.js] User was asked before, checking current permission status...');
      const hasPermission = await geofenceManager.checkLocationPermission();
      if (hasPermission) {
        console.log('✅ [App.js] Permission granted, initializing geofencing...');
        await geofenceManager.initializeGeofencing();
        console.log('✅ [App.js] Geofencing initialized - permission already granted');
      } else {
        console.log('❌ [App.js] Permission not granted, geofencing cannot start');
      }
      setLocationPermissionChecked(true);
      return;
    }

    console.log('📍 [App.js] First time asking for permission');
    console.log('⏱️  [App.js] Will show permission modal in 1.5 seconds...');
    // CHANGE THIS LINE - Add a delay
    setTimeout(() => {
      console.log('📱 [App.js] Showing location permission modal now');
      setShowLocationPermission(true);
    }, 1500); // Wait 1.5 seconds for locale to be ready

    setLocationPermissionChecked(true);
  } catch (error) {
    console.error('❌ [App.js] Error initializing geofencing:', error);
    setLocationPermissionChecked(true);
  }
};

const handleLocationPermissionAllow = async () => {
  console.log('✅ [App.js] ========================================');
  console.log('✅ [App.js] USER CLICKED "ALLOW LOCATION"');
  console.log('✅ [App.js] ========================================');
  try {
    setShowLocationPermission(false);
    console.log('📱 [App.js] Modal hidden');

    // Mark that we've asked
    await SecureStore.setItemAsync('locationPermissionAsked', 'true');
    console.log('💾 [App.js] Saved permission asked flag to storage');

    // Request permission
    console.log('🙏 [App.js] Requesting location permissions from system...');
    const granted = await geofenceManager.requestLocationPermission();

    if (granted) {
      console.log('✅ [App.js] Permissions GRANTED by user');
      console.log('🚀 [App.js] Initializing geofencing...');
      // Initialize geofencing
      await geofenceManager.initializeGeofencing();
      console.log('🎉 [App.js] Location permission granted and geofencing initialized');
    } else {
      console.log('❌ [App.js] Location permission DENIED by user');
      console.log('❌ [App.js] Geofencing will NOT work');
    }
  } catch (error) {
    console.error('❌ [App.js] Error handling location permission:', error);
  }
};

const handleLocationPermissionDeny = async () => {
  console.log('❌ [App.js] ========================================');
  console.log('❌ [App.js] USER CLICKED "NOT NOW" - PERMISSION DENIED');
  console.log('❌ [App.js] ========================================');
  try {
    setShowLocationPermission(false);

    // Mark that we've asked
    await SecureStore.setItemAsync('locationPermissionAsked', 'true');

    console.log('❌ [App.js] User declined location permission');
    console.log('❌ [App.js] Geofencing will NOT work');
  } catch (error) {
    console.error('❌ [App.js] Error handling location permission denial:', error);
  }
};
  
  
  return (
    <KeyboardProvider>
    <SafeAreaProvider>
    <ThemeProvider>
    {/* <StatusBar translucent barStyle='dark-content' backgroundColor='rgba(0,0,0,0)'/> */}
    <View style={styles.container}>
    <AppProvider>
    {fontload&&(<Localisation notification={notification} props={props}/>)}
    <LocationPermissionModal
    visible={showLocationPermission}
    onAllow={handleLocationPermissionAllow}
    onDeny={handleLocationPermissionDeny}
  />
    </AppProvider>
    </View> 
     
    </ThemeProvider>
    </SafeAreaProvider></KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  }
});

