var servurl = "https://services.within30.com/";     //"https://services.within30.com/"
var w30Credentials = "win-HQGQ:zxosxtR76Z80";
//var serviceId = "57b54a9beead207818864335";                 //57527f72c848741100ac0c9f
var cities = [];
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
    	setRecentBlock();
    	/*
    	gbAutoComplete("autoComplete",{
        	"data": result
		});*/
    });
    request1.fail(function(jqXHR, textStatus) {
        console.log(textStatus);
    });
}

$('.usegps').on("click", function(){
    window.andapp.updateCurrentLocation();
    window.andapp.saveLocationType("true");
    window.location.href = "servicePage.html";
    // $(this).prop('checked', false);
});

$(".back").on("click", function(){
    window.location.href = "servicePage.html";
});

var locationType, latitude, longitude;
if (window.andapp){
     locationType = window.andapp.getLocationType();
     latitude = window.andapp.getLatitude();
     longitude = window.andapp.getLongitude();
 }
if(latitude && longitude){
    getCities();
}
 if(locationType && locationType == "true"){
    $('.usegps').prop('checked', true);
 }
var setRecentBlock = function(){
     var recentSearch = window.andapp.getRecentLocation();
     if(recentSearch){
         $(".recentSearch p").text(recentSearch);
         $(".recentSearch").on("click", function(){
             var selectedCity = cities[0].filter(function(item){
                 return item.city.toLowerCase() == $(".recentSearch p").text().toLowerCase();
             });
             if(selectedCity.length){
                 latitude = selectedCity[0].latitude;
                 longitude = selectedCity[0].longitude;
                 if (window.andapp){
                     window.andapp.saveLocationType("false");
                     window.andapp.saveCustomeLat(latitude);
                         window.andapp.saveCustomeLong(longitude);
                     window.andapp.updateLatLong(latitude, longitude);
                 }
             }
             window.location.href = "servicePage.html";
         });
     }else{
        $(".recentSearch p").text("No recent search");
     }
 }

 function goBack(){
     window.history.back();
 }

 var refreshOnForeground = function(){
     location.reload();
 }
 var locationChange = function(){}
