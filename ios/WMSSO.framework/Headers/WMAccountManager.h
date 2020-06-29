//
//  WMAccountManager.h
//  WMSSOProject
//
//  Created by Anthony Helms on 12/7/15.
//  Copyright © 2015 Anthony Helms. All rights reserved.
//

#import <Foundation/Foundation.h>
@import UIKit;
@import WebKit;
#import "WMAccountStore.h"
#import "WMAccountAuthentication.h"
#import "WMAccountStoreFactory.h"
#import "WMAccountAuthenticationFactory.h"

#define SSO_NOTIF_UserSignedIn @"SSO.UserSignedIn"
#define SSO_NOTIF_UserSignedOut @"SSO.UserSignedOut"
#define SSO_NOTIF_UserChanged @"SSO.UserChanged"
#define SSO_NOTIF_UserAuthTypeChanged @"SSO.UserAuthTypeChanged"

@interface WMAccountManager : NSObject

@property WMAccountStore* store;
@property id<WMAccountAuthentication> authentication;
@property (readonly) AuthType availableAuthType;
@property BOOL isColdStart;
@property NSTimer *timerClockCheck;

- (instancetype)initWithAccentColor:(UIColor*)accentColor;
- (instancetype)initWithAccentColor:(UIColor*)accentColor environment:(Environment)env;
- (instancetype)initWithEnvironment:(Environment)env;

- (void) getUserThenDoThis:(void (^)(WMUser*)) callback;
- (void) signOutUserThenDoThis:(void (^)()) callback;
- (void) validateUserTokenThenDoThis:(void (^)(BOOL)) callback;

- (void) verifyAndSignInUser:(WMUser*)user withSplash:(BOOL)withSplash;
- (void) signInWithUser:(WMUser*)user;
- (void) resetSessionData;
- (WMUser*) getLastLoggedInUser;
/**
 Step Up Authentication
 **/
- (void)verifyUser:(WMUser*)user withSplash:(BOOL)withSplash ThenDoThis:(void (^)(BOOL Success)) callback;

//enabling auth context for biometric
- (void) resetBiometricAuthContext;

@end
