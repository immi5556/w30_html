var servurl = "https://services.within30.com/";     //"https://services.schejule.com:9095/"
var w30Credentials = "win-HQGQ:zxosxtR76Z80";

$('.usegps').on("click", function(){
    $('body').addClass('bodyload');
    window.andapp.updateCurrentLocation();
    window.andapp.saveLocationType("true");
    window.location.href = "servicePage.html";
    // $(this).prop('checked', false);
});

$(".back").on("click", function(){
    $('body').addClass('bodyload');
    window.location.href = "servicePage.html";
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
             window.location.href = "servicePage.html";
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
     window.location.href = "servicePage.html";
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
     window.history.back();
 }

 var refreshOnForeground = function(){
     location.reload();
 }
 var locationChange = function(){}
