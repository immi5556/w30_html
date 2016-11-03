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
});
$(document).on('click','.fa-times',function(e){
     //e.stopPropagation();
	 $(this).removeClass('fa-times');
	 $(this).addClass('fa-bars');
	 /*$('nav').removeClass('fadeInLeft');
	 $('nav').addClass('fadeOutLeft');*/
	 $('.mynav').fadeOut();
});



var Wh = $(window).height() - 40;
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


var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

})(jQuery);