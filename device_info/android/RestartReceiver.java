package com.example.deviceinfo;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class RestartReceiver extends BroadcastReceiver {
	static final String ACTION = "android.intent.action.BOOT_COMPLETED";
	@Override
	public void onReceive(Context context, Intent intent) {
//		if(
//		{
			System.out.println("rrrrrrrrrrrrreceiver run:intent action="+intent.getAction());
			Intent sayHelloIntent=new Intent(context,AService.class);    
	 	    context.startService(sayHelloIntent);

//			Intent mainac=new Intent(context,MainActivity.class);
//			mainac.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);    
//	 	    context.startActivity(mainac); 
//			NotificationManager nm=(NotificationManager)context.getSystemService(context.NOTIFICATION_SERVICE);
//			Notification noti = new Notification.Builder(context)
//	         .setContentTitle("start deviceinfo")
//	         .setContentText("start deviceinfo")
//	         .setSmallIcon(R.drawable.ic_launcher)
//	         .getNotification();
//			nm.notify(getResultCode(), noti);
//			Intent.action
//		}
	}

}


