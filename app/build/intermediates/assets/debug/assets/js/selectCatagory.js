var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.within30.com/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;
var cities = [];
var services = [];
var serviceId = "";
var locationType;
var recentSearch;
var currentLocationName, gotUserLocation, customeLocationName;

var successFunction = function(){
    getCities();
}
var errorFunction = function(){
	//Dallas location.
	latitude = Number(32.7767);
	longitude = Number(-96.7970);
	getCities();
}

function getLocation(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({latLng: latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        var arrAddress = results;
        $.each(arrAddress, function(i, address_component) {
          if (address_component.types[0] == "political") {
            $("#serach").val(address_component.address_components[0].long_name);
            $('body').removeClass('bodyload');
            if(gotUserLocation)
                currentLocationName = address_component.address_components[0].long_name;
            else
                currentLocationName = null;
          }
        });
      } else {
        $('body').removeClass('bodyload');
        console.log("No results found");
      }
    } else {
        $('body').removeClass('bodyload');
        console.log("Geocoder failed due to: " + status);
    }
  });
}

var getCities = function (){
	var request1 = $.ajax({
        url: servurl + "endpoint/api/getindiacities",
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
        },
        data: JSON.stringify({"latitude":latitude,"longitude":longitude}),
        contentType: "application/json; charset=UTF-8"
    });

    request1.success(function(result) {
    	cities.push(result);
    	$("#autoSelect").gbAutocomplete({
            data: result,
            mySearch:".autoSearch",
            mySearchField: "city"
          });
        if(recentSearch && locationType == "false"){
            $("#serach").val(recentSearch);
            $('body').removeClass('bodyload');
        }else
		    getLocation(latitude, longitude);
    });
    request1.fail(function(jqXHR, textStatus) {
        $('body').removeClass('bodyload');
        console.log(textStatus);
    });
}
var getServices = function (){
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
    });
    request1.fail(function(jqXHR, textStatus) {
        $('body').removeClass('bodyload');
        console.log(textStatus);
    });
}
getServices();
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
        if(!$("#serach").val() && $("#serach").val().length == 0){
            window.andapp.updateCurrentLocation();
            window.andapp.saveLocationType("true");
        }else if(currentLocationName && currentLocationName.toUpperCase() == $("#serach").val().toUpperCase()){
            if (window.andapp){
                window.andapp.saveLocationType("true");
            }
        }else{
            var selectedCity = cities[0].filter(function(item){
                return item.city.toLowerCase() == $("#serach").val().toLowerCase();
            });
            if(selectedCity.length){
                latitude = selectedCity[0].latitude;
                longitude = selectedCity[0].longitude;
                if (window.andapp){
                    window.andapp.saveLocationType("false");
                    window.andapp.saveRecentLocation($("#serach").val());
                    window.andapp.saveCustomeLat(latitude);
                    window.andapp.saveCustomeLong(longitude);
                    window.andapp.updateLatLong(latitude, longitude);
                }
            }else{
                alert("Location not in records.");
                window.andapp.updateCurrentLocation();
                window.andapp.saveLocationType("true");
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

var startFunc = function(){
    if (window.andapp){
        $('body').addClass('bodyload');
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

startFunc();
function goBack(){
    window.andapp.closeApp();
}

var refreshOnForeground = function(){
    location.reload();
}

var locationChange = function(){}