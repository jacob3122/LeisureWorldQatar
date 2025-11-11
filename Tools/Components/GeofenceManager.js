import { Platform } from 'react-native';
import ReactMoE from 'react-native-moengage';
import ReactMoEGeofence from 'react-native-moengage-geofence';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';

const WORKSPACE_ID = 'DCMBBW4GE1CX78NNNXFU1VN8';

class GeofenceManager {
  constructor() {
    this.isInitialized = false;
    this.permissionGranted = false;
  }

  // Check if location permissions are granted
  async checkLocationPermission() {
    console.log('🔍 [GeofenceManager] Checking location permissions...');

    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      console.log('❌ [GeofenceManager] Geofencing only supported on Android and iOS');
      return false;
    }

    try {
      let granted = false;

      if (Platform.OS === 'android') {
        const fineLocationStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        const backgroundLocationStatus = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);

        console.log('📍 [GeofenceManager] Android Fine Location Status:', fineLocationStatus);
        console.log('📍 [GeofenceManager] Android Background Location Status:', backgroundLocationStatus);

        granted = fineLocationStatus === RESULTS.GRANTED && backgroundLocationStatus === RESULTS.GRANTED;

        if (granted) {
          console.log('✅ [GeofenceManager] Android location permissions GRANTED');
        } else {
          console.log('❌ [GeofenceManager] Android location permissions NOT granted');
          console.log('   - Fine Location:', fineLocationStatus);
          console.log('   - Background Location:', backgroundLocationStatus);
        }
      } else if (Platform.OS === 'ios') {
        const locationStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        
        console.log('📍 [GeofenceManager] iOS Location Always Status:', locationStatus);
        
        granted = locationStatus === RESULTS.GRANTED;
        
        if (granted) {
          console.log('✅ [GeofenceManager] iOS location permission GRANTED');
        } else {
          console.log('❌ [GeofenceManager] iOS location permission NOT granted');
          console.log('   - Location Always:', locationStatus);
        }
      }

      this.permissionGranted = granted;
      return granted;
    } catch (error) {
      console.error('❌ [GeofenceManager] Error checking location permission:', error);
      return false;
    }
  }

  // Request location permissions
  async requestLocationPermission() {
    console.log('🙏 [GeofenceManager] Requesting location permissions...');

    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      console.log('❌ [GeofenceManager] Geofencing only supported on Android and iOS');
      return false;
    }

    try {
      let granted = false;

      if (Platform.OS === 'android') {
        // First request fine location
        console.log('📍 [GeofenceManager] Requesting Android FINE location permission...');
        const fineLocationResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        console.log('📍 [GeofenceManager] Fine Location Permission Result:', fineLocationResult);

        if (fineLocationResult !== RESULTS.GRANTED) {
          console.log('❌ [GeofenceManager] Fine location permission DENIED');
          return false;
        }

        console.log('✅ [GeofenceManager] Fine location permission GRANTED');

        // Then request background location (required for Android 10+)
        console.log('📍 [GeofenceManager] Requesting Android BACKGROUND location permission...');
        const backgroundLocationResult = await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        console.log('📍 [GeofenceManager] Background Location Permission Result:', backgroundLocationResult);

        granted = backgroundLocationResult === RESULTS.GRANTED;

        if (granted) {
          console.log('✅ [GeofenceManager] Android background location permission GRANTED');
          console.log('✅ [GeofenceManager] ALL Android permissions granted successfully!');
        } else {
          console.log('❌ [GeofenceManager] Android background location permission DENIED');
        }
      } else if (Platform.OS === 'ios') {
        // Request iOS location always permission
        console.log('📍 [GeofenceManager] Requesting iOS LOCATION ALWAYS permission...');
        const locationResult = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
        console.log('📍 [GeofenceManager] iOS Location Always Permission Result:', locationResult);

        granted = locationResult === RESULTS.GRANTED;

        if (granted) {
          console.log('✅ [GeofenceManager] iOS location always permission GRANTED');
          console.log('✅ [GeofenceManager] iOS permissions granted successfully!');
        } else {
          console.log('❌ [GeofenceManager] iOS location always permission DENIED');
        }
      }

      this.permissionGranted = granted;
      return granted;
    } catch (error) {
      console.error('❌ [GeofenceManager] Error requesting location permission:', error);
      return false;
    }
  }

  // Initialize geofencing
  async initializeGeofencing() {
    console.log('🚀 [GeofenceManager] ========================================');
    console.log('🚀 [GeofenceManager] INITIALIZING GEOFENCING...');
    console.log('🚀 [GeofenceManager] ========================================');

    if (this.isInitialized) {
      console.log('⚠️  [GeofenceManager] Geofencing already initialized, skipping...');
      return true;
    }

    try {
      console.log('🔍 [GeofenceManager] Step 1: Checking location permissions...');
      const hasPermission = await this.checkLocationPermission();

      if (!hasPermission) {
        console.log('❌ [GeofenceManager] Location permission not granted, CANNOT initialize geofencing');
        console.log('❌ [GeofenceManager] Please grant "Allow all the time" location permission');
        return false;
      }

      console.log('✅ [GeofenceManager] Step 1 Complete: Permissions verified');
      console.log('📡 [GeofenceManager] Step 2: Starting geofence monitoring...');

      // Start geofence monitoring through MoEngage
      await this.startGeofenceMonitoring();

      this.isInitialized = true;

      console.log('✅ [GeofenceManager] Step 2 Complete: Monitoring started');
      console.log('🎉 [GeofenceManager] ========================================');
      console.log('🎉 [GeofenceManager] GEOFENCING INITIALIZED SUCCESSFULLY!');
      console.log('🎉 [GeofenceManager] ========================================');
      return true;
    } catch (error) {
      console.error('❌ [GeofenceManager] FATAL ERROR initializing geofencing:', error);
      return false;
    }
  }

  // Start geofence monitoring using MoEngage Geofence SDK
  async startGeofenceMonitoring() {
    console.log('📡 [GeofenceManager] startGeofenceMonitoring() called');

    try {
      if (Platform.OS === 'android') {
        console.log('📱 [GeofenceManager] Platform: Android ✅');
        console.log('🔑 [GeofenceManager] Workspace ID:', WORKSPACE_ID);
        console.log('📡 [GeofenceManager] Calling ReactMoEGeofence.startGeofenceMonitoring()...');

        // Start MoEngage geofence monitoring for Android
        ReactMoEGeofence.startGeofenceMonitoring(WORKSPACE_ID);

        console.log('✅ [GeofenceManager] Android MoEngage Geofence monitoring API called successfully');
        console.log('📡 [GeofenceManager] MoEngage should now:');
        console.log('   1. Contact MoEngage servers');
        console.log('   2. Download active geofences from dashboard');
        console.log('   3. Register geofences with Android LocationManager');
        console.log('   4. Start monitoring your location');
        console.log('🔔 [GeofenceManager] Workspace:', WORKSPACE_ID);

        return true;
      } else if (Platform.OS === 'ios') {
        console.log('📱 [GeofenceManager] Platform: iOS ✅');
        console.log('🔑 [GeofenceManager] Workspace ID:', WORKSPACE_ID);
        console.log('📡 [GeofenceManager] Calling ReactMoEGeofence.startGeofenceMonitoring()...');

        // Start MoEngage geofence monitoring for iOS
        ReactMoEGeofence.startGeofenceMonitoring(WORKSPACE_ID);

        console.log('✅ [GeofenceManager] iOS MoEngage Geofence monitoring API called successfully');
        console.log('📡 [GeofenceManager] MoEngage should now:');
        console.log('   1. Contact MoEngage servers');
        console.log('   2. Download active geofences from dashboard');
        console.log('   3. Register geofences with iOS Core Location');
        console.log('   4. Start monitoring your location');
        console.log('🔔 [GeofenceManager] Workspace:', WORKSPACE_ID);

        return true;
      }

      console.log('❌ [GeofenceManager] Platform not supported, geofencing only works on Android and iOS');
      return false;
    } catch (error) {
      console.error('❌ [GeofenceManager] ERROR starting geofence monitoring:', error);
      console.error('❌ [GeofenceManager] Error details:', JSON.stringify(error, null, 2));
      return false;
    }
  }

  // Stop geofence monitoring
  async stopGeofenceMonitoring() {
    try {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        ReactMoEGeofence.stopGeofenceMonitoring(WORKSPACE_ID);
        console.log(`🛑 [GeofenceManager] ${Platform.OS} MoEngage Geofence monitoring stopped`);
      }
      this.isInitialized = false;
      return true;
    } catch (error) {
      console.error('❌ [GeofenceManager] Error stopping geofence monitoring:', error);
      return false;
    }
  }

  // Refresh geofences - stops and restarts monitoring to download latest campaigns
  async refreshGeofences() {
    console.log('🔄 [GeofenceManager] ========================================');
    console.log('🔄 [GeofenceManager] REFRESHING GEOFENCES...');
    console.log('🔄 [GeofenceManager] ========================================');

    try {
      // Stop existing geofence monitoring
      console.log('🛑 [GeofenceManager] Stopping existing geofence monitoring...');
      await this.stopGeofenceMonitoring();

      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Restart geofence monitoring (this will download latest campaigns)
      console.log('📡 [GeofenceManager] Restarting geofence monitoring...');
      const hasPermission = await this.checkLocationPermission();

      if (!hasPermission) {
        console.log('❌ [GeofenceManager] Location permission not granted, cannot refresh');
        return false;
      }

      await this.startGeofenceMonitoring();
      this.isInitialized = true;

      console.log('✅ [GeofenceManager] ========================================');
      console.log('✅ [GeofenceManager] GEOFENCES REFRESHED SUCCESSFULLY!');
      console.log('✅ [GeofenceManager] Latest campaigns downloaded from MoEngage');
      console.log('✅ [GeofenceManager] ========================================');
      return true;
    } catch (error) {
      console.error('❌ [GeofenceManager] Error refreshing geofences:', error);
      return false;
    }
  }

  // Handle app state changes
  async handleAppStateChange(nextAppState) {
    console.log('🔄 [GeofenceManager] App state changed to:', nextAppState);
    console.log('🔄 [GeofenceManager] Permission granted:', this.permissionGranted);
    console.log('🔄 [GeofenceManager] Is initialized:', this.isInitialized);

    if (nextAppState === 'active' && this.permissionGranted) {
      if (!this.isInitialized) {
        console.log('🔄 [GeofenceManager] App came to foreground, initializing geofencing...');
        await this.initializeGeofencing();
      } else {
        console.log('🔄 [GeofenceManager] App came to foreground, refreshing geofences to get latest campaigns...');
        // Refresh geofences to download any new/updated campaigns
        await this.refreshGeofences();
      }
    }
  }

  // Get current status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      permissionGranted: this.permissionGranted,
    };
  }
}

// Export singleton instance
const geofenceManager = new GeofenceManager();
export default geofenceManager;