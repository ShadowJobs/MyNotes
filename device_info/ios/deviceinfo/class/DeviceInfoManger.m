//
//  DeviceInfoManger.m
//  deviceinfo
//
//  Created by playcrab on 2/7/15.
//  Copyright (c) 2015年 deviceinfo. All rights reserved.
//

#import "DeviceInfoManger.h"
#include <sys/param.h>
#include <sys/mount.h>
#import <mach/mach.h>
#include <sys/sysctl.h>
#import <AdSupport/ASIdentifierManager.h>
//#import "IOPowerSources.h"
//#import "IOPSKeys.h"
@implementation DeviceInfoManger
@synthesize locationManger ;
@synthesize timer;
@synthesize latitude,longitude,altitude,timeStamp;
static DeviceInfoManger* _sharedManger;
+ (DeviceInfoManger*)sharedManger
{
    if (!_sharedManger) {
        _sharedManger = [[DeviceInfoManger alloc] init];
        if ([CLLocationManager locationServicesEnabled]) {
            
            CLLocationManager  *locationManager = [[CLLocationManager alloc] init];
            _sharedManger.locationManger = locationManager;
            locationManager.delegate = _sharedManger;
            
            locationManager.desiredAccuracy = kCLLocationAccuracyBest; //控制定位精度,越高耗电量越大。
            
            locationManager.distanceFilter = 100; //控制定位服务更新频率。单位是“米”
            [locationManager startUpdatingLocation];
            
//            if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)
//                [locationManager requestWhenInUseAuthorization];  //调用了这句,就会弹出允许框了.
            locationManager.desiredAccuracy = kCLLocationAccuracyBest;
            [locationManager startUpdatingLocation];
        }
        _sharedManger.timer = [NSTimer scheduledTimerWithTimeInterval:60.0 target:_sharedManger selector:@selector(updateTimer:) userInfo:nil repeats:YES];
        [_sharedManger.timer fire];
    }
    return _sharedManger;
}
#pragma mark -
#pragma mark SYSTEM
+ (NSDictionary*)getSystemInfor
{
    NSMutableDictionary * dic = [NSMutableDictionary dictionary];
    [dic setObject:[[DeviceInfoManger sharedManger] getSystemVersion] forKey:@"osVersion"];
    [dic setObject:[[DeviceInfoManger sharedManger] getSystemName] forKey:@"systemName"];
    [dic setObject:[[DeviceInfoManger sharedManger] getName] forKey:@"name"];
    [dic setObject:[[DeviceInfoManger sharedManger] getModel] forKey:@"model"];
    [dic setObject:[[DeviceInfoManger sharedManger] getIdentifierForVendor] forKey:@"uuid"];
    [dic setObject:[[DeviceInfoManger sharedManger] getMacAddress] forKey:@"macAddress"];
    [dic setObject:[[DeviceInfoManger sharedManger] getPower] forKey:@"power"];
//    [dic setObject:[[DeviceInfoManger sharedManger] getLocation] forKey:@"location"];

    return  dic;
}
#pragma mark -
#pragma mark DISK
+ (NSDictionary *) getDiskSpaceInfor{
    struct statfs buf;
    long long freespace = -1;
    long long totalSpace = -1;
    long long usedSpace = -1;
    if(statfs("/var", &buf) >= 0){
        freespace = (long long)(buf.f_bsize * buf.f_bfree);
        totalSpace = (long long)(buf.f_bsize * buf.f_blocks);
        usedSpace = totalSpace-freespace;
    }
//    double disk_free = freespace/1024/1024;//M
//    double disk_total = totalSpace/1024/1024;//M
    double disk_used = usedSpace*100/(double)totalSpace;
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setObject:[NSNumber numberWithLongLong:freespace] forKey:@"disk_free"];//可用
    [dic setObject:[NSNumber numberWithLongLong:totalSpace] forKey:@"disk_total"];//容量
    [dic setObject:[NSString stringWithFormat:@"%2.2lf%%",disk_used] forKey:@"disk_used"];//容量
    return dic;
}
#pragma mark -
#pragma mark MEMORY
/*
    free是空闲内存;
    active是已使用，但可被分页的(在iOS中，只有在磁盘上静态存在的才能被分页，例如文件的内存映射，而动态分配的内存是不能被分页的);
    inactive是不活跃的，实际上内存不足时，你的应用就可以抢占这部分内存，因此也可看作空闲内存;
    wire就是已使用，且不可被分页的。
 */
+ (NSDictionary *) getMemoryInfor
{
    NSMutableDictionary* dic = [[NSMutableDictionary alloc] init];
    vm_statistics_data_t vmStats;
    mach_msg_type_number_t infoCount = HOST_VM_INFO_COUNT;
    kern_return_t kernReturn = host_statistics(mach_host_self(),
                                               HOST_VM_INFO,
                                               (host_info_t)&vmStats,
                                               &infoCount);
    double total = (NSRealMemoryAvailable());///1024/1024;
    [dic setObject:[NSNumber numberWithDouble:total] forKey:@"total"];

    if (kernReturn == KERN_SUCCESS) {
//        double free =((vm_page_size *vmStats.free_count) / 1024.0) / 1024.0;//空闲内存
//        double active =((vm_page_size *vmStats.active_count) / 1024.0) / 1024.0;//已使用可分页
//        double inactive =((vm_page_size *vmStats.inactive_count) / 1024.0) / 1024.0;//不活跃（可回收）
//        double wire =((vm_page_size *vmStats.wire_count) / 1024.0) / 1024.0;//已使用不可分页
        
        long long free =(vm_page_size *vmStats.free_count);//空闲内存
        long long active =(vm_page_size *vmStats.active_count);//已使用可分页
        long long inactive =(vm_page_size *vmStats.inactive_count) ;//不活跃（可回收）
        long long wire =(vm_page_size *vmStats.wire_count);//已使用不可分页
        
        [dic setObject:[NSNumber numberWithLongLong:free] forKey:@"free"];
        [dic setObject:[NSNumber numberWithLongLong:active] forKey:@"active"];
        [dic setObject:[NSNumber numberWithLongLong:inactive] forKey:@"inactive"];
        [dic setObject:[NSNumber numberWithLongLong:wire] forKey:@"wire"];
        double memory_used = 100*(free+inactive)/total;
        [dic setObject:[NSString stringWithFormat:@"%2.2lf%%",memory_used] forKey:@"memory_used"];

    }
    //can use NSProcessInfo
    //    [[NSProcessInfo processInfo] physicalMemory];

    return  dic;
}
#pragma mark -
#pragma mark CPU
+ (NSDictionary *) getCpuInfo
{
    NSMutableDictionary* dic = [[NSMutableDictionary alloc] init];
    float cpu = [[DeviceInfoManger sharedManger] cpu_usage];
    [dic setObject:[NSString stringWithFormat:@"%2.2f%%",cpu] forKey:@"cpu_used"];
    return  dic;
}
//cpu
-(float) cpu_usage
{
    kern_return_t kr;
    task_info_data_t tinfo;
    mach_msg_type_number_t task_info_count;
    
    task_info_count = TASK_INFO_MAX;
    kr = task_info(mach_task_self(), TASK_BASIC_INFO, (task_info_t)tinfo, &task_info_count);
    if (kr != KERN_SUCCESS) {
        return -1;
    }
    
    task_basic_info_t      basic_info;
    thread_array_t         thread_list;
    mach_msg_type_number_t thread_count;
    
    thread_info_data_t     thinfo;
    mach_msg_type_number_t thread_info_count;
    
    thread_basic_info_t basic_info_th;
    uint32_t stat_thread = 0; // Mach threads
    
    basic_info = (task_basic_info_t)tinfo;
    
    // get threads in the task
    kr = task_threads(mach_task_self(), &thread_list, &thread_count);
    if (kr != KERN_SUCCESS) {
        return -1;
    }
    if (thread_count > 0)
        stat_thread += thread_count;
    
    long tot_sec = 0;
    long tot_usec = 0;
    float tot_cpu = 0;
    int j;
    
    for (j = 0; j < thread_count; j++)
    {
        thread_info_count = THREAD_INFO_MAX;
        kr = thread_info(thread_list[j], THREAD_BASIC_INFO,
                         (thread_info_t)thinfo, &thread_info_count);
        if (kr != KERN_SUCCESS) {
            return -1;
        }
        
        basic_info_th = (thread_basic_info_t)thinfo;
        
        if (!(basic_info_th->flags & TH_FLAGS_IDLE)) {
            tot_sec = tot_sec + basic_info_th->user_time.seconds + basic_info_th->system_time.seconds;
            tot_usec = tot_usec + basic_info_th->system_time.microseconds + basic_info_th->system_time.microseconds;
            tot_cpu = tot_cpu + basic_info_th->cpu_usage / (float)TH_USAGE_SCALE * 100.0;
        }
        
    } // for each thread
    
    kr = vm_deallocate(mach_task_self(), (vm_offset_t)thread_list, thread_count * sizeof(thread_t));
    assert(kr == KERN_SUCCESS);
    return tot_cpu;
}
#pragma mark -
#pragma Location
+ (NSDictionary*) getLocation
{
    return @{@"latitude": [NSNumber numberWithDouble:[DeviceInfoManger sharedManger].latitude],
             @"longitude":[NSNumber numberWithDouble:[DeviceInfoManger sharedManger].longitude],
             @"altitude":[NSNumber numberWithDouble:[DeviceInfoManger sharedManger].altitude],
             @"timeStamp":[NSNumber numberWithDouble:[DeviceInfoManger sharedManger].timeStamp]
             };
}
#pragma mark -
- (NSString*)getSystemVersion //e.g. @"4.0"
{
    return [[UIDevice currentDevice] systemVersion] ;
}
- (NSString*)getSystemName//e.g. iOS
{
    return [[UIDevice currentDevice] systemName] ;
}
- (NSString*)getName//e.g. "My iPhone"
{
    return [[UIDevice currentDevice] name] ;
}
- (NSString*)getModel//e.g. @"iPhone"
{
    return [[UIDevice currentDevice] model] ;
}
- (NSString*)getIdentifierForVendor//same across apps from a single vendor
{
    return [[[UIDevice currentDevice] identifierForVendor] UUIDString] ;
}
- (NSString*)getMacAddress//all app have same advertisingIdentifier
{
    return [[ASIdentifierManager sharedManager].advertisingIdentifier UUIDString];
}
//- (NSNumber*)getPower
//{
//    //Returns a blob of Power Source information in an opaque CFTypeRef.
//    CFTypeRef blob = IOPSCopyPowerSourcesInfo();
//    
//    //Returns a CFArray of Power Source handles, each of type CFTypeRef.
//    CFArrayRef sources = IOPSCopyPowerSourcesList(blob);
//    
//    CFDictionaryRef pSource = NULL;
//    const void *psValue;
//    
//    //Returns the number of values currently in an array.
//    int numOfSources = CFArrayGetCount(sources);
//    
//    //Error in CFArrayGetCount
//    if (numOfSources == 0)
//    {
//        NSLog(@"Error in CFArrayGetCount");
//        return [NSNumber numberWithFloat:-1.0f];
//    }
//    
//    //Calculating the remaining energy
//    for (int i = 0 ; i < numOfSources ; i++)
//    {
//        //Returns a CFDictionary with readable information about the specific power source.
//        pSource = IOPSGetPowerSourceDescription(blob, CFArrayGetValueAtIndex(sources, i));
//        if (!pSource)
//        {
//            NSLog(@"Error in IOPSGetPowerSourceDescription");
//            return [NSNumber numberWithFloat:-1.0f];
//        }
//        psValue = (CFStringRef)CFDictionaryGetValue(pSource, CFSTR(kIOPSNameKey));
//        
//        int curCapacity = 0;
//        int maxCapacity = 0;
//        double percent;
//        
//        psValue = CFDictionaryGetValue(pSource, CFSTR(kIOPSCurrentCapacityKey));
//        CFNumberGetValue((CFNumberRef)psValue, kCFNumberSInt32Type, &curCapacity);
//        
//        psValue = CFDictionaryGetValue(pSource, CFSTR(kIOPSMaxCapacityKey));
//        CFNumberGetValue((CFNumberRef)psValue, kCFNumberSInt32Type, &maxCapacity);
//        
//        percent = ((double)curCapacity/(double)maxCapacity * 100.0f);
//        
//        return [NSNumber numberWithFloat:percent];
//    }
//    return [NSNumber numberWithFloat:-1.0f];
//}
- (NSString*)getPower
{
    [UIDevice currentDevice].batteryMonitoringEnabled = YES;
    double deviceLevel = [UIDevice currentDevice].batteryLevel;
    return [NSString stringWithFormat:@"%2.2f%%",deviceLevel*100];
}
- (void)locationManager:(CLLocationManager *)manager
	 didUpdateLocations:(NSArray *)locations
{
    CLLocation * currLocation = [locations lastObject];
    self.latitude = currLocation.coordinate.latitude;
    self.longitude = currLocation.coordinate.longitude;
    self.altitude = currLocation.altitude;
    self.timeStamp = [[[NSDate alloc] init] timeIntervalSinceNow];
}
- (void) updateTimer:(id)data
{

}
@end
