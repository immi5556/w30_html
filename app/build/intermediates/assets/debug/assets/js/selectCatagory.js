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

var successFunction = function(){
    if(recentSearch && locationType == "false"){
        $("#pac-input").val(recentSearch);
        $('body').removeClass('bodyload');
    }else
        getLocation(latitude, longitude);
}
var errorFunction = function(){
	alert("Not able to retrieve your location. Check location settings.");
}

function getLocation(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({latLng: latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        var arrAddress = results;
        $.each(arrAddress, function(i, address_component) {
          if (address_component.types[0] == "political") {
            $("#pac-input").val(address_component.address_components[0].long_name);
            $('body').removeClass('bodyload');
            if(gotUserLocation)
                currentLocationName = address_component.address_components[0].long_name;
            else
                currentLocationName = null;
          }
        });
      } else {
        console.log("No results found");
      }
    } else {
        alert("Not able to get your location. Please restart the app.");
        console.log("Geocoder failed due to: " + status);
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
        console.log(textStatus);
    });
}

$('.currentLocation .fa-pencil').click(function(){
    $(".autoSearch").val('');
    $(".autoSearch").focus();
});
var searcfield = false;
$(document).on("click",function(){
    if(searcfield)
        $(".searchbox1").css("margin-bottom", "100px");
    else
        $(".searchbox1").css("margin-bottom", "0px");

    searcfield = false;
})
$(".autoSearch2").focus(function(){
    searcfield = true;
    $(".searchbox1").css("margin-bottom", "100px");
})

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
        window.location.href = "servicePage.html";
    }else{
      alert("No Category found.");
    }
})
$(".categoryItem3, .categoryItem1, .categoryItem2, .categoryItem4, .categoryItem5, .categoryItem6").on("click", function(e){
    e.stopPropagation();

    var matchFound = -1;
    var textVal = $(this).find("strong").text();
    services[0].forEach(function(item, index){
        if(item.name == textVal){
          matchFound = index;
          serviceId = item._id;
        }
    });
    if(matchFound != -1){
        window.andapp.saveServiceId(serviceId);
        if(!$("#pac-input").val() && $("#pac-input").val().length == 0){
            window.andapp.updateCurrentLocation();
            window.andapp.saveLocationType("true");
        }else if(currentLocationName && currentLocationName.toUpperCase() == $("#pac-input").val().toUpperCase()){
            if (window.andapp){
                window.andapp.saveLocationType("true");
            }
        }else if(currentLocationName && currentLocationName.toUpperCase() != $("#pac-input").val().toUpperCase()){
            latitude = searchedLat;
            longitude = searchedLong;
            if (window.andapp){
                window.andapp.saveLocationType("false");
                window.andapp.saveRecentLocation($("#pac-input").val());
                window.andapp.saveCustomeLat(latitude);
                window.andapp.saveCustomeLong(longitude);
                window.andapp.updateLatLong(latitude, longitude);
            }
        }
        window.location.href = "servicePage.html";
    }else{
      alert("No Category found.");
    }
});

$('.gpsIcon').on("click", function(){
    window.andapp.updateCurrentLocation();
    window.andapp.saveLocationType("true");
    startFunc();
});

var input = (document.getElementById('pac-input'));
var autocomplete = new google.maps.places.Autocomplete(input);

autocomplete.addListener('place_changed', function() {
  var place = autocomplete.getPlace();

  if (!place.geometry) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    window.alert("No details available for input: '" + place.name + "'");
    return;
  }else{
    searchedLat = place.geometry.location.lat();
    searchedLong = place.geometry.location.lng();
  }
});

function goBack(){
    window.andapp.closeApp();
}

var refreshOnForeground = function(){
    location.reload();
}

var locationChange = function(){}

getServices();