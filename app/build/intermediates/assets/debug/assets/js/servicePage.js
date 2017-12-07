var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.within30.com/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;
var cities = [];

$('.serviceSection').on('swipedown',function(){
	$('.serviceSection').css({
		height:"88px"
	});
	$('.directionArrowBottom').hide();
	$('.directionArrowTop').show();
} );
$('.serviceSection').on('swipeup',function(){
	$('.serviceSection').css({
		height:"330px"
	});
	$('.directionArrowTop').hide();
	$('.directionArrowBottom').show();
} );

$(".editProfile").on("click", function(){
    $('body').addClass('bodyload');
    if(window.andapp.checkInternet() == "true"){
		window.location.href = 'editScreen.html';
	}else{
	    window.andapp.saveLatestURL("editScreen.html");
		window.andapp.loadLocalFile();
	}
    /*if($(".user").hasClass("fa-user")){
        if(window.andapp.checkInternet() == "true"){
			window.location.href = 'https://www.within30.com/mobileapp/editScreen.html';
		}else{
		    window.andapp.saveLatestURL("https://www.within30.com/mobileapp/editScreen.html");
			window.andapp.loadLocalFile();
		}
    }else{
        if(window.andapp.checkInternet() == "true"){
			window.location.href = 'https://www.within30.com/mobileapp/selectCatagory.html';
		}else{
		    window.andapp.saveLatestURL("https://www.within30.com/mobileapp/selectCatagory.html");
			window.andapp.loadLocalFile();
		}
    }*/
});
$(".settings").on("click", function(){
    $('body').addClass('bodyload');
    if(window.andapp.checkInternet() == "true"){
		window.location.href = 'location.html';
	}else{
	    window.andapp.saveLatestURL("location.html");
		window.andapp.loadLocalFile();
	}
});
/*$(".menuList2, .menuList3, .menuList5, .menuList6, .menuList7").on("click", function(){
	alert("Not yet launched. Launching Soon.");
});*/