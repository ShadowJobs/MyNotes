//
//  BackgroundRunManger.h
//  deviceinfo
//
//  Created by playcrab on 4/7/15.
//  Copyright (c) 2015年 deviceinfo. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface BackgroundRunManger : NSObject

@end
@protocol BackgroundRunDelegate <NSObject>

@optional
- (void)runAction;

@end