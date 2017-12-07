package com.sj.within30;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

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

    public static void saveUserId(String value) {
        saveValues("UserId", value);
    }

    public static String getUserId() { return getValue("UserId");  }

    public static void saveLocationType(String value) {
        saveValues("CurrentLocation", value);
    }

    public static String getLocationType() { return getValue("CurrentLocation");  }

    public static void storeRecentLocation(String value) { saveValues("SearchedLocation", value); }

    public static String getStoredRecentLocation() { return getValue("SearchedLocation");  }

    public static void saveCustomeLat(String value) { saveValues("Latitude", value); }

    public static String getCustomeLat() { return getValue("Latitude");  }

    public static void saveCustomeLong(String value) { saveValues("Longitude", value); }

    public static String getCustomeLong() { return getValue("Longitude");  }

    public static void saveServiceId(String value) { saveValues("ServiceId", value); }

    public static String getServiceId() { return getValue("ServiceId");  }

    public static void saveDeviceToken(String value) { saveValues("DeviceToken", value); }

    public static String getDeviceToken() { return getValue("DeviceToken");  }

    public static void saveOverlayState(String value) { saveValues("Overlay", value); }

    public static String getOverlayState() { return getValue("Overlay");  }

    public static void saveCountryName(String value) { saveValues("Country", value); }

    public static String getCountryName() { return getValue("Country");  }

    public static void saveSubdomain(String value) { saveValues("Subdomain", value); }

    public static String getSubdomain() { return getValue("Subdomain");  }

    public static void saveEndUserSubdomain(String value) { saveValues("EndUserSubdomain", value); }

    public static String getEndUserSubdomain() { return getValue("EndUserSubdomain");  }


    public static void saveAdminState(String value) { saveValues("AdminLogin", value); }

    public static String getAdminState() { return getValue("AdminLogin");  }

    public static void saveLatestURL(String value) { saveValues("LatestURL", value); }

    public static String getLatestURL() { return getValue("LatestURL");  }

}
