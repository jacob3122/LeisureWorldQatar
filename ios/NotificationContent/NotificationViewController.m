//
//  NotificationViewController.m
//  NotificationContent
//
//  Created by Richard Navin Raj on 30/10/2024.
//

#import "NotificationViewController.h"
#import <UserNotifications/UserNotifications.h>
#import <UserNotificationsUI/UserNotificationsUI.h>
@import MoEngageRichNotification;

@interface NotificationViewController () <UNNotificationContentExtension>

@end

@implementation NotificationViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  // Set App Group ID
  [MoEngageSDKRichNotification setAppGroupID:@"group.com.leisure.Loyalty.MoEngage"];

  
}

- (void)didReceiveNotification:(UNNotification *)notification {
  // Method to add template to UI
  [MoEngageSDKRichNotification addPushTemplateToController:self withNotification:notification];
}

@end
