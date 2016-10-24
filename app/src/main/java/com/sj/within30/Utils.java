package com.sj.within30;

import android.util.Log;

import org.json.JSONObject;

/**
 * Created by Immanuel Raj on 10/24/2016.
 */
public class Utils {
    public static JSONObject transformJson(String json){
        JSONObject obj = null;
        try {
            obj = new JSONObject(json);
            Log.d("W30", obj.toString());
        } catch (Throwable t) {
            Log.e("W30", "Could not parse malformed JSON: \"" + json + "\"");
        }
        return obj;
    }
}
