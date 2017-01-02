var servurl = "https://services.within30.com/";     //"https://services.within30.com/"
var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var key = "AIzaSyAjBEUatDTwvyslQtJYGxNATrh30BJHpH0";
var latitude, longitude, locationType, userId, services = [];

$('.tabModule').gbTab({
    tabUL:".tabMenu",
    tabCont:".tabContent"
})

$(".back").on("click", function(){
    window.history.back();
});

 var goBack = function(){
    console.log("!!!!!!!! "+window.history.length);
     window.history.back();
 }

 var refreshOnForeground = function(){
     //location.reload();
 }
 var locationChange = function(){}

 var submitRating = function(appointmentId, rating, subdomain){
    var request1 = $.ajax({
        url: servurl + "endpoint/api/submitrating",
        type: "POST",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
        },
        data: JSON.stringify({"appointmentId":appointmentId, "subdomain": subdomain, "rating": rating}),
        contentType: "application/json; charset=UTF-8"
    });
    request1.success(function(result) {
       if(result.Status == "Success"){
            window.andapp.showToast("Rating Submitted Succesfully.");
       }else{
            window.andapp.showToast("Failed to update. Try later.");
       }
    });
    request1.fail(function(jqXHR, textStatus) {
        $(".popContent h2").text("Submit Rating");
        //$(".popContent strong").text("Failed");
        $(".popContent span").text("Your request didn't go through. Please try again");
        $(".pop_up").show();
    });
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
     });
     request1.fail(function(jqXHR, textStatus) {
         $('body').removeClass('bodyload');
         console.log(textStatus);
     });
 }

 var setView = function(data){
    var pendingSlots = [];
    var finishedSlots = [];
    var myTime = moment().format("YYYY-MM-DD HH:mm");

    data.forEach(function(item, index){
        var appointmentTime = item.selecteddate+" "+item.starttime;
        if(appointmentTime > myTime){
            pendingSlots.push(item);
        }else{
            finishedSlots.push(item);
        }
    });

    pendingSlots.forEach(function(item, index){
        jQuery.ajax({
            url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+latitude+','+longitude+'&destinations='+item.destinationLat+','+item.destinationLong+'&key=AIzaSyAjBEUatDTwvyslQtJYGxNATrh30BJHpH0',
            method: 'GET',
            success: function (result) {
                if(result.status === "OK"){
                   for( var i = 0; i < result.rows[0].elements.length; i++){
                        if(result.rows[0].elements[i].status === "OK"){
                            var requiredDistance = (result.rows[0].elements[i].distance.value * 0.000621371).toFixed(0);
                            //var requiredTime =result.rows[0].elements[i].duration.value/60;
                            item.destinationDistance = requiredDistance;
                        }else{
                            item.destinationDistance = "NA";
                        }
                   }
                }else{
                    item.destinationDistance = "NA";
                }
            },
            fail: function(error){
                console.log(error);
            },
            async: false
        });
    });

    pendingSlots.forEach(function(item, index){
        var temp = "";
        if(item.destinationDistance)
            temp = item.destinationDistance+" miles away";

        if(item.destinationDistance > 55)
            $(".pendingTab").append('<div class="appointBlock"><div class="contBlock"><div class="contBlockSec"><h3>'+item.companyName+'</h3><p>'+item.selecteddate+' <span>'+item.starttime+'</span></p></div><div class="contBlockSec"><p>'+item.address+'</p></div></div><div class="contBlockBottom"><span>'+temp+'</span></div></div>');
        else
            $(".pendingTab").append('<div class="appointBlock"><div class="contBlock"><div class="contBlockSec"><h3>'+item.companyName+'</h3><p>'+item.selecteddate+' <span>'+item.starttime+'</span></p></div><div class="contBlockSec"><p>'+item.address+'</p></div></div><div class="contBlockBottom"><span>'+temp+'</span><a class="'+item.appointmentId+' '+item.businessType.replace(" ", "")+'" href="#">View on map</a></div></div>');
        $("."+item.appointmentId).on("click", function(){
            var serviceName = $(this).attr("class").split(" ")[1];
            var matchFound = -1;
            var serviceId = "";
            services[0].forEach(function(item, index){
              if(item.name.replace(" ", "").toLowerCase() == serviceName.toLowerCase()){
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
    });

    finishedSlots.forEach(function(item, index){
        if(item.rating){
            $(".finishTab").append('<div class="appointBlock appointFinished"><div class="contBlock"><div class="contBlockSec"><h3>'+item.companyName+'</h3><p>'+item.selecteddate+' <span>'+item.starttime+'</span></p></div><div class="contBlockSec"><p>'+item.address+'</p></div></div><div class="straRating"><strong>Thanks for Rating!</strong><div class="ratingBlock"><div class="rateAppoitnment" id="'+item.appointmentId+'"></div></div></div></div>');
            $("#"+item.appointmentId).rateYo({
                rating: item.rating,
                readOnly: true,
                starWidth: "10px"
            });
        }else{
            $(".finishTab").append('<div class="appointBlock appointFinished"><div class="contBlock"><div class="contBlockSec"><h3>'+item.companyName+'</h3><p>'+item.selecteddate+' <span>'+item.starttime+'</span></p></div><div class="contBlockSec"><p>'+item.address+'</p></div></div><div class="straRating"><strong>Rate your  Experience</strong><div class="ratingBlock"><div class="rateAppoitnment" id="'+item.appointmentId+'"></div><span class="submitRating"></span></div></div></div>');
            $("#"+item.appointmentId).rateYo({
                fullStar: true,
                starWidth: "10px"
            });

            $("#"+item.appointmentId).on("click", function(e){
                e.stopPropagation();
                var rating = Number($("#"+item.appointmentId).rateYo("option", "rating"));
                if(!item.rating){
                    $(this).next(".submitRating").show();
                    $(this).next(".submitRating").on("click", function(){
                         var appointmentId = $(this).prev(".rateAppoitnment").attr('id');
                         submitRating(appointmentId, rating, item.subdomain);
                         $(".submitRating").hide();
                    });
                }
            });
        }

    });
 }

 var getAppointments = function(){
     if(userId){
        var request1 = $.ajax({
            url: servurl + "endpoint/api/getappointmentList",
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
            },
            data: JSON.stringify({"userId":userId}),
            contentType: "application/json; charset=UTF-8"
        });
        request1.success(function(result) {
           if(result.Status == "Ok"){
                getServices();
                setView(result.Data);
           }else{
                $(".popContent h2").text("Get Appointment Status");
                //$(".popContent strong").text("Failed");
                $(".popContent span").text("Something went wrong. Try again");
                $(".pop_up").show();
           }
        });
        request1.fail(function(jqXHR, textStatus) {
            $(".popContent h2").text("Get Appointment Status");
            //$(".popContent strong").text("Failed");
            $(".popContent span").text("Your request didn't go through. Please try again");
            $(".pop_up").show();
        });
     }else{
        alert("Something went wrong. Try again");
     }
 }

if(window.andapp){
     latitude = window.andapp.getLatitude();
     longitude = window.andapp.getLongitude();
     userId = window.andapp.getUserId();
     locationType = window.andapp.getLocationType();
     if(!locationType || locationType == "false"){
         gotUserLocation = false;
         if (window.andapp){
             recentSearch = window.andapp.getRecentLocation();
             if(recentSearch){
                 latitude = window.andapp.getCustomeLat();
                 longitude = window.andapp.getCustomeLong();
                 getAppointments();
             }else{
                 alert("Not able to get your location");
             }
         }
     }else{
         if(!latitude && !longitude){
             alert("Not able to get your location");
         }else{
             getAppointments();
         }
     }
}
