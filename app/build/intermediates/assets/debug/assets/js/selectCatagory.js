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

var circleMenu = function(){
    var classesExist = $(".menu-button").attr("class").split(" ");
    var matchFound = -1;
    classesExist.forEach(function(item, index){
      if(item == "fa-bars"){
        matchFound = index;
      }
    });
    if(matchFound != -1){
        $(".menu-button").click();
        finishrotate(50);
    }
}
var successFunction = function(){
    if(recentSearch && locationType == "false"){
        $("#pac-input").val(recentSearch);
        $('body').removeClass('bodyload');
        currentLocationName = recentSearch;
        circleMenu();
    }else
        getLocation(latitude, longitude);
}
var errorFunction = function(){
	//alert("Not able to retrieve your location. Check location settings.");
	$(".popContent h2").text("Get Location");
    $(".popContent span").text("");
    $(".popContent strong").text("Not able to retrieve your location. Check location settings.");
    $(".pop_up").show();
}

function getLocation(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({latLng: latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        var arrAddress = results;
        $.each(arrAddress, function(i, address_component) {
          if (address_component.types[0] == "political" || address_component.types[0] == "locality") {
            $("#pac-input").val(address_component.address_components[0].long_name);
            $('body').removeClass('bodyload');
            circleMenu();
            if(gotUserLocation)
                currentLocationName = address_component.address_components[0].long_name;
            else
                currentLocationName = null;
          }
          if (address_component.types[0] == "country") {
              country = address_component.address_components[0].long_name;
              window.andapp.saveCountryName(country);
            }
        });
        if(country == "India"){
            $(".categoryItem4 .cirleIcon").css("src", "../../content/images/mobileImages/catagoryIcon4-hover.png");
            $(".categoryItem4 strong").text("Photography");
        } else {
            $(".categoryItem4 .cirleIcon").css("src", "../../content/images/mobileImages/catagoryIcon01-hover.png");
            $(".categoryItem4 strong").text("Attorneys");
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
        //console.log(textStatus);
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
var searcfield = false;
$(document).on("click",function(){
    if(searcfield)
        $(".searchbox1").css("margin-bottom", "100px");
    else
        $(".searchbox1").css("margin-bottom", "0px");

    searcfield = false;
});
$(".autoSearch2").focus(function(){
    searcfield = true;
    $(".searchbox1").css("margin-bottom", "100px");
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
        window.location.href = "servicePage.html";
    }else{
        //alert("No Category found.");
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
    var textVal = $(this).find("strong").text();
    services[0].forEach(function(item, index){
        if(item.name == textVal){
          matchFound = index;
          serviceId = item._id;
        }
    });
    if(matchFound != -1){
        window.andapp.saveServiceId(serviceId);
        window.location.href = "servicePage.html";
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
});

var input = (document.getElementById('pac-input'));
var autocomplete = new google.maps.places.Autocomplete(input);

autocomplete.addListener('place_changed', function() {
  var place = autocomplete.getPlace();

  if (!place.geometry) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    //window.alert("No details available for input: '" + place.name + "'");
    $(".popContent h2").text("Change Location");
    $(".popContent span").text("");
    $(".popContent strong").text("No details available for input: '" + place.name + "'");
    $(".pop_up").show();
    return;
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
  }
});

function goBack(){
    window.andapp.closeApp();
}

var refreshOnForeground = function(){
    location.reload();
}

var locationChange = function(){}

$(".appointments").on("click", function(){
    $('body').addClass('bodyload');
    window.location.href = "appointments.html";
});
getServices();

/*menu circle part*/
var items = document.querySelectorAll('.circle a');
for(var i = 0, l = items.length; i < l; i++) {
  items[i].style.left = (50 - 35*Math.cos(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
  items[i].style.top = (50 + 35*Math.sin(-0.5 * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
}

document.querySelector('.menu-button').onclick = function(e) {
   e.preventDefault(); document.querySelector('.circle').classList.toggle('open');
}

var incr = -0.5;
var rotate = function(){
    setInterval(function(){
        for(var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35*Math.cos(incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            items[i].style.top = (50 + 35*Math.sin(incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
        }
        if (incr < -1 || incr > 1){
            incr = 1;
        }
        incr = incr - .1;
    }, 100);
}

var finspeed, slowat, toutspeed = 10;
var finishrotate = function(speed) {
    slowat = 28;

    var recfinish = function(){
        if (incr < -1 || incr > 1){
            incr = 1;
        }
        incr = incr - .01;
        if (direction){
            for(var i = 0, l = items.length; i < l; i++) {
                items[i].style.left = (50 - 35*Math.cos(-incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
                items[i].style.top = (50 + 35*Math.sin(-incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            }
        } else
        {
            for(var i = 0, l = items.length; i < l; i++) {
                items[i].style.left = (50 - 35*Math.cos(incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
                items[i].style.top = (50 + 35*Math.sin(incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            }
        }

        slowat = slowat - 1;
        if (slowat > 0){
            setTimeout(recfinish, ++toutspeed);
        }

    };
    setTimeout(recfinish, toutspeed)
}

var rotate1 = function(pdir){
    if (incr < -1 || incr > 1){
        incr = 1;
    }
    incr = incr - .01;
    if (pdir){
        for(var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35*Math.cos(-incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            items[i].style.top = (50 + 35*Math.sin(-incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
        }
    } else
    {
        for(var i = 0, l = items.length; i < l; i++) {
            items[i].style.left = (50 - 35*Math.cos(incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
            items[i].style.top = (50 + 35*Math.sin(incr * Math.PI - 2*(1/l)*i*Math.PI)).toFixed(4) + "%";
        }
    }
}

var direction = false;
var element = document.getElementsByClassName('m1'), lastx = undefined; lasty= undefined;
interact('.m1')
    .draggable({
        onmove: function(event) {
            if (event.clientX0 > event.clientX){
                direction = true;
                rotate1(true);
            } else {
                direction = false;
                rotate1(false);
            }
            lastx = event.clientX;
            lasty = event.clientY;
        },
        onend: function(event) {
            finishrotate(event.speed);
        }
    });
