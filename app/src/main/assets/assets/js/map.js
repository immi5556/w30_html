var servurl = "https://services.schejule.com:9095/";     //"https://services.within30.com/"
var sockurl = "https://socket.schejule.com:9090/";       //"https://socket.within30.com/"
var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var serviceId = "";               //57527f72c848741100ac0c9f
var urlLink = ".schejule.com:9092/";
var localImagePath = "./assets/img/";
var milesValue = 60;
var minutesValue = 60;
var markers = [];
var customers = [];
var map = null;
var latitude = 0, longitude = 0;
var circle = null;
var mapProp = null;
var bookedSlotAt = [];
var bookedSlotDate = [];
var bookedSlotSubdomain = [];
var subDomains = [];
var services = [];
var sliderTime = null;
var currentMarker = "";
var oldMarker = -1;
var bookedBusiness = null;
var locationRedirect = false;
var socketio = io.connect(sockurl);
var abbrs = {
        EST : 'America/New_York',
        EDT : 'America/New_York',
        CST : 'America/Chicago',
        CDT : 'America/Chicago',
        MST : 'America/Denver',
        MDT : 'America/Denver',
        PST : 'America/Los_Angeles',
        PDT : 'America/Los_Angeles',
        IST : "Asia/Kolkata"
};
var email, mobilenumber, userid;
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

        var matchFound = -1;
        services[0].forEach(function(item, index){
          if(item._id == serviceId){
            matchFound = index;
          }
        });
        if(matchFound != -1){
           $("#catagorySelect").text('');
           $("#catagorySelect").text(services[0][matchFound].name);
           $("."+services[0][matchFound].name.toLowerCase().replace(" ", "")).addClass("active");
        }else{
          alert("No Category found.");
        }
    });
    request1.fail(function(jqXHR, textStatus) {
        console.log(textStatus);
    });
}

    function getCustomerAPICall(lat, lng, miles, min){        
        miles = Number(miles);
        min = Number(min);
        var request1 = $.ajax({
            url: servurl + "endpoint/api/getmycustomers",
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
            },
            data: JSON.stringify({"serviceId":serviceId,"latitude":lat, "longitude":lng,"miles": miles,"minutes":min, "userId":userid}),
            contentType: "application/json; charset=UTF-8"
        });

        request1.success(function(result) {
            if(result.Status == "Ok"){
                milesValue = 30;
                minutesValue = 30;
                loadMap(result.Data);
            }else{
                /*$(".popContent h2").text("Get Customers Response");
                $(".popContent strong").text("No Customers in your Range. Redirecting to nearest location.");
                $(".pop_up").show();
                if(!locationRedirect){
                    latitude = Number(result.latitude);
                    longitude = Number(result.longitude);
                    errorFunction(null);
                    locationRedirect = true;
                }else{
                    $(".popContent h2").text("Get Customers Response");
                    $(".popContent strong").text("There seem to be no businesses in this category currently.");
                    $(".pop_up").show();
                    loadMap([]);
                }*/
                $(".popContent h2").text("Get Customers Response");
                $(".popContent strong").text("There seem to be no businesses in your range currently.");
                $(".pop_up").show();
                loadMap([]);
            }
        });
        request1.fail(function(jqXHR, textStatus) {
            $(".popContent h2").text("Get Customers Response");
            $(".popContent strong").text("Error Occured.");
            $(".pop_up").show();
        });
    }
    var successFunction = function(pos){
        milesValue = 60;
        minutesValue = 60;
        getServices();
        getCustomerAPICall(latitude, longitude, milesValue, minutesValue);
    }
    var errorFunction = function(err){
        milesValue = 60;
        minutesValue = 60;
        getServices();
        getCustomerAPICall(latitude, longitude, milesValue, minutesValue);
    }



    var loadMap = function(docs){
        subDomains = [];
        customers = docs;
        mapProp = {
            center:new google.maps.LatLng(latitude,longitude),
            zoom:10,
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
          };
        map=new google.maps.Map(document.getElementById("map"), mapProp);
        var userMarker = new google.maps.Marker({
                                position: {lat: latitude, lng: longitude},
                                map: map,
                                title: "Your Location",
                                icon: localImagePath+"userLocationMarker.png"
                            });
        
        for(var i = 0; i < docs.length; i++){
            var myLatLng = {lat: docs[i].geo.coordinates[1], lng: docs[i].geo.coordinates[0]}
            var icon;
            sliderTime = moment().tz(abbrs[docs[i].timeZone]).add(minutesValue, "minutes").format("HH:mm");
            itemFound = jQuery.inArray( docs[i].subdomain, bookedSlotSubdomain );
            if(docs[i].slotBookedAt.length){
                if(docs[i].premium)
                    icon = "premiumCheckedInMarker2";
                else
                    icon = "checkedInMarker2";

                var service = new google.maps.DirectionsService();
                var directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setOptions( { suppressMarkers: true } );
                var end = new google.maps.LatLng(docs[i].geo.coordinates[1], docs[i].geo.coordinates[0]);
                var start = new google.maps.LatLng(latitude, longitude);
                var bounds = new google.maps.LatLngBounds();
                service.route({
                    origin: start,
                    destination: end,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }, function(result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                          // new path for the next result
                          var path = new google.maps.MVCArray();
                          //Set the Path Stroke Color
                          // new polyline for the next result
                          var poly = new google.maps.Polyline({
                            map: map,
                            strokeColor: '#4986E7'
                          });
                          poly.setPath(path);
                          for (var k = 0, len = result.routes[0].overview_path.length; k < len; k++) {
                            path.push(result.routes[0].overview_path[k]);
                            bounds.extend(result.routes[0].overview_path[k]);
                            map.fitBounds(bounds);
                          }
                        } else alert("Directions Service failed:" + status);
                });
            }else if(itemFound != -1){
                if(docs[i].premium)
                    icon = "premiumCheckedInMarker2";
                else
                    icon = "checkedInMarker2";
            }else if(moment().tz(abbrs[docs[i].timeZone]).format("YYYY-MM-DD") != docs[i].nextSlotDate || docs[i].nextSlotAt > sliderTime){
                if(docs[i].premium)
                    icon = "premiumRedMarker2";
                else
                    icon = "redMarker2";
            }else {
                if(docs[i].premium)
                    icon = "premiumGreenMarker2";
                else
                    icon = "greenMarker2";
            }

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: docs[i].fullName,
                icon: localImagePath+""+icon+".png"
            });
            
            if(docs[i].destinationDistance > milesValue){
                marker.setVisible(false);
            }
            var subdomain = docs[i].subdomain;
            markers.push(marker);    
            subDomains.push(subdomain);
            google.maps.event.addListener(marker, 'click', (function(marker, subdomain, i) {
                return function() {
                    if($(".menu").hasClass("fa-times")){
                        $(".menu").removeClass('fa-times');
                        $(".menu").addClass('fa-bars');
                        $('.mynav').fadeOut();
                    }
                    currentMarker = i;
                    if(oldMarker >= 0){
                        var markerIcon = markers[oldMarker].icon;
                        markers[oldMarker].setIcon(markerIcon.substring(0, markerIcon.length-5)+"2.png");
                    }
                    oldMarker = i;                 
                    var markerIcon = marker.icon;
                    marker.setIcon(markerIcon.substring(0, markerIcon.length-5)+"1.png");
                    var companyAddr = "";
                    if(customers[i].geo.address){
                        if(customers[i].geo.address.premise){
                            companyAddr += customers[i].geo.address.premise+", ";
                        }
                        if(customers[i].geo.address.sublocality){
                            companyAddr += customers[i].geo.address.sublocality+", ";
                        }
                        if(customers[i].geo.address.city){
                            companyAddr += customers[i].geo.address.city+", ";
                        }
                    }

                    var rating = 0, ratingCount = 0;
                    if(customers[i].rating)
                        rating = customers[i].rating.toFixed(2);
                    
                    if(customers[i].ratingCount)
                        ratingCount = customers[i].ratingCount;
                    
                    if(companyAddr){
                        companyAddr = companyAddr.substring(0, companyAddr.length-2);
                    }else{
                        companyAddr = "Sorry Address Not Provided."
                    }
                    var itemFound = jQuery.inArray( customers[i].subdomain, bookedSlotSubdomain );
                    $(".serviceHead h2").text(customers[i].fullName);
                    $("#rateYo").rateYo({
                        rating: rating,
                        starWidth: "10px"
                    });
                    $(".rating span").text("("+ratingCount+")");
                    $(".milesVal").text(customers[i].destinationDistance.toFixed(2)+" Miles");
                    $(".companyAddr").text(companyAddr);
                    //$(".website").attr("href","https://"+docs[i].subdomain+urlLink);
                    $(".phoneCall").on("click", function(){
                        if(window.andapp){
                            window.andapp.phoneCall(customers[i].mobile);
                        }
                    });
                    $(".website").on("click", function(){
                        if(window.andapp){
                            window.andapp.openLink("https://"+customers[i].subdomain+urlLink);
                        }
                    });
                    $(".businessHours").text("Business Hours: "+customers[i].startHour+" - "+customers[i].endHour);
                    $(".directionArrowBottom").hide();
                    $(".directionArrowTop").show();
                    $(".serviceSection").animate({
                        height:'115px'
                    },500);
                    if(customers[i].slotBookedAt){
                        if(moment().tz(abbrs[customers[i].timeZone]).format("YYYY-MM-DD") != customers[i].slotBookedDate)
                            $(".slotTime").text("Slot Booked For: "+moment(customers[i].slotBookedDate).format("MM/DD")+" "+customers[i].slotBookedAt);
                        else
                            $(".slotTime").text("Slot Booked For: "+customers[i].slotBookedAt);
                        $(".btn_sch").prop('disabled', "disabled");
                    }else if(itemFound >= 0){
                        if(moment().tz(abbrs[customers[i].timeZone]).format("YYYY-MM-DD") != bookedSlotDate[itemFound])
                            $(".slotTime").text("Slot Booked For: "+moment(bookedSlotDate[itemFound]).format("MM/DD")+" "+bookedSlotAt[itemFound]);
                        else
                            $(".slotTime").text("Slot Booked For: "+bookedSlotAt[itemFound]);
                        $(".btn_sch").prop('disabled', "disabled");
                    }else{
                        if(moment().tz(abbrs[customers[i].timeZone]).format("YYYY-MM-DD") != customers[i].nextSlotDate)
                            $(".slotTime").text("Next Slot At: "+moment(customers[i].nextSlotDate).format("MM/DD")+" "+customers[i].nextSlotAt);
                        else
                            $(".slotTime").text("Next Slot At: "+customers[i].nextSlotAt);
                        $(".btn_sch").prop('disabled', "");
                        $(".btn_sch").off().on("click", function(){
                            bookSlot(subdomain, i, customers[i].nextSlotAt, customers[i].timeZone, customers[i].nextSlotDate);
                        });
                    }
                    if(!customers[i].slotBookedAt.length && moment().tz(abbrs[customers[i].timeZone]).format("YYYY-MM-DD HH:mm") > (customers[i].nextSlotDate+" "+customers[i].nextSlotAt)){
                        getCustomerInfo(latitude, longitude, 60, 60, i, 0);
                    }
                    $('.shadow').show();
                }
            })(marker, subdomain, i));
    }
    map.addListener('click', function() {
        $(".serviceSection").animate({height:'0'},500);
        $('.shadow').hide();
        if(oldMarker >= 0){
            var markerIcon = markers[oldMarker].icon;
            markers[oldMarker].setIcon(markerIcon.substring(0, markerIcon.length-5)+"2.png");
        }
        if(currentMarker >= 0){
            var markerIcon = markers[currentMarker].icon;
            markers[currentMarker].setIcon(markerIcon.substring(0, markerIcon.length-5)+"2.png");
        }
    });
    $(".shadow").on('click', function() {
        $(".serviceSection").animate({height:'0'},500);
        $('.shadow').hide();
        if(oldMarker >= 0){
            var markerIcon = markers[oldMarker].icon;
            markers[oldMarker].setIcon(markerIcon.substring(0, markerIcon.length-5)+"2.png");
        }
        if(currentMarker >= 0){
            var markerIcon = markers[currentMarker].icon;
            markers[currentMarker].setIcon(markerIcon.substring(0, markerIcon.length-5)+"2.png");
        }
    });
    changeCircle();

    milesValue = 30;
    $('.range-slider.slideMil').foundation('slider', 'set_value', milesValue);
    minutesValue = 30;
    $('.range-slider.slideMin').foundation('slider', 'set_value', minutesValue);
    $("body").on('DOMSubtreeModified', "span#sliderOutput2", function () {
        if($(this).text().length > 0 && !isNaN($(this).text())){
            if($(this).text().length > 2 && $(this).text().length % 2 == 0 && milesValue < 10){
                minutesValue = parseInt($(this).text().substring($(this).text().length - 1 , $(this).text().length));
            }else if($(this).text().length > 2 && $(this).text().length % 2 == 0 && milesValue >= 10){
                minutesValue = parseInt($(this).text().substring($(this).text().length - 2 , $(this).text().length));
            }else if($(this).text().length > 2 && $(this).text().length % 2 == 1 && milesValue < 10){
                minutesValue = parseInt($(this).text().substring($(this).text().length - 2 , $(this).text().length));
            }else if($(this).text().length > 2 && $(this).text().length % 2 == 1 && milesValue >= 10){
                minutesValue = parseInt($(this).text().substring($(this).text().length - 1 , $(this).text().length));
            }else if($(this).text().length == 2 && parseInt($(this).text()) > 60){
                minutesValue = parseInt($(this).text().substring($(this).text().length - 1 , $(this).text().length));
            }else{
                minutesValue = parseInt($(this).text());
            }
            minutesSlide(minutesValue);
        }else{
            $(this).text('');
            $(this).text(minutesValue);
            minutesSlide(minutesValue);
        }
    });
    $("body").on('DOMSubtreeModified', "span#sliderOutput3", function () {
        if($(this).text().length > 0 && !isNaN($(this).text())){
            if($(this).text().length > 2 && $(this).text().length % 2 == 0 && milesValue < 10){
                milesValue = parseInt($(this).text().substring($(this).text().length - 1 , $(this).text().length));
            }else if($(this).text().length > 2 && $(this).text().length % 2 == 0 && milesValue >= 10){
                  milesValue = parseInt($(this).text().substring($(this).text().length - 2 , $(this).text().length));
            }else if($(this).text().length > 2 && $(this).text().length % 2 == 1 && milesValue < 10){
                milesValue = parseInt($(this).text().substring($(this).text().length - 2 , $(this).text().length));
            }else if($(this).text().length > 2 && $(this).text().length % 2 == 1 && milesValue >= 10){
                 milesValue = parseInt($(this).text().substring($(this).text().length - 1 , $(this).text().length));
            }else if($(this).text().length == 2 && parseInt($(this).text()) > 60){
                milesValue = parseInt($(this).text().substring($(this).text().length - 1 , $(this).text().length));
            }else{
                milesValue = parseInt($(this).text());
            }

            milesSlide(milesValue);
        }else{
            $(this).text('');
            $(this).text(milesValue);
            milesSlide(milesValue);
        }
    });
    $('.gm-style-iw').parent('div').css('z-index','99999');
    if((minutesValue-4) > milesValue) {
        $('.slideMin').addClass('myactive');
        $('.slideMil').removeClass('myactive');
    }else if((minutesValue-4) < milesValue) {
        $('.slideMin').removeClass('myactive');
        $('.slideMil').addClass('myactive');
    }
}

    function milesSlide (rad) {
        circle.setRadius(rad*1609.34);
        milesValue = rad;
        updateMilesRadius();
    }

    function minutesSlide (min) {
        minutesValue = min;
        updateTimeRadius(min);
    }

    function changeCircle(){
        circle = new google.maps.Circle({
          strokeColor: '#808080',
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: '#FFFFFF',
          fillOpacity: 0,
          map: map,
          center: {lat: latitude, lng: longitude},
          radius: 48280.3
        });
        circle.addListener('click', function() {
                $(".serviceSection").animate({
                        height:'0'
                    },500);
                $('.shadow').hide();
                if(oldMarker >= 0){
                    var markerIcon = markers[oldMarker].icon;
                    markers[oldMarker].setIcon(markerIcon.substring(0, markerIcon.length-5)+"2.png");
                }
            });
        return;
        //circle.bindTo('center', markers[0], 'position');
    }
    function updateMilesRadius(){
        if(milesValue < 30 ){
            map.setZoom(10);
        }
        if(milesValue < 20 ){
            map.setZoom(11);
        }
        if(milesValue < 10 ){
            map.setZoom(12);
        }
        customers.forEach(function(item, i){
            if(item.destinationDistance > milesValue){
                markers[i].setVisible(false);
            }else{
                markers[i].setVisible(true);
            }
        });

        if((minutesValue-4) > milesValue) {
            $('.slideMin').addClass('myactive');
            $('.slideMil').removeClass('myactive');
        }else if((minutesValue-4) < milesValue) {
            $('.slideMin').removeClass('myactive');
            $('.slideMil').addClass('myactive');
        }
        return;
    }

    function updateTimeRadius(min){
        minutesValue = min;

        customers.forEach(function(item, i){

            sliderTime = moment().tz(abbrs[item.timeZone]).add(minutesValue, "minutes").format("HH:mm");
            var icon = "";
            itemFound = jQuery.inArray( item.subdomain, bookedSlotSubdomain );
            if(item.slotBookedAt.length){
                if(item.premium)
                    icon = "premiumCheckedInMarker2";
                else
                    icon = "checkedInMarker2";
            }else if(itemFound != -1){
                if(item.premium)
                    icon = "premiumCheckedInMarker2";
                else
                    icon = "checkedInMarker2";
            }else if(moment().tz(abbrs[item.timeZone]).format("YYYY-MM-DD") != item.nextSlotDate || item.nextSlotAt > sliderTime){
                if(item.premium)
                    icon = "premiumRedMarker2";
                else
                    icon = "redMarker2";
            }else{
                if(item.premium)
                    icon = "premiumGreenMarker2";
                else
                    icon = "greenMarker2";
            }
            markers[i].setIcon(localImagePath+""+icon+".png");
            oldMarker = -1;
        });

        if((minutesValue-4) > milesValue) {
            $('.slideMin').addClass('myactive');
            $('.slideMil').removeClass('myactive');
        }else if((minutesValue-4) < milesValue) {
            $('.slideMin').removeClass('myactive');
            $('.slideMil').addClass('myactive');
        }

        return;
    }

    var calculateDifference = function(timeZone, result){
            var start = moment.tz(abbrs[timeZone]).format("YYYY-MM-DD HH:mm");
            var end = result.Data.selecteddate+" "+result.Data.data.endTime;
            return (new Date(end).getTime() - new Date(start).getTime());
     }

    function bookSlot(subdomain, i, slotAt, timeZone, slotDate){
        var localTime;
        var today  = moment.tz(abbrs[timeZone]).format("YYYY-MM-DD");
        if(slotDate != today){
            localTime = slotDate+" "+slotAt;
        }else{
            localTime  = moment.tz(abbrs[timeZone]).format("HH:mm")
            if(slotAt < localTime)
                localTime  = moment.tz(abbrs[timeZone]).format("YYYY-MM-DD HH:mm");
            else{
                localTime  = moment.tz(abbrs[timeZone]).format("YYYY-MM-DD HH:mm");
                localTime = localTime.substring(0, localTime.length-5)+""+slotAt;
            }
        }
        var request1 = $.ajax({
            url: servurl + "endpoint/api/bookslot",
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
            },
            data: JSON.stringify({"subDomain":subdomain,"date":localTime,"email":email,"mobile":mobilenumber,"minutes":"30", "userId":userid}),
            contentType: "application/json; charset=UTF-8"
        });

        request1.success(function(result) {
            if(result.Status == "Ok"){
                $(".popContent h2").text("Appointment Status");
                $(".popContent strong").text("Confirmed");
                if(result.Data.selecteddate == moment.tz(abbrs[timeZone]).format("YYYY-MM-DD"))
                    $(".popContent span").text("See you At "+result.startTime);
                else
                    $(".popContent span").text("See you At "+moment(result.Data.selecteddate).format("MM/DD")+" "+result.startTime);
                $(".pop_up").show();
                $(".serviceSection").animate({height:'0'},500);
                $('.shadow').hide();
                bookedSlotAt.push(result.startTime);
                bookedSlotDate.push(result.Data.selecteddate);
                bookedSlotSubdomain.push(result.Data.subdomain);
                if(customers[i].premium)
                    markers[i].setIcon(localImagePath+"premiumCheckedInMarker2.png");
                else
                    markers[i].setIcon(localImagePath+"checkedInMarker2.png");

                var service = new google.maps.DirectionsService();
                var directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setOptions( { suppressMarkers: true } );
                var end = new google.maps.LatLng(customers[i].geo.coordinates[1], customers[i].geo.coordinates[0]);
                var start = new google.maps.LatLng(latitude, longitude);
                var bounds = new google.maps.LatLngBounds();
                service.route({
                        origin: start,
                        destination: end,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                      }, function(result, status) {
                            if (status == google.maps.DirectionsStatus.OK) {
                              // new path for the next result
                              var path = new google.maps.MVCArray();
                              //Set the Path Stroke Color
                              // new polyline for the next result
                              var poly = new google.maps.Polyline({
                                map: map,
                                strokeColor: '#4986E7'
                              });
                              poly.setPath(path);
                              for (var k = 0, len = result.routes[0].overview_path.length; k < len; k++) {
                                path.push(result.routes[0].overview_path[k]);
                                bounds.extend(result.routes[0].overview_path[k]);
                                map.fitBounds(bounds);
                              }
                            } else alert("Directions Service failed:" + status);
                      });
                
                socketio.emit("newAppointment", result.Data);
                var timeout = calculateDifference(timeZone, result);
                var index = bookedSlotAt.length-1;
                bookedBusiness = index;
                setTimeout(function(){
                    bookedSlotAt.splice(index, 1);
                    bookedSlotDate.splice(index, 1);
                    bookedSlotSubdomain.splice(index, 1);
                    var icon = "";
                    sliderTime = moment().tz(abbrs[customers[i].timeZone]).add(minutesValue, "minutes").format("HH:mm");
                    if(moment().tz(abbrs[customers[i].timeZone]).format("YYYY-MM-DD") != customers[i].nextSlotDate || customers[i].nextSlotAt > sliderTime){
                        if(customers[i].premium)
                            icon = "premiumRedMarker2";
                        else
                            icon = "redMarker2";
                    }else {
                        if(customers[i].premium)
                            icon = "premiumGreenMarker2";
                        else
                            icon = "greenMarker2";
                    }

                    markers[i].setIcon(localImagePath+icon+".png");

                }, timeout, index, i);
            }else{
                $(".popContent h2").text("Appointment Status");
                $(".popContent strong").text("Not Booked");
                $(".popContent span").text(result.Message);
                $(".pop_up").show();
            }
        });
        request1.fail(function(jqXHR, textStatus) {
            $(".popContent h2").text("Appointment Status");
            $(".popContent strong").text("Failed");
            $(".popContent span").text("Error Occured. Try again.");
            $(".pop_up").show();
        });
    }
    $(".popContent").on("click", function(e){
        e.stopPropagation();
    });
    $(".pop_up, .closePop").on("click", function(){
        $(".pop_up").hide();
    });

    $(".menuList4, .menuList2, .menuList3, .menuList5, .menuList6, .menuList7").on("click", function(){
        var matchFound = -1;
        var className = $(this).attr('class').split(" ")[1];
        services[0].forEach(function(item, index){
            if(item.name.replace(" ", "").toLowerCase() == className){
                matchFound = index;
            }
        });
        if(matchFound != -1){
           window.andapp.saveServiceId(services[0][matchFound]._id);
           location.reload();
        }else{
          alert("No Category found.");
        }
    });

    function getCustomerInfo(lat, lng, miles, min, index, timeline, callback){
        miles = Number(miles);
        min = Number(min);
        var request1 = $.ajax({
            url: servurl + "endpoint/api/getcustomerinfo",
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
            },
            data: JSON.stringify({"serviceId":serviceId,"latitude":lat, "longitude":lng,"miles": miles,"minutes":min, "userId":userid, "subdomain":subDomains[index], "timeline": timeline}),
            contentType: "application/json; charset=UTF-8"
        });
        request1.success(function(result) {
            customers[index].nextSlotDate = result.Data[0].nextSlotDate;
            customers[index].nextSlotAt = result.Data[0].nextSlotAt;
            if(callback){
                callback(result);
            }else{
                var itemFound = jQuery.inArray( subDomains[index], bookedSlotSubdomain );
                if(customers[index].slotBookedAt.length){
                    if(customers[index].premium)
                        icon = "premiumCheckedInMarker2";
                    else
                        icon = "checkedInMarker2";
                }else if(itemFound != -1){
                    if(customers[index].premium)
                        icon = "premiumCheckedInMarker2";
                    else
                        icon = "checkedInMarker2";
                }else if(moment().tz(abbrs[customers[index].timeZone]).format("YYYY-MM-DD") != customers[index].nextSlotDate || customers[index].nextSlotAt > sliderTime){
                    if(customers[index].premium)
                        icon = "premiumRedMarker2";
                    else
                        icon = "redMarker2";
                }else {
                    if(customers[index].premium)
                        icon = "premiumGreenMarker2";
                    else
                        icon = "greenMarker2";
                }
                
                markers[index].setIcon(localImagePath+""+icon+".png");
                if(oldMarker == index && $(".serviceSection").height() > 0){
                    itemFound = jQuery.inArray( subDomains[index], bookedSlotSubdomain );
                    if(itemFound < 0 && moment().tz(abbrs[customers[index].timeZone]).format("YYYY-MM-DD") != customers[index].nextSlotDate){
                        $(".slotTime").text("Next Slot At: "+moment(customers[index].nextSlotDate).format("MM/DD")+" "+customers[index].nextSlotAt);
                    }else if(itemFound < 0 && customers[index].nextSlotAt){
                        $(".slotTime").text("Next Slot At: "+customers[index].nextSlotAt);
                    }
                    markers[index].setIcon(markers[index].icon.substring(0, markers[index].icon.length-5)+"1.png");
                }   
            }
        });
        request1.fail(function(jqXHR, textStatus) {
            //console.log(textStatus);
        });
    }
    $(document).foundation().foundation('joyride', 'start');
   if (window.andapp){
        latitude = Number(window.andapp.getLatitude());
        longitude = Number(window.andapp.getLongitude());
        email = window.andapp.getEmail();
        mobilenumber = window.andapp.getMobile();
        userid = window.andapp.getUserId();
        serviceId = window.andapp.getServiceId();

       if(!latitude && !longitude){
           errorFunction();
       }else{
           successFunction();
       }
   }

    var refreshOnForeground = function(){
        location.reload();
    }
    socketio.on('connect', function () {
        socketio.emit('room', "home");
        
        socketio.on('newAppointment', function(message) {
            var index = jQuery.inArray( message.subdomain, subDomains );
            if( index >= 0 && customers[index].nextSlotDate == message.selecteddate){
                getCustomerInfo(latitude, longitude, 60, 60, index, 0);
            }
        });
            
        socketio.on('updateAppointment', function(message) {
            var index = jQuery.inArray( message.subdomain, subDomains );
            if( index >= 0 ){
                getCustomerInfo(latitude, longitude, 60, 60, index, 0);
            }
        });
        
        socketio.on('deleteAppointment', function(message) {
            var index = jQuery.inArray( message.room, subDomains );
            if( index >= 0 ){
                getCustomerInfo(latitude, longitude, 60, 60, index, 0);
            }
        });
        
    });