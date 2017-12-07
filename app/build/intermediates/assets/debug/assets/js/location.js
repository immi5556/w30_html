if(window.andapp){
    window.andapp.saveLatestURL("location.html");
}
var servurl = "https://services.within30.com/";     //"https://services.schejule.com:9095/"
var w30Credentials = "win-HQGQ:zxosxtR76Z80";

$('.usegps').on("click", function(){
    $('body').addClass('bodyload');
    window.andapp.updateCurrentLocation();
    window.andapp.saveLocationType("true");
    if(window.andapp.checkInternet() == "true"){
		window.location.href = 'servicePage.html';
	}else{
	    window.andapp.saveLatestURL("servicePage.html");
		window.andapp.loadLocalFile();
	}
    // $(this).prop('checked', false);
});

$(".back").on("click", function(){
    $('body').addClass('bodyload');
    if(window.andapp.checkInternet() == "true"){
		window.location.href = 'servicePage.html';
	}else{
	    window.andapp.saveLatestURL("servicePage.html");
		window.andapp.loadLocalFile();
	}
});

$(document).on("click", function(){
    $("#catagorySelect").show();
    $("#pac-input").hide();
})

$(".fa-search").on("click", function(e){
    e.stopPropagation();
    $("#catagorySelect").hide();
    $("#pac-input").show();
    $("#pac-input").focus();
});

var setRecentBlock = function(){
    $('body').addClass('bodyload');
     var recentSearch = window.andapp.getRecentLocation();
     if(recentSearch){
         $(".recentSearch p").text(recentSearch);
         $('body').removeClass('bodyload');
         $(".recentSearch").on("click", function(){
            $('body').addClass('bodyload');
            if (window.andapp){
                window.andapp.saveLocationType("false");
                window.andapp.updateLatLong(window.andapp.getCustomeLat(), window.andapp.getCustomeLong());
            }
            if(window.andapp.checkInternet() == "true"){
    			window.location.href = 'servicePage.html';
    		}else{
    		    window.andapp.saveLatestURL("servicePage.html");
    			window.andapp.loadLocalFile();
    		}
         });
     }else{
        $('body').removeClass('bodyload');
        $(".recentSearch p").text("No recent search");
     }
 }

 var input = (document.getElementById('pac-input'));
 var autocomplete = new google.maps.places.Autocomplete(input);

 autocomplete.addListener('place_changed', function() {
   var place = autocomplete.getPlace();

   if (!place.geometry) {
        if(window.andapp.checkInternet() != "true"){
		    window.andapp.saveLatestURL("location.html");
			window.andapp.loadLocalFile();
		}
     // User entered the name of a Place that was not suggested and
     // pressed the Enter key, or the Place Details request failed.
     window.alert("No details available for input: '" + place.name + "'");
     return;
   }else{
    $('body').addClass('bodyload');
        var searchedLat = place.geometry.location.lat();
        var searchedLong = place.geometry.location.lng();
        window.andapp.saveLocationType("false");
        window.andapp.saveRecentLocation($("#pac-input").val());
        $(".recentSearch p").text($("#pac-input").val());
        window.andapp.saveCustomeLat(searchedLat);
        window.andapp.saveCustomeLong(searchedLong);
        window.andapp.updateLatLong(searchedLat, searchedLong);
        if(window.andapp.checkInternet() == "true"){
    		window.location.href = 'servicePage.html';
    	}else{
    	    window.andapp.saveLatestURL("servicePage.html");
    		window.andapp.loadLocalFile();
    	}
   }
 });

var locationType;
if (window.andapp){
     locationType = window.andapp.getLocationType();
     if(locationType && locationType == "true"){
         $('.usegps').prop('checked', true);
      }
      setRecentBlock();
 }

 function goBack(){
    $('body').addClass('bodyload');
    if(window.andapp.checkInternet() == "true"){
		window.location.href = 'servicePage.html';
	}else{
	    window.andapp.saveLatestURL("servicePage.html");
		window.andapp.loadLocalFile();
	}
 }

 var refreshOnForeground = function(){
    if(window.andapp.checkInternet() == "true"){
		window.location.href = 'location.html';
	}else{
	    window.andapp.saveLatestURL("location.html");
		window.andapp.loadLocalFile();
	}
 }
 var locationChange = function(){}
