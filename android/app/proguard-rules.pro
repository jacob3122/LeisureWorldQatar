# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# MoEngage ProGuard Rules
-keep class com.moengage.** { *; }
-dontwarn com.moengage.**
-keep interface com.moengage.** { *; }
-keep class com.moe.pushlibrary.** { *; }
-dontwarn com.moe.pushlibrary.**

# MoEngage Geofence
-keep class com.moengage.geofence.** { *; }
-dontwarn com.moengage.geofence.**

# Google Play Services Location (required for geofencing)
-keep class com.google.android.gms.location.** { *; }
-dontwarn com.google.android.gms.location.**
