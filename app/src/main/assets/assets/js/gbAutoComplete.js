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
    searchField.setAttribute('placeholder','search...');
    
    
    //append 
    thisId.appendChild(selectDiv);
    thisId.appendChild(searchField);
    thisId.appendChild(searchIcon);
    thisId.appendChild(mainCont);
    mainCont.appendChild(dropListDiv);
    
    
    //init
    init(obj.data)
    
    function init(data){
        
        //ajax call
        
        /*xhr = new XMLHttpRequest();
        url = servurl + "endpoint/api/getindiacities";
        xhr.onreadystatechange = function(){
            if(xhr.readyState ==4 && xhr.status ==200){
                mydata = JSON.parse(xhr.responseText);
                 
            }
        }
        xhr.open('post',url,true);
        xhr.send();*/
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
     //searchField.value = '';
     temp ='';
     myTemp(mydata);
    }
    
    searchField.onclick = function (e){
         e.stopPropagation();
        if(count == 0){
            thisId.className += ' open';
            count++;
        }else{
           thisId.className = 'autoCompeteDesign';
            count = 0; 
        }
        
        listHeight = globalUL.children[0].clientHeight;
        //console.dir(globalUL)
        
    }

    document.onclick = function(){
       if(count == 0){
            thisId.className += ' open';
            count++;
        }else{
           thisId.className = 'autoCompeteDesign';
            count = 0; 
        }
        
        listHeight = globalUL.children[0].clientHeight;
    }
    
    
    //filter
    
    searchField.onkeyup = function(e){
        e.stopPropagation();
        var e = e || window.event;
        
        if(e.keyCode != 38 && e.keyCode != 40){
             //preInd =0;
             //counter = 0;




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
            }/*else {
                height = 0;
                dropListDiv.scrollTop = 0;
            }*/
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
                 //searchField.value = '';
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
    
    $(".fa-pencil").on("click", function(){
        $("#serach").val("");
        $("#serach").focus();
    });
    var geocoder = new google.maps.Geocoder();
    var successFunction = function(pos){
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
        getLocation(latitude, longitude);
    }
    var errorFunction = function(err){
        //Dallas location.
        latitude = 32.7767;
        longitude = -96.7970;
        getLocation(latitude, longitude);
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
}