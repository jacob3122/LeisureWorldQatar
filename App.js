// import 'react-native-gesture-handler';
import SecureStore from './Tools/Components/SecureStore';
import React, {useEffect, useState} from 'react';
import {
  Linking,
  StatusBar,
  StyleSheet,
  View,
  Text,
  AppState,
  Appearance,
} from 'react-native';
import Localisation from './Tools/Components/Localisation';
import {ThemeProvider} from './Tools/context/ThemeProvider';
import * as Tools from './Tools/Components/Tools';
import LightColors from './Tools/constants/LightColors';
import AppProvider from './src/js/reducers/AppReducer';
import ReactMoE, {
  MoEAnalyticsConfig,
  MoEInitConfig,
  MoEPushConfig,
  MoEngageLogConfig,
  MoEngageLogLevel,
} from 'react-native-moengage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import RNBootSplash from 'react-native-bootsplash';
import geofenceManager from './Tools/Components/GeofenceManager';
import LocationPermissionModal from './Tools/Components/LocationPermissionModal';
// import SecureStore from './Tools/Components/SecureStore';

export default function App(props) {
  const [fontload, setFontLoad] = useState(false);
  const [isEnabledForReleaseBuild, setisEnabledForReleaseBuild] =
    useState(true);

  const [notification, setNotification] = useState(undefined);
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [locationPermissionChecked, setLocationPermissionChecked] =
    useState(false);
  useEffect(() => {
    const moEInitConfig = new MoEInitConfig(
      // MoEPushConfig.defaultConfig(),
      new MoEPushConfig(true),
      new MoEngageLogConfig(MoEngageLogLevel.VERBOSE, isEnabledForReleaseBuild),
      new MoEAnalyticsConfig(true),
    );

    ReactMoE.setEventListener('pushTokenGenerated', payload => {});
    // console.log("pushClickedTest");
    ReactMoE.setEventListener('pushClicked', notificationPayload => {
      setNotification(notificationPayload);
    });

    ReactMoE.setEventListener('geoFenceTriggered', geofencePayload => {
      const timestamp = new Date().toLocaleTimeString();
    });

    ReactMoE.setEventListener('geoFenceEvent', geofenceEvent => {
      const timestamp = new Date().toLocaleTimeString();
    });

    ReactMoE.initialize('DCMBBW4GE1CX78NNNXFU1VN8', moEInitConfig);

    global.profileUpdate = false;
    global.initProfile = undefined;
    global.rateVisible = false;
    global.loadingBar = 0;
    global.showRegister = false;
    global.showHamView = true;
    global.checkBio = false;
    global.bgColor = Tools.hextorgb(LightColors.bluelightShadeColor);
    global.pageContent = undefined;
    global.AdVisible = undefined;

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;

    errorFix();
    setFontLoad(true);
    setTimeout(() => {
      RNBootSplash.hide({fade: true});
      ReactMoE.showInApp();
    }, 1000);

    console.log('📍 [App.js] Starting geofencing initialization...');
    initializeGeofencing();

    return () => {
      SecureStore.setItemAsync('initLogin', '');
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('App State Changed:', nextAppState);
      geofenceManager.handleAppStateChange(nextAppState);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const errorFix = () => {
    global.XMLHttpRequest =
      global.originalXMLHttpRequest || global.XMLHttpRequest;
    global.FormData = global.originalFormData || global.FormData;

    if (window.FETCH_SUPPORT) {
      window.FETCH_SUPPORT.blob = false;
    } else {
      global.Blob = global.originalBlob || global.Blob;
      global.FileReader = global.originalFileReader || global.FileReader;
    }
  };

  const initializeGeofencing = async () => {
    try {
      const askedBefore = await SecureStore.getItemAsync(
        'locationPermissionAsked',
      );

      if (askedBefore === 'true') {
        const hasPermission = await geofenceManager.checkLocationPermission();
        if (hasPermission) {
          await geofenceManager.initializeGeofencing();
        } else {
        }
        setLocationPermissionChecked(true);
        return;
      }

      // CHANGE THIS LINE - Add a delay
      setTimeout(() => {
        setShowLocationPermission(true);
      }, 1500); // Wait 1.5 seconds for locale to be ready

      setLocationPermissionChecked(true);
    } catch (error) {
      setLocationPermissionChecked(true);
    }
  };

  const handleLocationPermissionAllow = async () => {
    try {
      setShowLocationPermission(false);

      // Mark that we've asked
      await SecureStore.setItemAsync('locationPermissionAsked', 'true');

      // Request permission

      const granted = await geofenceManager.requestLocationPermission();

      if (granted) {
        // Initialize geofencing
        await geofenceManager.initializeGeofencing();
      } else {
      }
    } catch (error) {
      console.error('❌ [App.js] Error handling location permission:', error);
    }
  };

  const handleLocationPermissionDeny = async () => {
    try {
      setShowLocationPermission(false);

      // Mark that we've asked
      await SecureStore.setItemAsync('locationPermissionAsked', 'true');
    } catch (error) {
      console.error(
        '❌ [App.js] Error handling location permission denial:',
        error,
      );
    }
  };

  return (
    <KeyboardProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          {/* <StatusBar translucent barStyle='dark-content' backgroundColor='rgba(0,0,0,0)'/> */}
          <View style={styles.container}>
            <AppProvider>
              {fontload && (
                <Localisation notification={notification} props={props} />
              )}
              <LocationPermissionModal
                visible={showLocationPermission}
                onAllow={handleLocationPermissionAllow}
                onDeny={handleLocationPermissionDeny}
              />
            </AppProvider>
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
