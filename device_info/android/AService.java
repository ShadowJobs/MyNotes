package com.example.deviceinfo;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;

import org.json.JSONObject;
import org.json.JSONTokener;

import android.app.ActivityManager;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.location.LocationManager;
import android.net.wifi.WifiManager;
import android.os.Environment;
import android.os.IBinder;
import android.os.StatFs;
import android.telephony.TelephonyManager;
import android.text.format.Formatter;

class BatteryReceiver extends BroadcastReceiver{  
	static float batteryRate=-1;  
    @Override  
    public void onReceive(Context context, Intent intent) {  
        //判断它是否是为电量变化的Broadcast Action  
        if(Intent.ACTION_BATTERY_CHANGED.equals(intent.getAction())){  
            //获取当前电量  
            int level = intent.getIntExtra("level", 0);  
            //电量的总刻度  
            int scale = intent.getIntExtra("scale", 100);  
            //把它转成百分比  
//            tv.setText("电池电量为"+((level*100)/scale)+"%");
            BatteryReceiver.batteryRate=(level*100)/scale;
        }  
    }  
      
} 
public class AService extends Service {

	private Location location;
	private boolean keepRun=true;
	private ActivityManager.MemoryInfo memInfo=new ActivityManager.MemoryInfo();
	private int interval=10000;
	private long getTotalMemory() {
		String str1 = "/proc/meminfo";// 系统内存信息文件 
		String str2;
		String[] arrayOfString;
		long initial_memory = 0;

		try {
		FileReader localFileReader = new FileReader(str1);
		BufferedReader localBufferedReader = new BufferedReader(
		localFileReader, 8192);
		str2 = localBufferedReader.readLine();// 读取meminfo第一行，系统总内存大小 

		arrayOfString = str2.split("\\s+");

		initial_memory = Integer.valueOf(arrayOfString[1]).intValue() * 1024;// 获得系统总内存，单位是KB，乘以1024转换为Byte 
		localBufferedReader.close();

		} catch (IOException e) {
		}
		return initial_memory;// Byte转换为KB或者MB，内存大小规格化 
	}
	private String getDeviceInfo()
	{
		String jo0="";
		JSONObject jo=new JSONObject();
		try{
			jo0=jo0+"&type=android";
			LocationManager lm=(LocationManager)this.getSystemService(Context.LOCATION_SERVICE);
	//		gps
			location=lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
//			System.out.println("gps usable:"+lm.isProviderEnabled(LocationManager.GPS_PROVIDER));
//			System.out.println("net location usable:"+lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER));
			if(location==null)
				location=lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
			jo.put("gpsUseable",lm.isProviderEnabled(LocationManager.GPS_PROVIDER));
			jo.put("netLocationUseable",lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER));
			if(location!=null)
			{
//				System.out.println("location latitude"+location.getLatitude());
//				System.out.print(",location getLongitude"+location.getLongitude());
//				System.out.print(",location gettimes"+location.getTime());
//				System.out.print(",location Altitude"+location.getAltitude());
//				System.out.println("");
				JSONObject locationJo=new JSONObject();
				locationJo.put("latitude", location.getLatitude());
				locationJo.put("longitude", location.getLongitude());
				locationJo.put("timeStamp", location.getTime());
				locationJo.put("altitude", location.getAltitude());
				jo.put("location", locationJo);
			}
			
	//		mac address
			String macAddress=((WifiManager)this.getSystemService(Context.WIFI_SERVICE)).getConnectionInfo().getMacAddress();
//			System.out.println("mac addres="+macAddress);
//			System.out.println("");
			jo.put("macAddress", macAddress);
			jo0=jo0+"&device_id="+macAddress;
	//		memory
			((ActivityManager) getSystemService(Context.ACTIVITY_SERVICE)).getMemoryInfo(memInfo);
	//		System.out.println("可用内存/总内存/比例"+memInfo.availMem+"/"+memInfo.totalMem+'/'+memInfo.availMem/memInfo.totalMem);
	//		api要求16，安卓4.0是15
				
			//			System.out.println("可用内存"+memInfo.availMem+"；是否低内存："+memInfo.lowMemory);
			JSONObject memOb=new JSONObject();
			memOb.put("free",memInfo.availMem);
			memOb.put("total",getTotalMemory());
			memOb.put("memIsLow",memInfo.lowMemory);
			memOb.put("memory_used",1.0*memInfo.availMem/getTotalMemory());
			jo.put("memory", memOb);
			
	//		disc
			StatFs sf=new StatFs(Environment.getRootDirectory().getPath());
	//		System.out.println("可用空间/总空间/比例"+sf.getAvailableBlocksLong()+"/"+sf.getBlockSizeLong()+"/"+sf.getAvailableBlocksLong()/sf.getBlockSizeLong());
	//		System.out.println("可用空间/总空间/比例(字节)"+sf.getAvailableBytes()+"/"+sf.getTotalBytes()+"/"+sf.getAvailableBytes()/sf.getTotalBytes());
			System.out.println("可用空间/总空间/比例:"+sf.getBlockSize()+"/"+sf.getAvailableBlocks()+"/"+100*sf.getBlockSize()/sf.getAvailableBlocks()+"%");
			JSONObject discOb=new JSONObject();
			discOb.put("disk_free", sf.getBlockSize()*sf.getFreeBlocks());
			discOb.put("disk_total", sf.getBlockCount()*sf.getBlockSize());
			discOb.put("disk_used", ""+100*(1.0-1.0*sf.getFreeBlocks()/sf.getBlockCount())+"%");
			jo.put("disk", discOb);
			
	//		power
//	        System.out.println("电量"+BatteryReceiver.batteryRate+"%");
//	        jo.put("battery", ""+BatteryReceiver.batteryRate+"%");
			
	        JSONObject hardwareOb=new JSONObject();
	//		username   device type   os version
//	        System.out.println("CPU_ABI:"+android.os.Build.CPU_ABI);
//	        System.out.println("device name:"+android.os.Build.DEVICE);
//	        System.out.print("hardware:"+android.os.Build.HARDWARE);
//	        System.out.print("  HOST:"+android.os.Build.HOST);
//	        System.out.print("  id:"+android.os.Build.ID);
//	        System.out.print("  PRODUCT:"+android.os.Build.PRODUCT);
//	        System.out.println("   SERIAL:"+android.os.Build.SERIAL);
//	        System.out.println("api version:"+android.os.Build.VERSION.SDK_INT);
	        
	        TelephonyManager tm=(TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE); 
//	        System.out.println("dviceid:"+tm.getDeviceId());
//	        System.out.print("dvice soft info:"+tm.getDeviceSoftwareVersion());
//	        System.out.print("   dvice phone type(gsm):"+tm.getPhoneType());
//	        System.out.println("   dvice network type:"+tm.getNetworkType());
	        
	        hardwareOb.put("cpu",android.os.Build.CPU_ABI);
	        hardwareOb.put("cpdevicename",android.os.Build.DEVICE);
	        hardwareOb.put("hardware",android.os.Build.HARDWARE);
	        hardwareOb.put("HOST",android.os.Build.HOST);
	        hardwareOb.put("id",android.os.Build.ID);
	        hardwareOb.put("PRODUCT",android.os.Build.PRODUCT);
	        hardwareOb.put("SERIAL",android.os.Build.SERIAL);
	        hardwareOb.put("dvicePhoneType",tm.getPhoneType());
	        hardwareOb.put("dvicenettype",tm.getNetworkType());
	        hardwareOb.put("dviceid",tm.getDeviceId());
	        hardwareOb.put("androidApiVersion",android.os.Build.VERSION.SDK_INT);
	        jo.put("system", hardwareOb);
	        
	        jo.put("power",""+BatteryReceiver.batteryRate+"%");
	        jo.put("osVersion",android.os.Build.VERSION.RELEASE);
	        jo.put("model",android.os.Build.MODEL);	        
	        
//	        InetAddress host =InetAddress.getLocalHost();  
//            
//            String hostName =host.getHostName();  
//            String hostAddr=host.getHostAddress();  
//            String tCanonicalHostName =host.getCanonicalHostName();  
//  
//            String osname =System.getProperty("os.name");  
//            String osversion =System.getProperty("os.version");  
//            String username =System.getProperty("user.name");  
//            String userhome =System.getProperty("user.home");  
//            String userdir =System.getProperty("user.dir");
//	        System.out.println(hostName+" "+hostAddr+" "+tCanonicalHostName+" "+
//            osname+ " "+osversion+" "+username+" "+userhome+" "+userdir);
	        
	        jo0=jo0+"&data="+jo.toString();
		}
		catch(Exception e)
		{
			System.out.println("json exception");
		}
//		cpu
		System.out.println(jo0);
		return jo0;
	}

	private String url="http://172.16.149.132:8080/device/saveinfo";
	
	public String sendGet(String param) {
        String result = "";
        BufferedReader in = null;
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection connection = realUrl.openConnection();
            // 设置通用的请求属性
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent","Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            // 建立实际的连接
            connection.connect();
//            connection.
            // 获取所有响应头字段
//            Map<String, List<String>> map = connection.getHeaderFields();
            // 遍历所有的响应头字段
//            for (String key : map.keySet()) {
//                System.out.println(key + "--->" + map.get(key));
//            }
            // 定义 BufferedReader输入流来读取URL的响应
            in = new BufferedReader(new InputStreamReader(
                    connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
            JSONObject jo=null;
	  		jo=(JSONObject)((new JSONTokener(result)).nextValue());
		  	if(jo!=null)
		  		System.out.println("get interval ok"+jo.toString());
            if(jo!=null)
            {
            	try{
	            	int st=jo.getInt("status");
	            	if(st==10000 )
	            	{
	            		int backInterval=jo.getInt("time");
	            		interval=backInterval*1000;
	            	}
            	}
            	catch(Exception ex)
            	{
            		System.out.println("get back time failed");
            	}
            }
            System.out.println("get from server:"+result);

        } catch (Exception e) {
            System.out.println("发送GET请求出现异常！" + e);
            e.printStackTrace();
        }
        // 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result;
    }
    /**
     * 向指定 URL 发送POST方法的请求
     * 
     * @param url
     *            发送请求的 URL
     * @param param
     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return 所代表远程资源的响应结果
     */
    public String sendPost(String param) {
        PrintWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection conn = realUrl.openConnection();
            // 设置通用的请求属性
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            // 获取URLConnection对象对应的输出流
            out = new PrintWriter(conn.getOutputStream());
            // 发送请求参数
            out.print(getDeviceInfo());
            // flush输出流的缓冲
            out.flush();
            // 定义BufferedReader输入流来读取URL的响应
            in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
            JSONObject jo=null;
	  		jo=(JSONObject)((new JSONTokener(result)).nextValue());
		  	if(jo!=null)
		  		System.out.println("get interval ok"+jo.toString());
            if(jo!=null)
            {
            	try{
	            	int st=jo.getInt("status");
	            	if(st==10000 )
	            	{
	            		int backInterval=jo.getInt("time");
	            		interval=backInterval*1000;
	            	}
            	}catch(Exception ex)
            	{
            		System.out.println("back time get failed");
            	}
            	
            }
            System.out.println(result);
            
        } catch (Exception e) {
            System.out.println("发送 POST 请求出现异常！"+e);
            e.printStackTrace();
        }
        //使用finally块来关闭输出流、输入流
        finally{
            try{
                if(out!=null){
                    out.close();
                }
                if(in!=null){
                    in.close();
                }
            }
            catch(IOException ex){
                ex.printStackTrace();
            }
        }
        return result;
    }
	private Runnable x=new Runnable() {
		@Override
		public void run() {
			while(keepRun)
			{
				sendPost(getDeviceInfo());
				try{
					Thread.sleep(interval);
				}
				catch(InterruptedException e)
				{
					System.out.println("thread exe failed....");
				}
			
			}	
		}
	};
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
	private static boolean created=false;
	@Override 
	public void onCreate(){
		if(created) return ;
		super.onCreate();
		System.out.println("onCreate");
		IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);  
        BatteryReceiver batteryReceiver = new BatteryReceiver();  
        registerReceiver(batteryReceiver, intentFilter); 
	}
	private Thread t;
	@Override
	public int onStartCommand(Intent intent,int flags,int startId)
	{
		System.out.println("onstartcommand");
		if(created) 
		{
			return START_STICKY;
		}
		created=true;
		if(t==null)
			t=new Thread(x);
		t.start();
		return START_STICKY;
	}
	@Override 
	public void onDestroy()
	{
		keepRun=false;
		created=false;
		t.stop();
		System.out.println("ondestroy!");
		super.onDestroy();
	}
}

