package com.leisureloyalty

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.moengage.react.MoEReactPackage;
import com.moengage.core.DataCenter
import com.moengage.core.MoEngage
import com.moengage.react.MoEInitializer
import com.moengage.core.config.FcmConfig
import com.moengage.core.config.LogConfig
import com.moengage.core.config.NotificationConfig
import com.moengage.geofence.MoEGeofenceHelper
import com.moengage.core.config.MoEngageEnvironmentConfig
import com.moengage.core.model.environment.MoEngageEnvironment
class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
              // add(MoEReactPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    
    // val moEngage = MoEngage.Builder(this, "DCMBBW4GE1CX78NNNXFU1VN8", DataCenter.DATA_CENTER_2)
    val moEngage = MoEngage.Builder(this, "DCMBBW4GE1CX78NNNXFU1VN8", DataCenter.DATA_CENTER_2)
    	.configureNotificationMetaData(NotificationConfig(R.drawable.notify, R.drawable._024icon ))//R.color.notiColor, null, true, isBuildingBackStackEnabled = false, isLargeIconDisplayEnabled = true)
    // .configureFcm(FcmConfig(false))
    .configureMoEngageEnvironment(MoEngageEnvironmentConfig(MoEngageEnvironment.TEST))
    // .build()
    //replace X with your data center number
    MoEInitializer.initializeDefaultInstance(applicationContext, moEngage)

    // NOTE: Geofence monitoring is started from JavaScript AFTER location permissions are granted
    // Calling it here would fail because permissions haven't been requested yet
    // See GeofenceManager.js startGeofenceMonitoring() for the actual initialization
    // MoEGeofenceHelper.getInstance().startGeofenceMonitoring(applicationContext)

    SoLoader.init(this, false)
    
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load(bridgelessEnabled=false)
    }
  }
}
