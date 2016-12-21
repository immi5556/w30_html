var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.within30.com/";
var mobilenumber;
window.andapp.saveLocationType("true");
window.andapp.updateCurrentLocation();

var checkEmailBox = function(){
    if (!$(".email").val())	{
        $(".email").css({
            'border-color': 'red'
        });
        $(".email").focus();
        return false;
    }else {
        var req = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!req.test($(".email").val())){
            $(".email").css({
                'border-color': 'red'
            });
            $(".email").focus();
            return false;
        }else{
            $(".email").css({
                'border-color': 'green'
            });
            return true;
        }
    }
}

var validate = function(){
    var errorCount = 0;
    if($(".firstname").val().length == 0){
        $("#firstNameError").show();
        errorCount++;
    }else{
         $("#firstNameError").hide();
    }

    if($(".lastname").val().length == 0){
        $("#lastNameError").show();
        errorCount++;
    }else{
         $("#lastNameError").hide();
    }

    if(!checkEmailBox()){
        $("#emailError").show();
        errorCount++;
    }else{
         $("#emailError").hide();
    }

    if($(".mobilenumber").val().length == 0){
        $("#mobileError").show();
        errorCount++
    }else{
         $("#mobileError").hide();
    }
    if(errorCount == 0)
        return true;
    else
        return false;
}

var saveData = function(type){
	if(validate()){
	    mobilenumber = $(".mobilenumber").val();
	    var latitude = Number(window.andapp.getLatitude());
        var longitude = Number(window.andapp.getLongitude());
	    var udata = JSON.stringify({"firstname":$(".firstname").val(),"lastname":$(".lastname").val(),"email":$(".email").val(),"mobilenumber":mobilenumber, "deviceToken": window.andapp.getTokenId(), "regLat": latitude, "regLng": longitude, "deviceType": "Android"});
		var request1 = $.ajax({
	        url: servurl + "endpoint/api/"+type,
	        type: "POST",
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
	        },
	        data: udata,
	        contentType: "application/json; charset=UTF-8"
	    });

	    request1.success(function(result) {
	    	if(result.Status == "Ok"){
	    		if (window.andapp){
					window.andapp.postJson('persistuser', JSON.stringify({"firstname":$(".firstname").val(),"lastname":$(".lastname").val(),"email":$(".email").val(),"mobilenumber":mobilenumber, "_id": result._id, "deviceToken": window.andapp.getTokenId()}));
				}
				window.location.href = "selectCatagory.html";
	    	}
	    });
	    request1.fail(function(jqXHR, textStatus) {

	        //console.log(JSON.stringify(jqXHR));
	    /*    alert('Error in user service call......');*/
	    });
	}else{
	    $('body').removeClass('bodyload');
		//console.log("fill all fields");
	}
}

$(".sub-btn").on("click", function(){
    $('body').addClass('bodyload');
	saveData("saveenduser");
});

function goBack(){
    window.andapp.closeApp();
}

var refreshOnForeground = function(){
    //location.reload();
}

var locationChange = function(){}