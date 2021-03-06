if(window.andapp){
    window.andapp.saveLatestURL("selectCatagory.html");
}
var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.within30.com/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;
var searchedLat, searchedLong;
var cities = [];
var services = [];
var serviceId = "";
var locationType;
var recentSearch;
var currentLocationName, gotUserLocation, customeLocationName;
var country = "";

var successFunction = function(){
    if(recentSearch && locationType == "false"){
        $("#pac-input").val(recentSearch);
        $('body').removeClass('bodyload');
        currentLocationName = recentSearch;
        if(recentSearch.indexOf("India") != -1){
            $(".categoryItem4 .cirleIcon").removeClass("attrny");
            $(".categoryItem4 .specName").text("Photography");
            $(".categoryItem4 img").attr("src", "assets/img/catagory-camera1.png");
        } else {
            $(".categoryItem4 .cirleIcon").addClass("attrny");
            $(".categoryItem4 .specName").text("Attorneys");
            $(".categoryItem4 img").attr("src", "assets/img/attorney.png");
        }
    }else
        getLocation(latitude, longitude);
}
var errorFunction = function(){
    if(window.andapp.checkInternet() != "true"){
	    window.andapp.saveLatestURL("selectCatagory.html");
		window.andapp.loadLocalFile();
	}else{
    	$(".popContent h2").text("Get Location");
        $(".popContent span").text("");
        $(".popContent strong").text("Not able to retrieve your location. Check location settings.");
        $(".pop_up").show();
	}
}

function getLocation(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({latLng: latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        var arrAddress = results;
        if(arrAddress && arrAddress[0].address_components){
            $.each(arrAddress[0].address_components, function(i, address_component){
                if (address_component.types[0] == "political" || address_component.types[0] == "locality") {
                    $("#pac-input").val(address_component.long_name);
                    $('body').removeClass('bodyload');
                    if(gotUserLocation)
                        currentLocationName = address_component.long_name;
                    else
                        currentLocationName = null;
                }
                if (address_component.types[0] == "country") {
                    country = address_component.long_name;
                    window.andapp.saveCountryName(country);
                }
            });
            if(country == "India"){
                $(".categoryItem4 .cirleIcon").removeClass("attrny");
                $(".categoryItem4 .specName").text("Photography");
                $(".categoryItem4 img").attr("src", "assets/img/catagory-camera1.png");
            } else {
                $(".categoryItem4 .cirleIcon").addClass("attrny");
                $(".categoryItem4 .specName").text("Attorneys");
                $(".categoryItem4 img").attr("src", "assets/img/attorney.png");
            }
        }
        if($("#pac-input").val().length == 0){
            $(".popContent h2").text("Get Location");
            $(".popContent span").text("");
            $(".popContent strong").text("Not able to get your locality name");
            $(".pop_up").show();
        }
        $('body').removeClass('bodyload');
      } else {
        $(".popContent h2").text("Get Location");
        $(".popContent span").text("");
        $(".popContent strong").text("Not able to get your location. Please restart the app.");
        $(".pop_up").show();
        $('body').removeClass('bodyload');
      }
    } else {
        $(".popContent h2").text("Get Location");
        $(".popContent span").text("");
        $(".popContent strong").text("Not able to get your location. Please restart the app.");
        $(".pop_up").show();
    }
  });
}

var startFunc = function(){
    if (window.andapp){
        latitude = window.andapp.getLatitude();
        longitude = window.andapp.getLongitude();
        locationType = window.andapp.getLocationType();
        if(!locationType || locationType == "false"){
            gotUserLocation = false;
            if (window.andapp){
                recentSearch = window.andapp.getRecentLocation();
                if(recentSearch){
                    latitude = window.andapp.getCustomeLat();
                    longitude = window.andapp.getCustomeLong();
                    searchedLat = latitude;
                    searchedLong = longitude;
                    successFunction();
                }else{
                    errorFunction();
                }

            }
        }else{
            if(!latitude && !longitude){
                gotUserLocation = false;
                errorFunction();
            }else{
                gotUserLocation = true;
                successFunction();
            }
        }
    }
}

var getServices = function (){
    $('body').addClass('bodyload');
    var request1 = $.ajax({
        url: servurl + "endpoint/api/getmyservices",
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
        },
        data: JSON.stringify({}),
        contentType: "application/json; charset=UTF-8"
    });

    request1.success(function(result) {
      services.push(result.Data);
      $("#autoSelect2").gbAutocomplete({
        data: result.Data,
        mySearch:".autoSearch2",
        mySearchField: "name"
      })
      startFunc();
    });
    request1.fail(function(jqXHR, textStatus) {
        $('body').removeClass('bodyload');
        if(window.andapp.checkInternet() != "true"){
		    window.andapp.saveLatestURL("selectCatagory.html");
			window.andapp.loadLocalFile();
		}
    });
}
$('.currentLocation .fa-pencil').click(function(){
    $(".autoSearch").val('');
    $(".autoSearch").focus();
});
$(".popContent").on("click", function(e){
    e.stopPropagation();
});
$(".pop_up, .closePop").on("click", function(){
    $(".pop_up").hide();
});
$(".businessLogin").on("click", function(){
    if(window.andapp.getSubdomain().length > 0){
        window.andapp.saveAdminState("true");
        if(window.andapp.checkInternet() == "true"){
			window.location.href = 'schedulePage.html';
		}else{
		    window.andapp.saveLatestURL("schedulePage.html");
			window.andapp.loadLocalFile();
		}
    }else{
        if(window.andapp.checkInternet() == "true"){
			window.location.href = 'adminLogin.html';
		}else{
		    window.andapp.saveLatestURL("adminLogin.html");
			window.andapp.loadLocalFile();
		}
    }
});
var searcfield = false;
$(document).on("click",function(){
    /*if(searcfield)
        $(".searchbox1").css("margin-bottom", "100px");
    else
        $(".searchbox1").css("margin-bottom", "0px");*/

    searcfield = false;
});
$(".autoSearch2").focus(function(){
    searcfield = true;
    //$(".searchbox1").css("margin-bottom", "100px");
});
$('.autoComplete .fa-search').click(function(){
    var matchFound = -1;
    services[0].forEach(function(item, index){
      if(item.name.toLowerCase() == $(".autoSearch2").val().toLowerCase()){
        matchFound = index;
        serviceId = item._id;
      }
    });
    if(matchFound != -1){
        window.andapp.saveServiceId(serviceId);
        if(window.andapp.checkInternet() == "true"){
			window.location.href = 'servicePage.html';
		}else{
		    window.andapp.saveLatestURL("servicePage.html");
			window.andapp.loadLocalFile();
		}
    }else{
        $(".popContent h2").text("Get Services");
        $(".popContent span").text("");
        $(".popContent strong").text("No Category found.");
        $(".pop_up").show();
    }
});
$(".categoryItem3, .categoryItem1, .categoryItem2, .categoryItem4, .categoryItem5, .categoryItem6, .categoryItem8").on("click", function(e){
    e.stopPropagation();
    $('body').addClass('bodyload');
    var matchFound = -1;
    var textVal = $(this).find(".specName").text();
    services[0].forEach(function(item, index){
        if(item.name == textVal){
          matchFound = index;
          serviceId = item._id;
        }
    });
    if(matchFound != -1){
        window.andapp.saveServiceId(serviceId);
        if(window.andapp.checkInternet() == "true"){
			window.location.href = 'servicePage.html';
		}else{
		    window.andapp.saveLatestURL("servicePage.html");
		    window.andapp.loadLocalFile();
		}
    }else{
      $('body').removeClass('bodyload');
      $(".popContent h2").text("Status");
      $(".popContent span").text("");
      $(".popContent strong").text("No Category found.");
      $(".pop_up").show();
    }
});

$('.gpsIcon').on("click", function(){
    $('body').addClass('bodyload');
    window.andapp.updateCurrentLocation();
    window.andapp.saveLocationType("true");
    locationType = "true";
    startFunc();
    if(country == "India"){
        $(".categoryItem4 .cirleIcon").removeClass("attrny");
        $(".categoryItem4 strong").text("Photography");
    } else {
        $(".categoryItem4 .cirleIcon").addClass("attrny");
        $(".categoryItem4 strong").text("Attorneys");
    }
});

var input = (document.getElementById('pac-input'));
var autocomplete = new google.maps.places.Autocomplete(input);

autocomplete.addListener('place_changed', function() {
  var place = autocomplete.getPlace();

  if (!place.geometry) {
        if(window.andapp.checkInternet() != "true"){
    	    window.andapp.saveLatestURL("selectCatagory.html");
    		window.andapp.loadLocalFile();
    	}else{
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            $(".popContent h2").text("Change Location");
            $(".popContent span").text("");
            $(".popContent strong").text("No details available for input: '" + place.name + "'");
            $(".pop_up").show();
            return;
    	}
  }else{
    searchedLat = place.geometry.location.lat();
    searchedLong = place.geometry.location.lng();
    latitude = searchedLat;
    longitude = searchedLong;
    window.andapp.saveLocationType("false");
    window.andapp.saveRecentLocation($("#pac-input").val());
    window.andapp.saveCustomeLat(latitude);
    window.andapp.saveCustomeLong(longitude);
    window.andapp.updateLatLong(latitude, longitude);
    locationType = "false";
    if($("#pac-input").val().indexOf("India") != -1){
        $(".categoryItem4 .cirleIcon").removeClass("attrny");
        $(".categoryItem4 strong").text("Photography");
    } else {
        $(".categoryItem4 .cirleIcon").addClass("attrny");
        $(".categoryItem4 strong").text("Attorneys");
    }
  }
});

function goBack(){
    window.andapp.closeApp();
}

var refreshOnForeground = function(){
    if(window.andapp.checkInternet() != "true"){
	    window.andapp.saveLatestURL("selectCatagory.html");
		window.andapp.loadLocalFile();
	}else{
        location.reload();
	}
}

var locationChange = function(){}

$(".appointments").on("click", function(){
    $('body').addClass('bodyload');
    if(window.andapp.checkInternet() == "true"){
		window.location.href = 'appointments.html';
	}else{
	    window.andapp.saveLatestURL("appointments.html");
		window.andapp.loadLocalFile();
	}
});
getServices();