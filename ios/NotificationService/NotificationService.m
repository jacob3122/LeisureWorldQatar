//
//  NotificationService.m
//  NotificationService
//
//  Created by Richard Navin Raj on 21/10/2024.
//

#import "NotificationService.h"
// 1st Step
@import MoEngageRichNotification;

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
  
  // 2nd Step
  [MoEngageSDKRichNotification setAppGroupID: @"group.com.leisure.Loyalty.MoEngage"];
  
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
  
  // 3rd Step
         [MoEngageSDKRichNotification handleWithRichNotificationRequest:request withContentHandler:contentHandler];
    
    // Modify the notification content here...
  
  
//    self.bestAttemptContent.title = [NSString stringWithFormat:@"%@ [modified]", self.bestAttemptContent.title];
//    
//    self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

@end
