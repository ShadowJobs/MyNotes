//
//  DeviceInfoManger.h
//  deviceinfo
//
//  Created by playcrab on 2/7/15.
//  Copyright (c) 2015年 deviceinfo. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

@interface DeviceInfoManger : NSObject <CLLocationManagerDelegate>
@property (nonatomic,strong) CLLocationManager* locationManger;
@property (nonatomic,assign) double latitude;//维度
@property (nonatomic,assign) double longitude;//经度
@property (nonatomic,assign) double altitude;
@property (nonatomic,assign) NSTimeInterval timeStamp;

@property (nonatomic,strong) NSTimer* timer;
+ (DeviceInfoManger*)sharedManger;
+ (NSDictionary*)getSystemInfor;
+ (NSDictionary*)getDiskSpaceInfor;//e.g
+ (NSDictionary*)getMemoryInfor;//e.g
+ (NSDictionary *) getCpuInfo;
+ (NSDictionary*) getLocation;
- (void)locationManager:(CLLocationManager *)manager
	 didUpdateLocations:(NSArray *)locations;
@end
