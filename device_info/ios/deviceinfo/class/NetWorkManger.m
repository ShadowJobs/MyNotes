//
//  NetWorkManger.m
//  deviceinfo
//
//  Created by playcrab on 4/7/15.
//  Copyright (c) 2015年 deviceinfo. All rights reserved.
//

#import "NetWorkManger.h"
#import "ASIHTTPRequest.h"
#import "ASIFormDataRequest.h"
@implementation NetWorkManger
static NetWorkManger* _sharedMnager;
+ (NetWorkManger*) sharedManger
{
    if (_sharedMnager == nil) {
        _sharedMnager = [[NetWorkManger alloc] init];
    }
    return _sharedMnager;
}
- (void)sendDataToServer:(NSDictionary*)dic
{
//    NSString* url = @"http://172.16.149.93:8080/device/saveinfo";
    ASIFormDataRequest *request = [ASIFormDataRequest requestWithURL:[NSURL URLWithString:SERVER_URL]];
    request.delegate = self;
    for (NSString* key in [dic allKeys]) {
        [request setPostValue:[dic objectForKey:key] forKey:key];
    }
    request.timeOutSeconds = 60;
    [request buildRequestHeaders];
    [request startSynchronous];
}
- (void)requestFinished:(ASIHTTPRequest *)request
{
    NSString* str = [[NSString alloc] initWithData:[request responseData] encoding:NSUTF8StringEncoding];
    NSDictionary* dic = [str objectFromJSONString];
    NSNumber* timer = [dic objectForKey:@"time"];
    NSNumber* status = [dic objectForKey:@"status"];
    NSNumber* msg = [dic objectForKey:@"msg"];

    if ([status integerValue] == 10000 ) {
        //Succesed
        NSLog(@"requestFinished");
    }
    if (msg) {
        //TO
    }
    [[NSUserDefaults standardUserDefaults] setObject:timer forKey:@"timer"];
}
- (void)requestFailed:(ASIHTTPRequest *)request
{
    NSLog(@"requestFailed");
}
@end
