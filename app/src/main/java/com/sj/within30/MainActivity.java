package com.sj.within30;

import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.net.http.SslError;
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

import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    MainActivity self;
    WebView myBrowser;
    GPSTracker gps;
    static LayoutInflater inflater;
    double latitude = 0, longitude = 0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        gps = new GPSTracker(MainActivity.this, this);
        self = this;
        if(gps.canGetLocation()){

            latitude = gps.getLatitude();
            longitude = gps.getLongitude();
            Log.d("latlong ", latitude + "--" + longitude);
            Toast.makeText(getApplicationContext(), "Your Location is - \nLat: " + latitude + "\nLong: " + longitude, Toast.LENGTH_LONG).show();
        }else{
            gps.showSettingsAlert();
        }
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
        latitude = gps.getLatitude();
        longitude = gps.getLongitude();
        myBrowser.loadUrl("javascript:app.changeCenter(" + latitude + "," + longitude + ")");
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
                    //SharedStorage.saveN(data.get('notifications'));
                }
            } catch (Exception ex) {}
        }
    }
}
