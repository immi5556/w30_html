package com.sj.within30;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

/**
 * Created by Immanuel Raj on 10/24/2016.
 */
public class SharedStorage {
    public static SharedPreferences sharedPfrs = null;
    public static Context appContext;
    public static String file_name = "within30";

    static SharedPreferences getSahredPrefs() {
        if (sharedPfrs == null) {
            sharedPfrs = appContext.getSharedPreferences(file_name,Context.MODE_PRIVATE);
        }
        return  sharedPfrs;
    }

    static void saveValues(String key, String value) {
        sharedPfrs = getSahredPrefs();
        SharedPreferences.Editor editor = sharedPfrs.edit();
        editor.putString(key, value);
        editor.commit();
    }

    static String getValue(String key) {
        sharedPfrs = getSahredPrefs();
        return sharedPfrs.getString(key, "");
    }

    public static void saveFirstName(String value) {
        saveValues("FirstName", value);
    }

    public static String getFirstName() {
        return getValue("FirstName");
    }

    public static void saveLastName(String value) {
        saveValues("LastName", value);
    }

    public static String getLastName() {
        return getValue("LastName");
    }

    public static void saveEmail(String value) {
        saveValues("Email", value);
    }

    public static String getEmail() {
        return getValue("Email");
    }

    public static void saveMobile(String value) {
        saveValues("MobileNo", value);
    }

    public static String getMobile() {
        return getValue("MobileNo");
    }
}
