var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.schejule.com:9095/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;
var cities = [];

var successFunction = function(pos){
	latitude = pos.coords.latitude;
	longitude = pos.coords.longitude;
	getLocation(latitude, longitude);
	getCities();
}
var errorFunction = function(err){
	//Dallas location.
	latitude = 32.7767;
	longitude = -96.7970;
	getLocation(latitude, longitude);
	getCities();
}

function getLocation(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({latLng: latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        var arrAddress = results;
        $.each(arrAddress, function(i, address_component) {
          if (address_component.types[0] == "locality") {
            $("#serach").val(address_component.address_components[0].long_name);
          }
        });
      } else {
        //console.log("No results found");
      }
    } else {
      //console.log("Geocoder failed due to: " + status);
    }
  });
}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(successFunction, errorFunction,{timeout:5000});
} else {
	errorFunction(null);
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
    	gbAutoComplete("autoComplete",{
        	"data": result
		})
    });
    request1.fail(function(jqXHR, textStatus) {
        console.log(textStatus);
    });
}
$(".categoryItem1, .categoryItem2, .categoryItem4, .categoryItem5").on("click", function(){
	alert("Currently not available. Launching Soon");
});
$(".categoryItem3").on("click", function(){
	window.location.href = "servicePage.html";
});