var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.schejule.com:9095/";

var saveData = function(type){

	if($(".firstname").val() && $(".lastname").val() && $(".email").val() && $(".mobilenumber").val()){
	var udata = JSON.stringify({"firstname":$(".firstname").val(),"lastname":$(".lastname").val(),"email":$(".email").val(),"mobilenumber":$(".mobilenumber").val(), "notifications": true});
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
	    		//alert('Hi..');
	    		if (window.andapp){
					window.andapp.postJson('persistuser', udata);
				}
				window.location.href = "selectCatagory.html";
	    	}
	    });
	    request1.fail(function(jqXHR, textStatus) {
	        console.log(JSON.stringify(jqXHR));
	        alert('Error in user service call......');
	    });
	}else{
		console.log("fill all fields");
	}
}

$(".sub-btn").on("click", function(){
	saveData("saveenduser");
});