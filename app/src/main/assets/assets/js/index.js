var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.schejule.com:9095/";
var mobilenumber;

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
        window.andapp.showToast("Enter 1 to 14 characters length.");
        return false;
    }

    if($(".lastname").val().length == 0 || $(".lastname").val().length > 14){
        window.andapp.showToast("Enter 1 to 14 characters length.");
        return false;
    }

    if(!checkEmailBox()){
        window.andapp.showToast("Enter valid emailId.");
        return false;
    }

    if($(".mobilenumber").val().length != 14 || $(".mobilenumber").val().slice(0, 1) != "(" || $(".mobilenumber").val().slice(4, 6) != ") " || $(".mobilenumber").val().slice(9, 10) != "-"){
        window.andapp.showToast("Enter 10-digit mobile number.");
        return false;
    }
    return true;
}

var saveData = function(type){

	if(validate()){
	    mobilenumber = $(".mobilenumber").val().substring(1,4)+$(".mobilenumber").val().substring(6,9)+$(".mobilenumber").val().substring(10,14);
	    console.log(mobilenumber);
	    var udata = JSON.stringify({"firstname":$(".firstname").val(),"lastname":$(".lastname").val(),"email":$(".email").val(),"mobilenumber":mobilenumber});
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
					window.andapp.postJson('persistuser', JSON.stringify({"firstname":$(".firstname").val(),"lastname":$(".lastname").val(),"email":$(".email").val(),"mobilenumber":mobilenumber, "_id": result._id}));
				    window.andapp.saveLocationType("true");
				}
				window.location.href = "selectCatagory.html";
	    	}
	    });
	    request1.fail(function(jqXHR, textStatus) {
	        console.log(JSON.stringify(jqXHR));
	    /*    alert('Error in user service call......');*/
	    });
	}else{
		console.log("fill all fields");
	}
}

$(".sub-btn").on("click", function(){
	saveData("saveenduser");
});

function goBack(){
    window.andapp.closeApp();
}