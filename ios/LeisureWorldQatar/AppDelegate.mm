#import "AppDelegate.h"
#import <Firebase.h>

#import <UserNotifications/UserNotifications.h>
#import <React/RCTBundleURLProvider.h>

#import <React/RCTBridge.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#import <ReactNativeMoEngage/MoEngageInitializer.h>
#import <MoEngageSDK/MoEngageSDK.h>

#import "RNBootSplash.h" // ⬅️ add the header import

@interface AppDelegate () <UNUserNotificationCenterDelegate, MoEngageMessagingDelegate>
@end
//#import <Firebase.h>
//#import "RNFirebaseMessaging.h"
//#import <ReactNativeNavigation/ReactNativeNavigation.h>
@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

   {
      [FIRApp configure];
    }

  self.moduleName = @"LeisureWorldQatar";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
    MoEngageSDKConfig* sdkConfig = [[MoEngageSDKConfig alloc] initWithAppId:@"DCMBBW4GE1CX78NNNXFU1VN8" dataCenter:MoEngageDataCenterData_center_02];
  sdkConfig.appGroupID=@"group.com.leisure.Loyalty.MoEngage";
sdkConfig.consoleLogConfig = [[MoEngageConsoleLogConfig alloc] initWithIsLoggingEnabled:true loglevel:MoEngageLoggerTypeVerbose];
[[MoEngageInitializer sharedInstance] initializeDefaultSDKConfig:sdkConfig andLaunchOptions:launchOptions];
  
  // Set the delegate
  [[MoEngageSDKMessaging sharedInstance] setMessagingDelegate:self forAppID:@"DCMBBW4GE1CX78NNNXFU1VN8"];
  
  
  [[MoEngageSDKMessaging sharedInstance] registerForRemoteNotificationWithCategories:nil andUserNotificationCenterDelegate:self];
  
  [[MoEngageSDKMessaging sharedInstance] registerForRemoteProvisionalNotificationWithCategories:nil andUserNotificationCenterDelegate:self];
  
  
  // Hide the splash screen after a 1000ms delay (1 second)
//     dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 3 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
//         [RNSplashScreen hide];
//     });
//    RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
//    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
//                                                   moduleName:@"LeisureWorldQatar"
//                                            initialProperties:nil];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Notification Clicked Callback
-(void)notificationClickedWithScreenName:(NSString *)screenName andKVPairs:(NSDictionary *)kvPairs{
    if (screenName) {
        NSLog(@"Screen Name : %@",screenName);
    }
    if (kvPairs) {
        NSLog(@"KV Pairs : %@",kvPairs);
    }
}
 
// Notification Clicked Callback with Push Payload
-(void)notificationClickedWithScreenName:(NSString *)screenName KVPairs:(NSDictionary *)kvPairs andPushPayload:(NSDictionary *)userInfo{
    NSLog(@"Push Payload: %@",userInfo);
    if (screenName) {
        NSLog(@"Screen Name : %@",screenName);
    }
    if (kvPairs) {
        NSLog(@"KV Pairs : %@",kvPairs);
    }
}


// For deep links
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// For universal links
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// ⬇️ Add this before file @end (for react-native 0.74+)
- (void)customizeRootView:(RCTRootView *)rootView {
  [super customizeRootView:rootView];
  // Set the root view to use the full bounds
    rootView.frame = [UIScreen mainScreen].bounds;
  [RNBootSplash initWithStoryboard:@"LaunchScreen" rootView:rootView]; // ⬅️ initialize the splash screen
}

@end
