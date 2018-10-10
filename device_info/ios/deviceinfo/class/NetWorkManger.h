//
//  NetWorkManger.h
//  deviceinfo
//
//  Created by playcrab on 4/7/15.
//  Copyright (c) 2015年 deviceinfo. All rights reserved.
//

#define SERVER_URL @"http://172.16.149.93:8080/device/saveinfo"

#import <Foundation/Foundation.h>
#import "ASIHTTPRequest.h"
#import "JSONKit.h"
@interface NetWorkManger : NSObject<ASIHTTPRequestDelegate>
+ (NetWorkManger*) sharedManger;
- (void)sendDataToServer:(NSDictionary*)dic;

- (void)requestFinished:(ASIHTTPRequest *)request;
- (void)requestFailed:(ASIHTTPRequest *)request;
@end
