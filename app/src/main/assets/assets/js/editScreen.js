var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.within30.com/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;
var firstname, lastname, email, mobilenumber, userid;

if (window.andapp){
    firstname = window.andapp.getFirstname();
    lastname = window.andapp.getLastname();
    email = window.andapp.getEmail();
    mobilenumber = window.andapp.getMobile();
    userid = window.andapp.getUserId();
    $(".firstname").focus();
    $(".firstname").val(firstname);
    $(".lastname").focus();
    $(".lastname").val(lastname);
    $(".email").focus();
    $(".email").val(email);
    $(".mobilenumber").focus();
    var temp = '('+mobilenumber.substring(0,3)+') '+mobilenumber.substring(3,6)+'-'+mobilenumber.substring(6,10);
    $(".mobilenumber").val(temp);
    $('.mobilenumber').blur()
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

    if($(".mobilenumber").val().length != 14 || $(".mobilenumber").val().slice(0, 1) != "(" || $(".mobilenumber").val().slice(4, 6) != ") " || $(".mobilenumber").val().slice(9, 10) != "-"){
        $("#mobileError").show();
        errorCount++;
    }else{
        $("#mobileError").hide();
    }
    if(errorCount == 0)
        return true;
    else
        return false;
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
                window.location.href = "servicePage.html";
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
	/*window.location.href = "servicePage.html";*/
	history.back();
});

function goBack(){
    history.back();
}

var refreshOnForeground = function(){
    //location.reload();
}
var locationChange = function(){}
