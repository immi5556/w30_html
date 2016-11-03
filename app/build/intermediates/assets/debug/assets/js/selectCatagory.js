var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.schejule.com:9095/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;
var cities = [];
var currentLocationName, gotUserLocation;
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
            if(gotUserLocation)
                currentLocationName = address_component.address_components[0].long_name;
            else
                currentLocationName = null;
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
		});
		getLocation(latitude, longitude);
    });
    request1.fail(function(jqXHR, textStatus) {
        console.log(textStatus);
    });
}
$(".categoryItem1, .categoryItem2, .categoryItem4, .categoryItem5").on("click", function(e){
    e.stopPropagation();
	alert("Currently not available. Launching Soon");
});
$(".categoryItem3").on("click", function(e){
    e.stopPropagation();
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
                window.andapp.updateLatLong(latitude, longitude);
            }
        }else{
            alert("Location not in records.");
            window.andapp.updateCurrentLocation();
            window.andapp.saveLocationType("true");
        }

    }
	window.location.href = "servicePage.html";
});

function gbAutoComplete(id,obj){
    var thisId = document.getElementById(id),
    selectDiv = document.createElement('div'),
    mainCont = document.createElement('div'),
    searchField = document.createElement('input'),
    searchIcon = document.createElement('i'),
    dropListDiv = document.createElement('div'),
    xhr,
    url,
    mydata,
    getULlist,
    getVal,
    count=0,
    counter =0,
    temp,
    preInd =0,thisIndx =0,
    globalUL=0,
    listHeight =0,
    scrollingHeight =0,
    height =0;

    selectDiv.innerHTML ='Select';
    selectDiv.className = 'selectableDiv';
    searchIcon.className = 'fa fa-pencil';
    mainCont.className = 'mainCont';
    dropListDiv.setAttribute('id','dropListDiv');
    searchField.setAttribute('id','serach');
    searchField.setAttribute('type','text');
    searchField.setAttribute('placeholder','Change Location');


    //append
    thisId.appendChild(selectDiv);
    thisId.appendChild(searchField);
    thisId.appendChild(searchIcon);
    thisId.appendChild(mainCont);
    mainCont.appendChild(dropListDiv);


    //init
    init(obj.data)

    function init(data){
        mydata = data;
        myTemp(mydata)
    }


    //temp

    function myTemp(mydata){
        temp ='<ul class="dropList">';

        for(var i=0; i < mydata.length; i++){
            temp +='<li>' + mydata[i].city + '</li>';
        }

        temp +='</ul>';

        dropListDiv.innerHTML = temp;

        getULlist = document.getElementsByClassName('dropList')[0].children;
        globalUL = document.querySelector('.dropList');

        for(var x=0; x < getULlist.length; x++ ){
           getULlist[x].onclick = function(){
               myChangeTextClick(this)
           }
       }
       if (counter === 0){
           getULlist[preInd].className = 'current';
       }


    }

    //events

    function myChangeTextClick(_this){
     var indText = _this.innerHTML;
     searchField.value =indText;
     thisId.className = 'autoCompeteDesign';
     preInd =0;
     counter = 0;
     count = 0;
     temp ='';
     myTemp(mydata);
    }

    searchField.onclick = function (e){
            e.stopPropagation();
            if(thisId.className != "autoCompeteDesign open"){
                if(count == 0){
                    thisId.className += ' open';
                    count++;
                }else{
                   thisId.className = 'autoCompeteDesign';
                    count = 0;
                }

                listHeight = globalUL.children[0].clientHeight;
            }
    }

    document.onclick = function(){
            thisId.className = 'autoCompeteDesign';
            count = 0;
            listHeight = globalUL.children[0].clientHeight;
    }


    //filter

    searchField.onkeyup = function(e){
        e.stopPropagation();
        var e = e || window.event;

        if(e.keyCode != 38 && e.keyCode != 40){
            if(this.value !='' && this.value !=' '){
                getVal = this.value;

                function getList(items){
                    return items.city.toLowerCase().indexOf(getVal.toLowerCase()) !==-1;
                }
                temp ='';
                var newobj = mydata.filter(getList);
                myTemp(newobj)

            }else {
                temp ='';
                myTemp(mydata);
            }
        }

    }


    //Arrow events

    document.onkeyup = arrowEvents;


    function arrowEvents(e){
        var e = e || window.event;
        preInd =counter;
        getULlist = document.getElementsByClassName('dropList')[0].children;
        listHeight = getULlist[0].clientHeight;

        if(e.keyCode == '38'){
             //up Arrow
            if(counter > 0){
                preInd = counter;
                getULlist[preInd].className = '';
                counter--;
                getULlist[counter].className = 'current';
                 enterKey(getULlist[counter]);
            }
            height = (listHeight) * (counter);
            if(height < dropListDiv.clientHeight){
                scrollingHeight -= listHeight;
                dropListDiv.scrollTop = scrollingHeight;
            }else {
                scrollingHeight = 0;
            }


        }else if(e.keyCode == '40'){
            //down Arrow
            if((counter+1) < getULlist.length){
                preInd = counter;
                getULlist[preInd].className = '';
                counter++;
                getULlist[counter].className = 'current';
                 enterKey(getULlist[counter]);
            }
            height = (listHeight) * (counter+1);
            if(height > dropListDiv.clientHeight){
                scrollingHeight += listHeight;
                dropListDiv.scrollTop = scrollingHeight;
            }else {
                scrollingHeight = 0;
            }
            enterKey(getULlist[counter])
        }

        //enter event
        enterKey(getULlist[counter]);
         function enterKey(_this){
                if (e.keyCode == '13'){
                 var indText = _this.innerText;
                 searchField.innerHTML =indText;
                 thisId.className = 'autoCompeteDesign';
                 count = 0;
                 preInd =0;
                 counter = 0;
                 temp ='';
                 myTemp(mydata);
                }
            }
    }

    $(".fa-pencil").on("click", function(e){
            e.stopPropagation();
            $("#serach").val("");
            $("#serach").focus();
            if(thisId.className != "autoCompeteDesign open"){
                searchField.click();
            }
    });
}

if (window.andapp){
    var json = window.andapp.getLatLong();
    JSON.parse(json, (key, value) => {
        if(key == "latitude"){
            latitude = value;
        }
        if(key == "longitude"){
            longitude = value;
        }
    });
    var locationType;
    if (window.andapp){
        locationType = window.andapp.getLocationType();
    }
    if(!locationType || locationType == "false"){
        var recentSearch;
        if (window.andapp){
            recentSearch = window.andapp.getRecentLocation();
            if(recentSearch){
                var geocoder =  new google.maps.Geocoder();
                geocoder.geocode( { 'address': recentSearch}, function(results, status) {
                      if (status == google.maps.GeocoderStatus.OK) {
                         latitude = results[0].geometry.location.lat();
                         longitude = results[0].geometry.location.lng();
                         successFunction();
                      } else {
                        console.log("Something got wrong " + status);
                      }
                });
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