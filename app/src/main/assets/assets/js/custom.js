(function(){/*
var w30Credentials = "win-HQGQ:zxosxtR76Z80";
var servurl = "https://services.schejule.com:9095/";     //"https://services.within30.com/"
var geocoder = new google.maps.Geocoder();
var latitude, longitude;
var cities = [];*/

$('.form-row input').each(function(){
	if($(this).val() > 0){
		$(this).closest('.form-row').addClass('focus');
		$(this).closest('.form-row').find('label').addClass('animated zoomOutLeft');
		$(this).closest('.form-row').find('.closeIcon').addClass('animated rotateIn');
	}else {
		$(this).closest('.form-row').removeClass('focus');
		$(this).closest('.form-row').find('label').removeClass('animated zoomOutLeft');
		$(this).closest('.form-row').find('label').addClass('animated zoomInRight');
		$(this).closest('.form-row').find('.closeIcon').removeClass('animated rotateIn');
		$(this).closest('.form-row').find('.closeIcon').addClass('animated rotateOut');
	}
})

$('.form-row input').focus(function(){
	$(this).closest('.form-row').addClass('focus');
	$(this).closest('.form-row').find('label').addClass('animated zoomOutLeft');
	$(this).closest('.form-row').find('.closeIcon').removeClass('animated rotateOut');
	$(this).closest('.form-row').find('.closeIcon').addClass('animated rotateIn');
	if($(this).val().length > 0){
		$(this).closest('.form-row').addClass('focus');
		$(this).closest('.form-row').find('label').addClass('animated zoomOutLeft');
		$(this).closest('.form-row').find('.closeIcon').removeClass('animated rotateOut');
	    $(this).closest('.form-row').find('.closeIcon').addClass('animated rotateIn');
	}
});
$('.form-row input').blur(function(){
	if($(this).val().length > 0){
		$(this).closest('.form-row').addClass('focus');

		$(this).closest('.form-row').find('label').removeClass('animated zoomInRight');
		$(this).closest('.form-row').find('label').addClass('animated zoomOutLeft');
		$(this).closest('.form-row').find('.closeIcon').removeClass('animated rotateOut');
		$(this).closest('.form-row').find('.closeIcon').addClass('animated rotateIn');
	}else {
		$(this).closest('.form-row').removeClass('focus');
		$(this).closest('.form-row').find('label').removeClass('animated zoomOutLeft');
		$(this).closest('.form-row').find('label').addClass('animated zoomInRight');
		$(this).closest('.form-row').find('.closeIcon').removeClass('animated rotateIn');
		$(this).closest('.form-row').find('.closeIcon').addClass('animated rotateOut');
	}
});

$('.closeIcon').on('click',function(){
	$(this).closest('.form-row').find('input').val('');
	$(this).closest('.form-row').removeClass('focus');
	$(this).removeClass('animated rotateIn');
	$(this).addClass('animated rotateOut');
	$(this).closest('.form-row').find('label').removeClass('animated zoomOutLeft');
	$(this).closest('.form-row').find('label').addClass('animated zoomInRight');
});

/*var numArray = [96,97,98,99,100,101,102,103,104,105,48,49,50,51,52,53,54,55,56,57],
getVal;

$('#mobile_in').keyup(function(e){

	var e = e || window.event;

	if(numArray.indexOf(e.keyCode) !=-1){
		getVal = $('#mobile_in').val();
	}else {
		$('#mobile_in').val('')
	}
});*/

$(document).on('click','.fa-bars',function(e){
     //e.stopPropagation();
	 $(this).removeClass('fa-bars');
	 $(this).addClass('fa-times');
	 /*$('nav').addClass('fadeInLeft');
	 $('nav').removeClass('fadeOutLeft');*/
	 $('.mynav').slideDown();
	 $(".pop_up").hide();
     $('.shadow').click();
});
$(document).on('click','.fa-times',function(e){
     //e.stopPropagation();
	 $(this).removeClass('fa-times');
	 $(this).addClass('fa-bars');
	 /*$('nav').removeClass('fadeInLeft');
	 $('nav').addClass('fadeOutLeft');*/
	 $('.mynav').fadeOut();
});

$('.mynav').fadeOut();

var Wh = $(window).height() - 45;
$('#map').height(Wh);

/*$("#rateYo").rateYo({
    rating: 3.6,
    starWidth: "10px"
  });*/


$('.directionArrowTop').on('click',function(){
	$('.serviceSection').animate({
		height:'330px'
	},500);
	$('.directionArrowTop').hide();
	$('.directionArrowBottom').show();
	$('.shadow').show();
});
$('.directionArrowBottom').on('click',function(){
	$('.serviceSection').animate({
		height:'115px'
	},500);
	$('.directionArrowBottom').hide();
	$('.directionArrowTop').show();
	$('.shadow').show();
});

$('.shadow').on('click',function(){
	$(".serviceSection").animate({height:'0'},500);
    $('.shadow').hide();
});
})(jQuery);