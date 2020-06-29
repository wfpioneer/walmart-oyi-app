//
//  WMAccountAuthentication.h
//  WMSSOProject
//
//  Created by Anthony Helms on 12/7/15.
//  Copyright © 2015 Anthony Helms. All rights reserved.
//

#ifndef WMAccountAuthentication_h
#define WMAccountAuthentication_h

#import "WMUser.h"

//adding enums so we can switch environments
typedef enum {
    kSTG = 1,
    kQA,
    kPROD,
    kNoEnvProvided
} Environment;

//Authentication Type
typedef NS_ENUM(NSUInteger, AuthType) {
    kPassword,
    kFaceID,
    kTouchID
};


@protocol WMAccountAuthentication <NSObject>


- (void) authenticateWithUser:(WMUser*)user 
                     AndPassword:(NSString*)password
                      ThenDoThis:(void (^)(WMUser*)) callback;

- (void) authenticateWithUser:(WMUser*)user
                   ThenDoThis:(void (^)(WMUser*)) callback;

- (BOOL) isTokenValidForUser:(WMUser*)user;
- (NSString*) getTokenType;
- (void) validateTokenForUser:(WMUser*)user
                    ThenDoThis:(void (^)(BOOL)) callback;
-(void) invalidateSSOToken:(WMUser*)user
               ThenDoThis:(void (^)(WMUser*)) callback;
-(void)validateClockInStatus:(WMUser*)user
                  ThenDoThis:(void (^)(NSMutableDictionary*)) callback;

@property Environment ssoEnv;
@end

#endif /* WMAccountAuthentication_h */
