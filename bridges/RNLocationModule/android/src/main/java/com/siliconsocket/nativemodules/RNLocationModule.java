package com.siliconsocket.nativemodules;

import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNLocationModule extends ReactContextBaseJavaModule {

    Context con;

    public RNLocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        con = reactContext;
    }

    @Override
    public String getName() {
        return "RNLocationModule";
    }

    @ReactMethod
    public void statusCheck() {
        final LocationManager manager = (LocationManager) con.getSystemService(Context.LOCATION_SERVICE);

        if (!manager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            Log.i("jazzy", "Disabled");
            Intent intent1 = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            intent1.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            con.startActivity(intent1);
        }
    }
}
