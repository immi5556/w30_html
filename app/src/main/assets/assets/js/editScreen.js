var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.schejule.com:9095/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;

var updateData = function(type){
	//send _id which is saved in local DB.
	if($(".firstname").val() && $(".lastname").val() && $(".email").val() && $(".mobilenumber").val()){
		var request1 = $.ajax({
	        url: servurl + "endpoint/api/"+type,
	        type: "POST",
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
	        },
	        data: JSON.stringify({"_id":"", "firstname":$(".firstname").val(),"lastname":$(".lastname").val(),"email":$(".email").val(),"mobilenumber":$(".mobilenumber").val(), "notifications": $('#notify').is(':checked')}),
	        contentType: "application/json; charset=UTF-8"
	    });

	    request1.success(function(result) {
	    	if(result.Status == "Ok"){
	    		window.location.href = "selectCatagory.html";
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
//place back all the old values.
$(".repeat").on("click", function(){
	
});
$(".back").on("click", function(){
	window.location.href = "servicePage.html";
});