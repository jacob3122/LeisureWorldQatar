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
    if (Platform.OS !== 'android') {
      console.log('Geofencing only supported on Android');
      return false;
    }

    try {
      const fineLocationStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      const backgroundLocationStatus = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
      
      console.log('Fine Location Status:', fineLocationStatus);
      console.log('Background Location Status:', backgroundLocationStatus);
      
      const granted = 
        fineLocationStatus === RESULTS.GRANTED && 
        backgroundLocationStatus === RESULTS.GRANTED;
      
      this.permissionGranted = granted;
      return granted;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  }

  // Request location permissions
  async requestLocationPermission() {
    if (Platform.OS !== 'android') {
      console.log('Geofencing only supported on Android');
      return false;
    }

    try {
      // First request fine location
      const fineLocationResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Fine Location Permission Result:', fineLocationResult);

      if (fineLocationResult !== RESULTS.GRANTED) {
        console.log('Fine location permission denied');
        return false;
      }

      // Then request background location (required for Android 10+)
      const backgroundLocationResult = await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
      console.log('Background Location Permission Result:', backgroundLocationResult);

      const granted = backgroundLocationResult === RESULTS.GRANTED;
      this.permissionGranted = granted;
      
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  // Initialize geofencing
  async initializeGeofencing() {
    if (this.isInitialized) {
      console.log('Geofencing already initialized');
      return true;
    }

    try {
      const hasPermission = await this.checkLocationPermission();
      
      if (!hasPermission) {
        console.log('Location permission not granted, cannot initialize geofencing');
        return false;
      }

      // Start geofence monitoring through MoEngage
      await this.startGeofenceMonitoring();
      
      this.isInitialized = true;
      console.log('Geofencing initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing geofencing:', error);
      return false;
    }
  }

  // Start geofence monitoring using MoEngage Geofence SDK
  async startGeofenceMonitoring() {
    try {
      if (Platform.OS === 'android') {
        // THIS IS THE KEY LINE - Start MoEngage geofence monitoring
        ReactMoEGeofence.startGeofenceMonitoring(WORKSPACE_ID);
        console.log('MoEngage Geofence monitoring started for workspace:', WORKSPACE_ID);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error starting geofence monitoring:', error);
      return false;
    }
  }

  // Stop geofence monitoring
  async stopGeofenceMonitoring() {
    try {
      if (Platform.OS === 'android') {
        ReactMoEGeofence.stopGeofenceMonitoring(WORKSPACE_ID);
        console.log('MoEngage Geofence monitoring stopped');
      }
      this.isInitialized = false;
      return true;
    } catch (error) {
      console.error('Error stopping geofence monitoring:', error);
      return false;
    }
  }

  // Handle app state changes
  async handleAppStateChange(nextAppState) {
    if (nextAppState === 'active' && this.permissionGranted && !this.isInitialized) {
      // Re-initialize if app comes to foreground and was previously initialized
      await this.initializeGeofencing();
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