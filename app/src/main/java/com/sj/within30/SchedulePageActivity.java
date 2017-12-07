package com.sj.within30;

import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.telephony.TelephonyManager;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONObject;

public class SchedulePageActivity extends AppCompatActivity {
    SchedulePageActivity self;
    WebView myBrowserView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_schedule_page);
        self = this;
        Intent intent = getIntent();
        String link = intent.getStringExtra("link");
        myBrowserView = (WebView)findViewById(R.id.mybrowserview);
        myBrowserView.getSettings().setJavaScriptEnabled(true);
        int currentapiVersion = android.os.Build.VERSION.SDK_INT;
        if (currentapiVersion >= android.os.Build.VERSION_CODES.JELLY_BEAN){
            fixNewAndroid(myBrowserView);
        }
        myBrowserView.addJavascriptInterface(new AndroidBridge(self), "andapp");
        myBrowserView.setWebChromeClient(new MyJavaScriptChromeClient());

        myBrowserView.setWebViewClient(new WebViewClient() {
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
                return super.shouldOverrideUrlLoading(view, url);
            }
        });
        myBrowserView.loadUrl(link);
    }

    @TargetApi(16)
    protected void fixNewAndroid(WebView webView) {
        try {
            webView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        } catch(NullPointerException e) {
        }
    }

    private class MyJavaScriptChromeClient extends WebChromeClient {
        @Override
        public boolean onJsAlert(WebView view, String url, String message,final JsResult result) {
            new AlertDialog.Builder(SchedulePageActivity.this)
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
    }

    private String isNetworkConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        return cm.getActiveNetworkInfo() != null ? "true": "false";
    }

    public class AndroidBridge {

        private SchedulePageActivity activity;

        public AndroidBridge(SchedulePageActivity activity) {
            this.activity = activity;
        }

        @JavascriptInterface
        public String checkInternet(){
            return isNetworkConnected();
        }

        @JavascriptInterface
        public void loadLocalFile(){
            myBrowserView.post(new Runnable() {
                @Override
                public void run() {
                    myBrowserView.loadUrl("file:///android_asset/index.html");
                }
            });
        }

        @JavascriptInterface
        public void saveLatestURL(String url) {
            try {
                SharedStorage.saveLatestURL(url);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getLatestURL() {
            try {
                return SharedStorage.getLatestURL();
            } catch (Exception ex) {}
            return  null;
        }

        @JavascriptInterface
        public void saveSubdomain(String subdomain) {
            try {
                SharedStorage.saveSubdomain(subdomain);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getSubdomain() {
            try {
                return SharedStorage.getSubdomain();
            } catch (Exception ex) {}
            return  null;
        }

        @JavascriptInterface
        public void saveEndUserSubdomain(String subdomain) {
            try {
                SharedStorage.saveEndUserSubdomain(subdomain);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getEndUserSubdomain() {
            try {
                return SharedStorage.getEndUserSubdomain();
            } catch (Exception ex) {}
            return  null;
        }

        @JavascriptInterface
        public void saveAdminState(String state) {
            try {
                SharedStorage.saveAdminState(state);
            } catch (Exception ex) {}
        }

        @JavascriptInterface
        public String getAdminState() {
            try {
                System.out.println(SharedStorage.getAdminState());
                return SharedStorage.getAdminState();
            } catch (Exception ex) {}
            return  null;
        }

    }

    @Override
    public void onBackPressed() {
        try{
            finish();
        }
        catch (android.content.ActivityNotFoundException ex){
            Toast.makeText(getApplicationContext(),"yourActivity is not founded",Toast.LENGTH_SHORT).show();
        }
    }
}
