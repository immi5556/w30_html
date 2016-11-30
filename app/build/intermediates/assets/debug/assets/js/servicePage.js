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

$(".user").on("click", function(){
	window.location.href = "editScreen.html";
});

$(".menuList1").on("click", function(){
	window.location.href = "selectCatagory.html";
});
$(".settings").on("click", function(){
	window.location.href = "location.html";
});
/*$(".menuList2, .menuList3, .menuList5, .menuList6, .menuList7").on("click", function(){
	alert("Not yet launched. Launching Soon.");
});*/