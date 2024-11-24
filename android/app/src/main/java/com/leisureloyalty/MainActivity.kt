package com.leisureloyalty
import android.os.Bundle // Import Bundle here
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {
  
  override fun onCreate(savedInstanceState: Bundle?) {
    
    RNBootSplash.init(this, R.style.BootTheme)
    
    super.onCreate(savedInstanceState)
    
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      // Automatically use the color from either res/values/colors.xml or res/values-night/colors.xml based on the theme
      window.statusBarColor = ContextCompat.getColor(this, R.color.status_bar_color)
      window.navigationBarColor = ContextCompat.getColor(this, R.color.navigation_bar_color)
    }
    
  }
  
  /**
  * Returns the name of the main component registered from JavaScript. This is used to schedule
  * rendering of the component.
  */
  override fun getMainComponentName(): String = "LeisureWorldQatar"
  
  /**
  * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
  * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
  */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
  DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
