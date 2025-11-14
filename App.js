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
  const [canShowMainApp, setCanShowMainApp] = useState(false);
  
  useEffect(()=>{
    console.log('🟢 [APP.JS] ========== APP COMPONENT MOUNTED ==========');
    console.log('🟢 [APP.JS] Initial State:');
    console.log('   - showLocationPermission:', false);
    console.log('   - locationPermissionChecked:', false);
    console.log('   - canShowMainApp:', false);
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

     console.log('📍 [App.js] About to call initializeGeofencing()...');
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
  console.log('\n🎯 [APP.JS] ========== initializeGeofencing() STARTED ==========');
  console.log('🎯 [APP.JS] Timestamp:', new Date().toISOString());
  try {
    console.log('🔍 [APP.JS] Checking SecureStore for locationPermissionAsked...');
    const askedBefore = await SecureStore.getItemAsync('locationPermissionAsked');
    console.log('🔍 [APP.JS] SecureStore result:', askedBefore);
    console.log('🔍 [APP.JS] askedBefore === "true"?', askedBefore === 'true');

    if (askedBefore === 'true') {
      console.log('\n✅ [APP.JS] ========== USER WAS ASKED BEFORE ==========');
      console.log('✅ [APP.JS] Checking current permission status...');
      const hasPermission = await geofenceManager.checkLocationPermission();
      console.log('✅ [APP.JS] Permission check result:', hasPermission);
      
      if (hasPermission) {
        console.log('✅ [App.js] Permission granted, initializing geofencing...');
        await geofenceManager.initializeGeofencing();
        console.log('✅ [App.js] Geofencing initialized - permission already granted');
      } else {
        console.log('❌ [APP.JS] Permission not granted, geofencing cannot start');
      }
      console.log('🚪 [APP.JS] Setting canShowMainApp = true (user was asked before)');
      setLocationPermissionChecked(true);
      setCanShowMainApp(true);
      console.log('🎯 [APP.JS] ========== initializeGeofencing() ENDED (asked before) ==========\n');
      return;
    }

    console.log('\n📍 [APP.JS] ========== FIRST TIME USER ==========');
    console.log('📍 [APP.JS] User has never been asked for location permission');
    console.log('⏱️  [APP.JS] Setting 8-second timer to show modal...');
    console.log('⏱️  [APP.JS] Timer will fire at:', new Date(Date.now() + 8000).toISOString());
    
    setTimeout(() => {
      console.log('\n⏰ [APP.JS] ========== 8-SECOND TIMER FIRED ==========');
      console.log('⏰ [APP.JS] Timestamp:', new Date().toISOString());
      console.log('⏰ [APP.JS] About to call setShowLocationPermission(true)');
      setShowLocationPermission(true);
      console.log('⏰ [APP.JS] setShowLocationPermission(true) called');
      console.log('⏰ [APP.JS] Modal should now be visible');
    }, 8000);

    setLocationPermissionChecked(true);
    console.log('🎯 [APP.JS] ========== initializeGeofencing() ENDED (first time) ==========\n');
  } catch (error) {
    console.error('❌ [APP.JS] ========== ERROR in initializeGeofencing ==========');
    console.error('❌ [APP.JS] Error:', error);
    setLocationPermissionChecked(true);
  }
};

const handleLocationPermissionAllow = async () => {
  console.log('\n✅ [APP.JS] ========================================');
  console.log('✅ [APP.JS] USER CLICKED "ALLOW LOCATION" BUTTON');
  console.log('✅ [APP.JS] ========================================');
  console.log('✅ [APP.JS] Timestamp:', new Date().toISOString());
  try {
    console.log('📱 [APP.JS] Calling setShowLocationPermission(false)...');
    setShowLocationPermission(false);
    console.log('📱 [APP.JS] Modal hidden');

    console.log('💾 [APP.JS] Saving to SecureStore: locationPermissionAsked = true');
    await SecureStore.setItemAsync('locationPermissionAsked', 'true');
    console.log('💾 [APP.JS] Saved to SecureStore successfully');

    console.log('🙏 [APP.JS] Calling geofenceManager.requestLocationPermission()...');
    const granted = await geofenceManager.requestLocationPermission();
    console.log('🙏 [APP.JS] Permission request result:', granted);

    if (granted) {
      console.log('✅ [APP.JS] Permissions GRANTED by user');
      console.log('🚀 [APP.JS] Calling geofenceManager.initializeGeofencing()...');
      await geofenceManager.initializeGeofencing();
      console.log('🎉 [APP.JS] Geofencing initialized successfully');
    } else {
      console.log('❌ [APP.JS] Location permission DENIED by user');
      console.log('❌ [APP.JS] Geofencing will NOT work');
    }
    
    console.log('🚪 [APP.JS] Setting canShowMainApp = true');
    setCanShowMainApp(true);
    console.log('✅ [APP.JS] ========== handleLocationPermissionAllow ENDED ==========\n');
  } catch (error) {
    console.error('❌ [APP.JS] ========== ERROR in handleLocationPermissionAllow ==========');
    console.error('❌ [APP.JS] Error:', error);
    setCanShowMainApp(true);
  }
};

const handleLocationPermissionDeny = async () => {
  console.log('\n❌ [APP.JS] ========================================');
  console.log('❌ [APP.JS] USER CLICKED "NOT NOW" BUTTON');
  console.log('❌ [APP.JS] ========================================');
  console.log('❌ [APP.JS] Timestamp:', new Date().toISOString());
  try {
    console.log('📱 [APP.JS] Calling setShowLocationPermission(false)...');
    setShowLocationPermission(false);
    console.log('📱 [APP.JS] Modal hidden');

    console.log('💾 [APP.JS] Saving to SecureStore: locationPermissionAsked = true');
    await SecureStore.setItemAsync('locationPermissionAsked', 'true');
    console.log('💾 [APP.JS] Saved to SecureStore successfully');

    console.log('❌ [APP.JS] User declined location permission');
    console.log('❌ [APP.JS] Geofencing will NOT work');
    
    console.log('🚪 [APP.JS] Setting canShowMainApp = true');
    setCanShowMainApp(true);
    console.log('❌ [APP.JS] ========== handleLocationPermissionDeny ENDED ==========\n');
  } catch (error) {
    console.error('❌ [APP.JS] ========== ERROR in handleLocationPermissionDeny ==========');
    console.error('❌ [APP.JS] Error:', error);
    setCanShowMainApp(true);
  }
};
  
  
  return (
    <KeyboardProvider>
    <SafeAreaProvider>
    <ThemeProvider>
    {/* <StatusBar translucent barStyle='dark-content' backgroundColor='rgba(0,0,0,0)'/> */}
    <View style={styles.container}>
    <AppProvider>
    {fontload && canShowMainApp && (<Localisation notification={notification} props={props}/>)}
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

