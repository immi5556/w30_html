var servurl = "https://services.within30.com/";     //"https://services.within30.com/"
var w30Credentials = "win-HQGQ:zxosxtR76Z80";

$('.usegps').on("click", function(){
    window.andapp.updateCurrentLocation();
    window.andapp.saveLocationType("true");
    window.location.href = "servicePage.html";
    // $(this).prop('checked', false);
});

$(".back").on("click", function(){
    window.location.href = "servicePage.html";
});

var setRecentBlock = function(){
     var recentSearch = window.andapp.getRecentLocation();
     if(recentSearch){
         $(".recentSearch p").text(recentSearch);
         $(".recentSearch").on("click", function(){
             if (window.andapp){
                window.andapp.saveLocationType("false");
                window.andapp.updateLatLong(window.andapp.getCustomeLat(), window.andapp.getCustomeLong());
             }
             window.location.href = "servicePage.html";
         });
     }else{
        $(".recentSearch p").text("No recent search");
     }
 }

var locationType;
if (window.andapp){
     locationType = window.andapp.getLocationType();
     if(locationType && locationType == "true"){
         $('.usegps').prop('checked', true);
      }
      setRecentBlock();
 }

 function goBack(){
     window.history.back();
 }

 var refreshOnForeground = function(){
     location.reload();
 }
 var locationChange = function(){}
