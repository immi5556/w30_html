var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.schejule.com:9095/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;
var firstname, lastname, email, mobilenumber, userid;

if (window.andapp){
    var json = window.andapp.getProfileData();
    JSON.parse(json, (key, value) => {
        if(key == "firstName"){
            firstname = value;
            $(".firstname").focus();
            $(".firstname").val(value);
        }
        if(key == "lastName"){
            lastname = value;
            $(".lastname").focus();
            $(".lastname").val(value);
        }
        if(key == "email"){
            email = value;
            $(".email").focus();
            $(".email").val(value);
        }
        if(key == "mobileNumber"){
            mobilenumber = value;
            $(".mobilenumber").focus();
            var temp = '('+mobilenumber.substring(0,3)+') '+mobilenumber.substring(3,6)+'-'+mobilenumber.substring(6,10);
            $(".mobilenumber").val(temp);
            $(document).click();
        }
        if(key == "userId"){
            userid = value;
        }

    });
}

function mobileNumberValidation(evt){
	var charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
         return false;

    if($(".mobilenumber").val().length < 14){
    	var key = evt.charCode || evt.keyCode || 0;
    	var $phone = $(".mobilenumber");

    	if (key !== 8 && key !== 9) {
    		if ($phone.val().length === 0) {
				$phone.val('('+ $phone.val());
			}
			if ($phone.val().length === 4) {
				$phone.val($phone.val() + ')');
			}
			if ($phone.val().length === 5) {
				$phone.val($phone.val() + ' ');
			}
			if ($phone.val().length === 9) {
				$phone.val($phone.val() + '-');
			}
		}
      	return true;
    } else if(evt.keyCode == 8 || evt.keyCode == 9){
    	return true;
    }else{
  		return false;
    }
}

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
    if($(".firstname").val().length == 0 || $(".firstname").val().length > 14){
        $(".firstname").css("border-color", "red");
        $(".firstname").focus();
        return false;
    }else{
        $(".firstname").css("border-color", "green");
    }

    if($(".lastname").val().length == 0 || $(".lastname").val().length > 14){
        $(".lastname").css("border-color", "red");
        $(".lastname").focus();
        return false;
    }else{
        $(".lastname").css("border-color", "green");
    }

    if(!checkEmailBox()){
        return false;
    }

    if($(".mobilenumber").val().length != 14 || $(".mobilenumber").val().slice(0, 1) != "(" || $(".mobilenumber").val().slice(4, 6) != ") " || $(".mobilenumber").val().slice(9, 10) != "-"){
        $(".mobilenumber").css("border-color", "red");
        $(".mobilenumber").focus();
        return false;
    }else{
        $(".mobilenumber").css("border-color", "green")
    }
    return true;
}

var updateData = function(type){

	if(validate()){
	    firstname = $(".firstname").val(),
	    lastname = $(".lastname").val(),
	    email = $(".email").val(),
        mobilenumber = $(".mobilenumber").val().substring(1,4)+$(".mobilenumber").val().substring(6,9)+$(".mobilenumber").val().substring(10,14);
        var udata = JSON.stringify({"firstname":firstname,"lastname":lastname,"email":email,"mobilenumber":mobilenumber, "_id": userid});
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
                    window.andapp.postJson('persistuser', udata);
                    window.andapp.showToast("Updated Successfully...");
                }
	    		/*window.location.href = "selectCatagory.html";*/
	    	}
	    });
	    request1.fail(function(jqXHR, textStatus) {
	        console.log(textStatus);
	    });
	}else{
		console.log("fill all fields");
	}
}

$(".updt").on("click", function(){
	updateData("updateenduser");
});

$(".repeat").on("click", function(){
	$(".closeIcon").click();
});
$(".back").on("click", function(){
	window.location.href = "servicePage.html";
});