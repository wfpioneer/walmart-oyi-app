//
//  LoginViewController.h
//  WMSSOProject
//
//  Created by Anthony Helms on 12/7/15.
//  Copyright © 2015 Anthony Helms. All rights reserved.
//

#import <Foundation/Foundation.h>
@import UIKit;
#import "WMAccountAuthentication.h"
#import "WMUser+Auth.h"

@interface LoginViewController : UIViewController <UITextFieldDelegate>

@property id<WMAccountAuthentication> authentication;
@property UIColor* accentColor;
@property Environment ssoEnv;
@property WMAccountManager* acctMgr;

-(void) updateScreenLoading:(BOOL) isLoading;
-(void) dismiss;
@end
