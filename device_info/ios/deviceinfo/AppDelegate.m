//
//  AppDelegate.m
//  deviceinfo
//
//  Created by playcrab on 2/7/15.
//  Copyright (c) 2015年 deviceinfo. All rights reserved.
//

#import "AppDelegate.h"
#import "DeviceInfoManger.h"
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    [[NSUserDefaults standardUserDefaults] setObject:[NSNumber numberWithDouble:1.0f] forKey:@"timer"];
    [self statrTimer];
    return YES;
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:nil];
    
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}
- (void)statrTimer
{
    NSTimeInterval  timer = [[[NSUserDefaults standardUserDefaults] objectForKey:@"timer"] doubleValue];
    self.myTimer =[NSTimer scheduledTimerWithTimeInterval:timer
                                                   target:self
                                                 selector:@selector(timeMenthed:) userInfo:nil
                                                  repeats:NO];
}
- (void)tik:(NSTimer *)paramSender
{
    if ([[UIApplication sharedApplication] backgroundTimeRemaining] < 61.0) {
        NSString *musicFilePath = [[NSBundle mainBundle] pathForResource:@"01" ofType:@"mp3"]; //创建音乐文件路径
        NSURL *musicURL = [[NSURL alloc] initFileURLWithPath:musicFilePath];
        AVAudioPlayer *thePlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:musicURL error:nil];
        //创建播放器
        [thePlayer prepareToPlay];
        [thePlayer setVolume:1]; //设置音量大小
        thePlayer.numberOfLoops = -1;//设置音乐播放次数 -1为一直循环
        [thePlayer play]; //播放
        [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback withOptions:AVAudioSessionCategoryOptionMixWithOthers error:nil];
        [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:nil];
    }
    
}
-(void) timeMenthed:(NSTimer *)paramSender
{
    NSDictionary* disData = [DeviceInfoManger getDiskSpaceInfor];
    NSDictionary* memoryData = [DeviceInfoManger getMemoryInfor];
    NSDictionary* cpuData = [DeviceInfoManger getCpuInfo];
    NSDictionary* systemData = [DeviceInfoManger getSystemInfor];
    NSDictionary* location = [DeviceInfoManger getLocation];
    //mac地址、硬盘使用率、内存使用率、用户名、GPS(移动端)、机型、操作系统版本等信息上传到服务器
    NSDictionary *data = @{
                           @"disk": disData,
                           @"memory": memoryData,
                           @"cpu": cpuData,
                           @"system": systemData,
                           @"location": location,
                           @"macAddress": [systemData objectForKey:@"macAddress"],
                           @"osVersion":[systemData objectForKey:@"osVersion"],
                           @"model":[systemData objectForKey:@"model"],
                           @"power":[systemData objectForKey:@"power"],
                           @"name":[systemData objectForKey:@"name"],
                           @"disk_used":[disData objectForKey:@"disk_used"],
                           };
    NSDictionary* dic =@{
                         @"type": @"ios",
                         @"device_id":[systemData objectForKey:@"macAddress"],
                         @"data": [data JSONString],
                         };
    NSLog(@"%@",[@{
                   @"type": @"ios",
                   @"device_id":[systemData objectForKey:@"macAddress"],
                   @"data": data,
                   } JSONString]);
    [[NetWorkManger sharedManger] sendDataToServer:dic];
    [self statrTimer];

}

@end
