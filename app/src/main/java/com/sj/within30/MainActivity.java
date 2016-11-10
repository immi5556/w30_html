package com.sj.within30;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.location.Location;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import com.google.android.gms.location.LocationRequest;
import com.sj.within30.location.LocationManagerInterface;
import com.sj.within30.location.MyLocationManager;

import org.json.JSONObject;

public class MainActivity extends AppCompatActivity implements LocationManagerInterface {
    MainActivity self;
    WebView myBrowser;
    static LayoutInflater inflater;
    double latitude = 0, longitude = 0;
    Boolean updateLatLong = true;
    //Location
    public MyLocationManager mLocationManager;
    private static final int REQUEST_FINE_LOCATION = 1;
    private static  final int CALL_REQUEST1 = 5;
    private Activity mCurrentActivity;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        self = this;
        myBrowser = (WebView)findViewById(R.id.mybrowser);
        myBrowser.getSettings().setJavaScriptEnabled(true);
        int currentapiVersion = android.os.Build.VERSION.SDK_INT;
        if (currentapiVersion >= android.os.Build.VERSION_CODES.JELLY_BEAN){
            fixNewAndroid(myBrowser);
        }
        myBrowser.addJavascriptInterface(new AndroidBridge(self), "andapp");
        myBrowser.setWebChromeClient(new MyJavaScriptChromeClient());

        myBrowser.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // TODO Auto-generated method stub
                Log.d("W30", "URL is. ... " + url);
                if (url.startsWith("tel:")) {
                    Intent intent = new Intent(Intent.ACTION_DIAL,
                            Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
                return super.shouldOverrideUrlLoading(view, url);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed();
            }
        });

        SharedStorage.appContext = this;
        if (SharedStorage.getFirstName() == null || SharedStorage.getFirstName() == ""){
            myBrowser.loadUrl("file:///android_asset/index.html");
        } else {
            myBrowser.loadUrl("file:///android_asset/selectCatagory.html");
        }
    }

    @TargetApi(16)
    protected void fixNewAndroid(WebView webView) {
        try {
            webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        } catch(NullPointerException e) {
        }
    }

    public void refreshLocation() {
       /* latitude = gps.getLatitude();
        longitude = gps.getLongitude();
        myBrowser.loadUrl("javascript:app.changeCenter(" + latitude + "," + longitude + ")");*/
    }

    private void checkReadPhoneStatePermissions(String number) {
        try {

            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M){
                Intent in=new Intent(Intent.ACTION_CALL,Uri.parse("tel:"+number));
                try{
                    startActivity(in);
                } catch (android.content.ActivityNotFoundException ex){
                    Toast.makeText(getApplicationContext(),"yourActivity is not founded",Toast.LENGTH_SHORT).show();
                }
            }
            //do call
            else {

                if (ContextCompat.checkSelfPermission(MainActivity.this,android.Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(MainActivity.this, new String[]{android.Manifest.permission.CALL_PHONE}, CALL_REQUEST1);
                } else {
                    Intent in=new Intent(Intent.ACTION_CALL,Uri.parse("tel:"+number));
                    try{
                        startActivity(in);
                    } catch (android.content.ActivityNotFoundException ex){
                        Toast.makeText(getApplicationContext(),"yourActivity is not founded",Toast.LENGTH_SHORT).show();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public void locationFetched(Location mLocation, Location oldLocation, String time, String locationProvider) {
        if(updateLatLong) {
            Log.d("latitude--",""+mLocation.getLatitude());
            Log.d("longitude--",""+mLocation.getLongitude());
            latitude = mLocation.getLatitude();
            longitude = mLocation.getLongitude();
            updateLatLong = false;
        }
    }

    private class MyJavaScriptChromeClient extends WebChromeClient {
        @Override
        public boolean onJsAlert(WebView view, String url, String message,final JsResult result) {
            new AlertDialog.Builder(MainActivity.this)
                    .setTitle("Alert: Within 30")
                    .setMessage(message)
                    .setPositiveButton(android.R.string.ok,
                            new AlertDialog.OnClickListener() {
                                public void onClick(DialogInterface dialog, int which) {
                                    // do your stuff
                                    result.confirm();
                                }
                            }).setCancelable(false).create().show();
            return true;
        }

        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            Log.d("W30", view.getUrl() + " -- " + newProgress);
        }

        @Override
        public void onReceivedTitle(WebView view, String title) {
            super.onReceivedTitle(view, title);
            myBrowser.loadUrl("javascript:app.setMap(" + latitude + "," + longitude + ");");
            myBrowser.loadUrl("javascript:app.getChurches();");
        }
    }

    public class AndroidBridge {

        private MainActivity activity;

        public AndroidBridge(MainActivity activity) {
            this.activity = activity;
        }

        @JavascriptInterface
        public void postJson(String action, String jsonData) {
            try {
                JSONObject data = Utils.transformJson(jsonData);
                if (action.equalsIgnoreCase("persistuser")){
                    SharedStorage.saveFirstName(data.getString("firstname"));
                    SharedStorage.saveLastName(data.getString("lastname"));
                    SharedStorage.saveEmail(data.getString("email"));
                    SharedStorage.saveMobile(data.getString("mobilenumber"));
                    SharedStorage.saveUserId(data.getString("_id"));
                    //SharedStorage.saveN(data.get('notifications'));
                }
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public void postLocationType(String action, String jsonData) {
            try {
                JSONObject data = Utils.transformJson(jsonData);
                if (action.equalsIgnoreCase("persistuser")){
                    SharedStorage.saveLocationType(data.getString("currentLocation"));
                }
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public void saveLocationType(String value) {
            try {
                Log.d("loc type", value);
                SharedStorage.saveLocationType(value);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getLocationType() {
            try {
                return SharedStorage.getLocationType();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public void saveCustomeLat(String value) {
            try {
                Log.d("loc type", value);
                SharedStorage.saveCustomeLat(value);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getCustomeLat() {
            try {
                return SharedStorage.getCustomeLat();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public void saveCustomeLong(String value) {
            try {
                Log.d("loc type", value);
                SharedStorage.saveCustomeLong(value);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getCustomeLong() {
            try {
                return SharedStorage.getCustomeLong();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public void saveServiceId(String value) {
            try {
                SharedStorage.saveServiceId(value);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getServiceId() {
            try {
                return SharedStorage.getServiceId();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public String getLatitude() {
            try {
                Log.d("lat method", latitude+"");
                return latitude+"";
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public String getLongitude() {
            try {
                return longitude+"";
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public String getFirstname() {
            try {
                return SharedStorage.getFirstName();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public String getEmail() {
            try {
                return SharedStorage.getEmail();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public String getMobile() {
            try {
                return SharedStorage.getMobile();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public String getLastname() {
            try {
                return SharedStorage.getLastName();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public String getUserId() {
            try {
                return SharedStorage.getUserId();
            } catch (Exception ex) {}
            return null;
        }

        @JavascriptInterface
        public void saveRecentLocation(String value) {
            try {
                Log.d("recent ", value);
                SharedStorage.storeRecentLocation(value);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getRecentLocation() {
            try {
                return SharedStorage.getStoredRecentLocation();
            } catch (Exception ex) {}
            return  null;
        }

        @JavascriptInterface
        public void updateLatLong(String lat, String longi) {
            try {
                latitude = Double.parseDouble(lat);
                longitude = Double.parseDouble(longi);
                Log.d("latitude-##-",""+latitude);
                Log.d("longitude-##-",""+longitude);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public void showToast(String msg) {
            try {
                Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_LONG).show();
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public void updateCurrentLocation() {
            try {
                initLocationFetching(MainActivity.this);
                updateLatLong = true;
                Log.d("lat, long", latitude+","+longitude);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public void phoneCall(String number) {
            Log.d("phone call", number);
            checkReadPhoneStatePermissions(number);
        }

        @JavascriptInterface
        public void openLink(String link) {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(link));
            try{
                startActivity(browserIntent);
            }

            catch (android.content.ActivityNotFoundException ex){
                Toast.makeText(getApplicationContext(),"yourActivity is not founded",Toast.LENGTH_SHORT).show();
            }
        }


        @JavascriptInterface
        public void closeApp() {
            System.exit(0);
        }
    }

    @Override
    public void onStop() {
        super.onStop();

        if (mLocationManager != null)
            mLocationManager.abortLocationFetching();
    }

    @Override
    public void onResume() {
        super.onResume(); //is in foreground
        myBrowser.loadUrl("javascript:refreshOnForeground()");
    }
    @Override
    protected void onPause() {
        super.onPause();
        if (mLocationManager != null)
            mLocationManager.pauseLocationFetching();

    }

    @Override
    public void onStart() {
        super.onStart();
        if (mLocationManager != null) {

            mLocationManager.startLocationFetching();
        }
        else{
            initLocationFetching(MainActivity.this);
        }

    }

    @Override
    public void onBackPressed() {
        myBrowser.loadUrl("javascript:goBack()");
    }

    public void initLocationFetching(Activity mActivity) {

        mCurrentActivity = mActivity;
        // ask permission for M
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            showLocationPermission();
        } else {
            mLocationManager = new MyLocationManager(getApplicationContext(), mActivity, this, MyLocationManager.ALL_PROVIDERS, LocationRequest.PRIORITY_HIGH_ACCURACY, 10 * 1000, 1 * 1000, MyLocationManager.LOCATION_PROVIDER_RESTRICTION_NONE); // init location manager

        }
    }
    private void showLocationPermission() {
        int permissionCheck = ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION);

        if (permissionCheck != PackageManager.PERMISSION_GRANTED) {

            if (ActivityCompat.shouldShowRequestPermissionRationale(mCurrentActivity, Manifest.permission.ACCESS_FINE_LOCATION)) {

                requestPermission(Manifest.permission.ACCESS_FINE_LOCATION, REQUEST_FINE_LOCATION);
            } else {
                requestPermission(Manifest.permission.ACCESS_FINE_LOCATION, REQUEST_FINE_LOCATION);
            }
        } else {
            mLocationManager = new MyLocationManager(getApplicationContext(), mCurrentActivity, this, MyLocationManager.ALL_PROVIDERS, LocationRequest.PRIORITY_HIGH_ACCURACY, 10 * 1000, 1 * 1000, MyLocationManager.LOCATION_PROVIDER_RESTRICTION_NONE); // init location manager
        }
    }



    private void requestPermission(String permissionName, int permissionRequestCode) {
        ActivityCompat.requestPermissions(mCurrentActivity, new String[]{permissionName}, permissionRequestCode);
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String permissions[],
            int[] grantResults) {


        switch (requestCode) {
            case REQUEST_FINE_LOCATION:
                int permissionCheck = ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION);
                if (permissionCheck== PackageManager.PERMISSION_GRANTED)
                {

                    mLocationManager = new MyLocationManager(getApplicationContext(), this, this, MyLocationManager.ALL_PROVIDERS, LocationRequest.PRIORITY_HIGH_ACCURACY, 10 * 1000, 1 * 1000, MyLocationManager.LOCATION_PROVIDER_RESTRICTION_NONE);
                    // init location manager
                    mLocationManager.startLocationFetching();
                    //permission granted here
                }
        }
    }
}
