var subdomain = window.andapp.getSubdomain();
var adminState = window.andapp.getAdminState();

function goBack(){
    if($(".screen1").is(":visible")){
        window.andapp.saveAdminState("false");
        /*window.location.href = "selectCatagory.html";*/
        window.history.go(-1);
    }else{
        $('.clk-btn').click();
    }
}

$(".back").on("click", function(){
    goBack();
});
if(adminState && adminState == "true"){
    $(".signOut").on("click", function(){
        if(adminState && adminState == "true"){
            window.andapp.saveSubdomain("");
            window.andapp.saveAdminState("false");
        }
        goBack();
    });
}else{
    subdomain = window.andapp.getEndUserSubdomain();
    $(".signOut").hide();
}

$(function(){
    var servurl = "https://services.within30.com/";                //"https://services.schejule.com:9095/"
    var sockurl = "https://socket.within30.com/";                    //"https://util.schejule.com:9090/"
    var regisurl = 'https://registration.within30.com/';           //"https://registration.schejule.com:9091/"
    var schdlurl = 'https://schedule.within30.com/';               //"https://schedule.schejule.com:9092/"
    var w30Credentials = "win-HQGQ:zxosxtR76Z80";
    var abbrs = {
        EST : 'America/New_York',
        CST : 'America/Chicago',
        MST : 'America/Denver',
        PST : 'America/Los_Angeles',
        IST : "Asia/Kolkata"
    };
    var timezone = "IST";
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var appointmentCount = [0, 0, 0, 0, 0, 0, 0];
    var dayProgressValue = [0, 0, 0, 0, 0, 0, 0];
    var appointments = [];
    var daysOrder = ["", "", "", "", "", "", ""];
    var source = "mobileSchedulePage";
    var selectedDate, selectedCat;
    var optdata = {
        startTime: "07:00", // schedule start time(HH:ii)
        endTime: "21:00",   // schedule end time(HH:ii)
        overlap: true,
        overlapCount: 10,
        allowCustom: true,
        autoAcknowledge: true,
        defaultDuration: 30
    };
    var appointmentsData = [];
    var timeschd = [];
    var firstWorkingDay = 0;
    var editApt = false;
    var selectedApt;
    var socketio = io.connect(sockurl);
    
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    
	var today = new Date(),
    thisDate = today.getDate(),
    screenWidth = [768,600,480,360,320],
    Ww = (isMobile.any() ? screen.width : $(window).width()),
    Wh = (isMobile.any() ? screen.height : $(window).height()),
    maxSlides = 4,
    showItemsList = 4,
    timers;
    var setData = function (today,thisDate, index) {
        today = moment(moment(moment().tz(abbrs[timezone]).format()).format("YYYY-MM-DD")).add(index, 'd').format("YYYY-MM-DD");
        selectedDate = today;
		$('.heading').html(moment(today).format('MMMM Do, YYYY'));
		selectedDate = moment(today).format("YYYY-MM-DD");
		var todaysDay = moment(selectedDate).format("ddd");
		if(optdata.newTimings[todaysDay].length){
		    optdata.startTime = optdata.newTimings[todaysDay][0][0];
            optdata.endTime = optdata.newTimings[todaysDay][optdata.newTimings[todaysDay].length-1][1];   
		}
    };
	var dowArry   = new Array();
    var weekArry   = new Array();
    var holidayArry = new Array();
    var catag = new Array ();
    
    function dayLoop(dayArr,appendDiv,count){
       dowTemp='';
        dowTemp='<ul>';
        for(var i=0; i < dayArr.length; i++){
            if('.catagories' == appendDiv){
                var wid = $('.catagories').width() / count;
                dowTemp +='<li style="width:'+wid+'px"><a href="javascript:void(0)">'+dayArr[i]+'</a></li>';
            }else{
                var wid = 100 / 7;
                if(appendDiv == '.dow' && holidayArry[i]){
                    dowTemp +='<li class="dayDisable" style="width:'+wid+'%"><span>'+dayArr[i]+'</span></li>';   
                }else{
                    dowTemp +='<li style="width:'+wid+'%"><span>'+dayArr[i]+'</span></li>';   
                }
            }
        }
        dowTemp+='</ul>';
        $(appendDiv).html(dowTemp);
        if('.catagories' == appendDiv){
            catage(appendDiv,count);
        }
    }
    
    function catage(ele,showItems){
        if($('.container-wrap').width() != 0){
            var count =0,
            scrollCompleted = true,
            scrollItems = 1,
            scrollSpeed = 300,
            item =  $(ele).find('li'),
            margin = parseInt($(item).first().css('margin-right')),
            listLength = $(item).length,
            margin = parseInt($(item).first().css('margin-right')),
            firstLI = $('.container-wrap').width() / showItems;
        
            $(".catagories ul").css({
                left: 0
              });
            
             for(var i=0; i < item.length; i++){
                $(item[i]).width(firstLI);
            }
            $('.catagories ul').width(firstLI * listLength);
            $(".catagories").swipe( {
                //Single swipe handler for left swipes
                swipeLeft:function() {
                    slideNEXT();
                },
                swipeRight:function() {
                    slidePREV();
                }
            });
            
            function slideNEXT (){
                if(scrollCompleted){
                    if(count < ( listLength - showItems)){
                        count += scrollItems;
                        scrollCompleted = false;
                        $(".catagories ul").animate({ left: - count * firstLI},scrollSpeed,function(){
                            scrollCompleted = true;
                        })
                    }else {
                        count = 0;
                        $(".catagories ul").animate({
                           left:0
                        });
                    }
                }
            }
            
            function slidePREV (){
                if(scrollCompleted){
                    if(count > 0){
                        count -= scrollItems;
                        scrollCompleted = false;
                        $(".catagories ul").animate({ left: - count * firstLI},scrollSpeed,function(){
                            scrollCompleted = true;
                        })
                    }else {
                        count = 0;
                        $(".catagories ul").animate({
                           left:0
                        });
                    }
                }
            }    
        }  
    };
    
    screenSizeFn();
    function screenSizeFn(){
        if(isMobile.any()){
            $(window).on("orientationchange",function(){
                clearInterval(timers);
                doResize();
            })
          }else {
            $(window).on("resize",function() {
                clearInterval(timers);
                doResize();
            })
          }
        window.onresize = function(){
            clearInterval(timers)
            doResize();
        }
        //Window Resize
        doResize();
        function doResize(){
            timers= setTimeout(function(){
                  Ww = (isMobile.any() ? screen.width : $(window).width());
                  Wh = (isMobile.any() ? screen.height : $(window).height());
                  if(Ww > screenWidth[0]){
                    showItems = maxSlides;
                  }
                  if(Ww <= screenWidth[0]){
                    showItems = maxSlides;
                  }
                  if(Ww <= screenWidth[1]){
                    showItems = maxSlides-1;
                  }
                  if(Ww <= screenWidth[2]){
                    showItems = maxSlides-1;
                  }
                showItemsList = showItems;
                catage(".catagories",showItemsList);
           },1000)
        }
    }
    
    
    function clickFn(arr,divElem){
        var dates = $(divElem).find('li');
        if(dates.length){
            if(divElem != '.weekSec'){
                $(dates[0]).addClass('active');
            }  
        }
        var firstEntry = -1;
        dates.each(function(i, item){
            $(item).on('click',function(){
                $(".content").html("");
                if(!$(this).hasClass("dateDisable")){
                    $(dates).removeClass('active');
                    $(this).addClass('active');
                    if('.catagories' == divElem){
                        timeSchdule(timeschd);
                        bookSltClassFn();
                        timesheet();
                    }else{
                        var crDate = $(this).text();
                        if(firstWorkingDay == 0)
                            setData(today,crDate, i);  
                        else
                            setData(today,crDate, (i+1));
                    }   
                }
                if(divElem == '.weekSec'){
                    timeSchdule(timeschd);
                }
                if(divElem == '.catagories' && $(item).hasClass("active"))
                    selectedCat = $(item).text();
            });  
            if(divElem == '.weekSec' && holidayArry[i]){
                $(item).addClass("dateDisable");
                $(item).removeClass("active");
            }else if(divElem == '.weekSec' && firstEntry == -1 && !holidayArry[i]){
                $(item).addClass("active");
                firstEntry = i+1;
                if(firstWorkingDay != 0)
                    setData(today,thisDate, i+1);
                else
                    setData(today,thisDate, i);
            }
            if(divElem == '.catagories' && $(item).hasClass("active")){
                selectedCat = $(item).text();
            }
        });
    }
     
    function timeSchdule(timeschd){
        var temp='',
        tempSchedTem ='',
        count=10,
        pageNum = 0,
        Timeele;

        timeFn(timeschd);

        function timeFn(timeschd){
            temp='';
            tempSchedTem ='';
            temp ='<ul>';
            var i= 0;
            if(optdata.newTimings[days[moment(selectedDate).day()]].length){
                var dayStartTime = Number(optdata.newTimings[days[moment(selectedDate).day()]][0][0].split(":")[0]);
                var dayEndTime = Number(optdata.newTimings[days[moment(selectedDate).day()]][0][1].split(":")[0]);
                for(var x = dayStartTime; x <= dayEndTime; x++){
                    if(x < 10)
                        tempSchedTem +='<div class="schdSec" ><span class="timeT">0'+x+':00</span><div class="events-scroll"><div class="events-container"></div></div></div>';
                    else
                        tempSchedTem +='<div class="schdSec" ><span class="timeT">'+x+':00</span><div class="events-scroll"><div class="events-container"></div></div></div>';
                } 
            }
            
            $('.content').html(tempSchedTem);
            var dataRow = $('.content').find('.events-container');
            timesheet();
            ajaxCall("getappts", {}, getApptsAck);
            bookSltClassFn();
        }
    }
    
    function buildEvent(data){
        var names = data.eventName ? data.eventName.split(' ') : "";
        var nameVal = names.length > 1 ? names[0].substring()[0] + names[1].substring()[0] : (names[0] ? names[0].substring()[0] : "");
        var cls = data.status ? 'confirm' : 'notConfirmed';
        var tt = $('<div class="eveClass"></div>');
        var tt1 = $('<span data-id="#light1" class="click '+cls+'" style="height:'+ data.hVal+'%"><strong class="evName">'+nameVal+'</strong></span>');
        tt1.data("eventdata", data);
        tt.append(tt1);
        return tt;
    }

    function eventsFn(dat,dataRow){
        if(dataRow){
            for(var x = 0; x < dat.length; x++){
            if(dat[x] != undefined){
                    var ev ='';
                     dat[x].events.sort(function(a,b){
                     var AobjVal = a.startT ? a.startT.toLowerCase() : a.startT;
                     var BobjVal = b.startT ? b.startT.toLowerCase() : b.startT;

                     /* var x = new Date(AobjVal);
                      var y = new Date(BobjVal);*/

                        if(AobjVal > BobjVal){
                            return 1
                        }else if(AobjVal < BobjVal){
                            return -1
                        }else {
                           return 0
                        }

                     });
                    for(var y=0; y < dat[x].events.length; y++){
                        if(selectedCat == dat[x].events[y].catagory && selectedDate == dat[x].events[y].selectedDate){
                            var h =0;
                            var hVal = 0;
                            var stVal = parseInt(dat[x].events[y].startT);
                            var endVal = parseInt(dat[x].events[y].endT.split(":")[1]) == 0 ? 1 : parseInt(dat[x].events[y].endT.split(":")[1]);
                            var minutes = 0;
                            var s = dat[x].events[y].startT.split(':');
                            var e = dat[x].events[y].endT.split(':');
                            minutes += (e[0] - s[0]) * 60;
                            if(e[1] > s[1])
                                minutes += e[1] - s[1];
                            else
                                minutes -= s[1] - e[1];
                                
                            h = 60 / minutes;
                            hVal = 100 / h;
                            if(minutes > 60)
                                hVal = 100;
                            dat[x].events[y].hVal = hVal;
                            var timeLine = dat[x].events[y].startT.split(":")[0];
                            var dayStartTime = Number(optdata.newTimings[days[moment(selectedDate).day()]][0][0].split(":")[0]);
                            var dayEndTime = Number(optdata.newTimings[days[moment(selectedDate).day()]][0][1].split(":")[1]) > 0 ? (Number(optdata.newTimings[days[moment(selectedDate).day()]][0][1].split(":")[0])+1) : Number(optdata.newTimings[days[moment(selectedDate).day()]][0][1].split(":")[0]);
                            for(var v = dayStartTime, z = 0; v <= dayEndTime; v++, z++){
                                if(v == Number(timeLine)){
                                    $(dataRow[z]).append(buildEvent(dat[x].events[y]));
                                    var child = $(dataRow[z]).find('.eveClass').length;
                                    $(dataRow[z]).width(child * 36);
                                    break;
                                }
                            }   
                        }
                    }
            }

        }

          Timeele = $(dataRow);
            eveDes(Timeele,dat);
         }  
    }
    
    function eveDes(ele,dataArr){
        $(ele).each(function(ind,eles){
           $(this).find('.eveClass').each(function(e){
               $(this).find('span').swipe( {
                  tap:function() {
                    if(adminState == "true"){
                        selectedApt = $(this);
                        var dat = $(this).data("eventdata");
                        $("#SfromTime").val(dat.startT);
                        $("#StoTime").val(dat.endT);
                        $("#Sname").val(dat.eventName);
                        $("#Semail").val(dat.email);
                        $("#Smobile").val(dat.mobile);
                        $("#Sdetails").val(dat.descrip);
                        $("#Sconfn").prop("checked", dat.status);
                        $("#Sid").val(dat.id);
                        $("#cncl-schd").closest("div").show();
                    }
                }
            });
           });
        });

    }
    
    function bookSltClassFn(){
        var bookSlotEle = $('<span class="bookSlotPop">Book Slot</span>');
        var timeRow = $('.content').find('.schdSec');
        $(timeRow[2]).addClass('bookSlot');
        $('.bookSlot').append(bookSlotEle);
        setTimeout(function(){
            $(timeRow).removeClass('bookSlot');
            $(bookSlotEle).remove();
        },3000)
    }
    		
    function timesheet(){		
        var timeRow = $('.content').find('.schdSec');		
        $(timeRow).each(function(ind,ele){		
            $(ele).on('click',function(e){
                $('.slotDetails').addClass('fadeInUp');		
                $('.slotDetails').show();
                $(".catagories ul li").each(function(idx, item){
                    if($(item).hasClass("active")){
                        $(".slotHeadSec h2").text($(item).text());
                    }
                });
                if(optdata.autoAcknowledge){
        	        $("#Sconfn").prop("checked", true);
        	        $("#Sconfn").prop("disabled", "disabled");
        	    }else{
        	        $("#Sconfn").prop("checked", true);
        	        $("#Sconfn").prop("disabled", "");
        	    }
                setTimeout(function(){		
                    $(".screen1").hide();	
                },1000);  
                if(e.target.className == "events-scroll" || e.target.className == "schdSec"){
                    $("#cncl-schd").closest("div").hide(); 
                }
                if(!optdata.allowCustom){
                    $('#StoTime').prop("disabled", "disabled");
                }else{
                    $('#StoTime').prop("disabled", "");
                }
            });		
        })		
    }		
	function emptyForm(){
	    $("#SfromTime").val("");
	    $("#StoTime").val("");
	    $("#Sname").val("");
	    $("#Semail").val("");
	    $("#Smobile").val("");
	    $("#Sdetails").val("");
	    $("#Sconfn").prop("checked", false);
	    $("#Sid").val("");
	}	
    $('.clk-btn').on('click',function(){		
        $('.slotDetails').removeClass('fadeInUp');		
        $('.slotDetails').addClass('fadeOutDown');		
	    $(".screen1").show();
	    emptyForm();
        setTimeout(function(){		
            $('.slotDetails').removeClass('fadeOutDown');		
            $('.slotDetails').hide();		
        },500);
    });		
    var input = $('#SfromTime');		
	input.clockpicker({		
	    autoclose: true,
	    align: 'left'
	});
	input.on("focusout", function(){
	    if(!optdata.allowCustom){
	        var fromTime = ($(this).val() && $(this).val().indexOf(":") > -1 ) ? $(this).val().split(":") : "";
    	    if(fromTime.length){
    	        fromTime[1] = Number(fromTime[1]) + Number(optdata.defaultDuration);
    	        while(fromTime[1] >= 60){
    	            fromTime[0] = Number(fromTime[0]) + 1;
    	            fromTime[1] -= 60;
    	        }
    	        if(fromTime[0] < 10 && fromTime[0].toString().length != 2){
    	            fromTime[0] = "0"+fromTime[0];
    	        }
    	        if(fromTime[1] < 10 && fromTime[1].toString().length != 2){
                    fromTime[1] = "0"+fromTime[1];
                }
    	        $('#StoTime').val(fromTime[0]+":"+fromTime[1]); 
    	    }
    	      
	    }
	});
    var input1 = $('#StoTime');		
	input1.clockpicker({		
	    autoclose: true,
	    align: 'right'
	});
    valid();		
    		
    function valid(){		
        var isTrue = false,		
            msg,		
            SfromTime = $('#SfromTime'),		
            StoTime = $('#StoTime'),		
            Sname = $('#Sname'),		
            Semail = $('#Semail'),		
            Smobile = $('#Smobile'),		
            Sdetails = $('#Sdetails'),		
            Sconfn = $('#Sconfn');		
        		
        function flag(isTrue,msg){		
            if(isTrue){		
               $('#errormsg').show();
               $(".errMsg").html(msg);
            }		
            //setTimeout(function(){		
                 //$('#errormsg').hide();		
            //},3000);		
        }	
        $('.cls-notification').on('click',function(){
            $('#errormsg').hide();
            $('#successmsg').hide();
        });
        		
        $('#sub-schd').on('click',function(){		
            if(SfromTime.val() =='' || SfromTime.val().length != 5 || SfromTime.val().indexOf(":") == -1 || isNaN(SfromTime.val().split(":")[0]) || isNaN(SfromTime.val().split(":")[1])){		
                isTrue = true;		
                msg = 'Select Proper from time from Time Picker';		
                flag(isTrue,msg);	
                return false;
            }else if(StoTime.val() =='' || StoTime.val().length != 5 || StoTime.val().indexOf(":") == -1 || isNaN(StoTime.val().split(":")[0]) || isNaN(StoTime.val().split(":")[1])){		
                isTrue = true;		
                msg = 'Select Proper to time from Time Picker';	
                flag(isTrue,msg); 
                return false;
            }
            if(SfromTime.val() > StoTime.val()){
                isTrue = true;		
                msg = 'Start time is greater than end time';		
                flag(isTrue,msg);	
                return false;
            }
            if(selectedDate == moment(moment().tz(abbrs[timezone]).format()).tz(abbrs[timezone]).format("YYYY-MM-DD")){
                if(SfromTime.val() < moment(moment().tz(abbrs[timezone]).format()).tz(abbrs[timezone]).format("HH:mm")){
                    isTrue = true;		
                    msg = 'Start time is already finished.';		
                    flag(isTrue,msg);	
                    return false;
                }
            }
            if(SfromTime.val() < optdata.startTime){
                isTrue = true;		
                msg = 'Start time is out of business hours.';		
                flag(isTrue,msg);	
                return false;
            }
            if(StoTime.val() > optdata.endTime){
                isTrue = true;		
                msg = 'end time is out of business hours.';		
                flag(isTrue,msg);	
                return false;
            }
            var req = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (optdata.contactMandatory){
                if (!Sname.val()){
                    isTrue = true;		
                    msg = 'Please enter your Name';		
                    flag(isTrue,msg); 
                    return false;
                }
                if (Smobile.val().length != 10){
                    isTrue = true;		
                    msg = 'Please enter your 10-digit Mobile Number';	
                    flag(isTrue,msg); 
                    return false;
                }
                if(Semail.val() && !req.test(Semail.val())){
                    isTrue = true;		
                    msg = 'Please enter proper EmailId';	
                    flag(isTrue,msg); 
                    return false;
                }
            }else{
                if (Sname.val() && Sname.val().length > 20){
                    isTrue = true;		
                    msg = 'Name cannot be more than 20 characters.';		
                    flag(isTrue,msg); 
                    return false;
                }
                if(Semail.val() && !req.test(Semail.val())){
                    isTrue = true;		
                    msg = 'Please enter proper EmailId';	
                    flag(isTrue,msg); 
                    return false;
                }
            }
            var minutes = 0;
            var s = $("#SfromTime").val().split(':');
            var e = $("#StoTime").val().split(':');
            minutes += (e[0] - s[0]) * 60;
            if(e[1] > s[1])
                minutes += e[1] - s[1];
            else
                minutes -= s[1] - e[1]; 
            
            var timeline = 0;
            optdata.rows.forEach(function(item, idx){
                if(item.title == $(".slotHeadSec h2").html()){
                    timeline = idx;
                }
            });
            if($("#Sid").val().length){
                //Update Appointment
                var id = $("#Sid").val();
        	    updateSlot($("#Semail").val(), $("#Smobile").val(), $("#SfromTime").val(), minutes, $("#Sconfn").is("checked"), $("#Sdetails").val(), $("#Sname").val(), id, timeline);
            }else{
                //Create appointment
        	    bookSlot($("#Semail").val(), $("#Smobile").val(), $("#SfromTime").val(), minutes, timeline, $("#Sconfn").is("checked"), $("#Sdetails").val(), $("#Sname").val());
            }
        });
    }
    
    $("#cncl-schd").on("click", function(){
        //Delete Appointment
        $('body').addClass('bodyload');
        var id = $("#Sid").val();
        var request1 = $.ajax({
	 		url: servurl + "endpoint/api/deleteslot",
			type: "POST",
            beforeSend: function (xhr) {
            	xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
            },
            data: JSON.stringify({"subDomain":subdomain, "id": id}),
            contentType: "application/json; charset=UTF-8"
        });

        request1.success(function(result) {
            $('body').removeClass('bodyload');
        	if(result.Status == "Success"){
        	    $('#successmsg').show();
        	    $(".sucsMsg").html("Successfully Cancelled the Appointment.");
        	    setTimeout(function(){		
                    $('#successmsg').hide();		
                },3000);
                $(".clk-btn").click();
                //selectedApt.closest(".eveClass").remove();
                timeschd[0].events.forEach(function(item, index){
                    if(item.id == id){
                        timeschd[0].events.splice(index, 1);
                    }
                });
                $('.content').find('.events-container').each(function(ind,eles){
                    $(eles).find('.eveClass').each(function(e){
                        var dat = $(this).find('span').data("eventdata");
                        if(dat.id == id){
                            $(this).remove();  
                            var child = $(eles).find('.eveClass').length;
                            $(eles).width(child * 36);
                        }
                   })
                });  
                socketio.emit("deleteAppointment", {"room":subdomain, "id": id});
        	}else{
        	    $('#errormsg').show();
                $(".errMsg").html("Not able to cancel Appointment. Try Again.");
        	}
        });
        request1.fail(function(jqXHR, textStatus) {
            $('body').removeClass('bodyload');
        	$('#errormsg').show();
            $(".errMsg").html("Error Occured. Try Again.");
        });
    });
    
    function updateSlot(email, mobile, startTime, minutes, confirm, details, name, id, timeline){
        $('body').addClass('bodyload');
	 	var today  = moment.tz(abbrs[timezone]).format("YYYY-MM-DD");
	    var request1 = $.ajax({
	 		url: servurl + "endpoint/api/updateslot",
			type: "POST",
            beforeSend: function (xhr) {
            	xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
            },
            data: JSON.stringify({"subDomain":subdomain,"date":selectedDate +" "+ startTime,"email":email,"mobile":mobile,"minutes":minutes, "userId":"", "sourceUsed": "AndroidAdminPage", "confirm": confirm, "details": details, "name": name, "id": id, "timeline": timeline}),
            contentType: "application/json; charset=UTF-8"
        });

        request1.success(function(result) {
            $('body').removeClass('bodyload');
        	if(result.Status == "Success"){
        	    $('#successmsg').show();
        	    $(".sucsMsg").html("Successfully updated.");
        	    setTimeout(function(){		
                    $('#successmsg').hide();		
                },3000);
        	    $(".clk-btn").click();
        	    var newObj = {
                    "startT": result.Data.data.startTime,
                    "endT": result.Data.data.endTime,
                    "eventName": result.Data.data.data.name,
                    "descrip": result.Data.data.data.details,
                    "email": result.Data.data.data.email,
                    "mobile": result.Data.data.data.mobile,
                    "catagory": timeline,
                    "selectedDate": result.Data.selecteddate,
                    "status": result.Data.data.confirm,
                    "id": result.Data._id
                };
    	        timeschd[0].events.forEach(function(item, index){
    	            if(item.id == id){
    	                timeschd[0].events[index] = newObj;
    	            }
    	        });
                var h = 60 / minutes;
                var hVal = 100 / h;
                if(minutes > 60)
                    hVal = 100;
                var names = result.Data.data.data.name ? result.Data.data.data.name.split(' ') : result.Data.data.data.name;
                var nameVal = names.length > 1 ? names[0].substring()[0] + names[1].substring()[0] : (names[0] ? names[0].substring()[0] : "");
                var cls = newObj.status ? 'confirm' : 'notConfirmed';
                selectedApt.removeClass('confirm notConfirmed');
                selectedApt.addClass(cls);
                selectedApt.css("height", hVal+"%");
                selectedApt.find(".evName").text(nameVal);
                selectedApt.data("eventdata", newObj);
                socketio.emit("updateAppointment", result.Data);
        	}else{
        	    $('#errormsg').show();
                $(".errMsg").html(result.Message);
        	}
        });
        request1.fail(function(jqXHR, textStatus) {
            $('body').removeClass('bodyload');
        	$('#errormsg').show();
            $(".errMsg").html("Error Occured. Try Again.");
        });
    }
    
    function bookSlot(email, mobile, startTime, minutes, timeline, confirm, details, name){
        $('body').addClass('bodyload');
	 	var today  = moment.tz(abbrs[timezone]).format("YYYY-MM-DD");
	    var request1 = $.ajax({
	 		url: servurl + "endpoint/api/bookslot",
			type: "POST",
            beforeSend: function (xhr) {
            	xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
            },
            data: JSON.stringify({"subDomain":subdomain,"date":selectedDate +" "+ startTime,"email":email,"mobile":mobile,"minutes":minutes, "userId":"", "timeline": timeline, "sourceUsed": "AndroidAdminPage", "confirm": confirm, "details": details, "name": name}),
            contentType: "application/json; charset=UTF-8"
        });

        request1.success(function(result) {
            $('body').removeClass('bodyload');
        	if(result.Status == "Ok"){
        	    $('#successmsg').show();
        	    $(".sucsMsg").html(result.Message);
        	    setTimeout(function(){		
                    $('#successmsg').hide();		
                },3000);
        	    $(".clk-btn").click();
        	    var newObj = {
                    "startT": result.Data.data.startTime,
                    "endT": result.Data.data.endTime,
                    "eventName": result.Data.data.data.name,
                    "descrip": result.Data.data.data.details,
                    "email": result.Data.data.data.email,
                    "mobile": result.Data.data.data.mobile,
                    "catagory": timeline,
                    "selectedDate": result.Data.selecteddate,
                    "status": result.Data.data.confirm,
                    "id": result.Data._id
                };
    	        timeschd[0].events.push(newObj);
                newBooking(newObj);
                socketio.emit("newAppointment", result.Data);
        	}else{
        	    $('#errormsg').show();
                $(".errMsg").html(result.Message);
        	}
        });
        request1.fail(function(jqXHR, textStatus) {
            $('body').removeClass('bodyload');
        	$('#errormsg').show();
            $(".errMsg").html("Error Occured. Try Again.");
        });
    }
    
    var newBooking = function(newObj){
        var dataRow = $('.content').find('.events-container');
        var h =0;
        var hVal = 0;
        var stVal = parseInt(newObj.startT);
        var endVal = parseInt(newObj.endT.split(":")[1]) == 0 ? 1 : parseInt(newObj.endT.split(":")[1]);
        var minutes = 0;
        var s = newObj.startT.split(':');
        var e = newObj.endT.split(':');
        minutes += (e[0] - s[0]) * 60;
        if(e[1] > s[1])
            minutes += e[1] - s[1];
        else
            minutes -= s[1] - e[1];
            
        h = 60 / minutes;
        hVal = 100 / h;
        if(minutes > 60)
            hVal = 100;
        newObj.hVal = hVal;
        var timeLine = newObj.startT.split(":")[0];
        var dayStartTime = Number(optdata.newTimings[days[moment(selectedDate).day()]][0][0].split(":")[0]);
        var dayEndTime = Number(optdata.newTimings[days[moment(selectedDate).day()]][0][1].split(":")[1]);
        for(var v = dayStartTime, z = 0; v <= dayEndTime; v++, z++){
            if(v == Number(timeLine)){
                $(dataRow[z]).append(buildEvent(newObj));
                eveDes($(dataRow),"");
                var child = $(dataRow[z]).find('.eveClass').length;
                $(dataRow[z]).width(child * 36);
                break;
            }
        }  
    }
    
    var ajaxCall = function(action, data, callback){
        $('body').addClass('bodyload');
        var bb = {
            action: action,
            selecteddate: selectedDate,
            subdomain: subdomain, 
            data: data
        }
        var temp = timezone;
        $.ajax({
            url: schdlurl+"endpoint/" + action,
            type: "POST",
            data: JSON.stringify(bb),
            contentType: "application/json; charset=UTF-8",
            success: function(result) {
                $('body').removeClass('bodyload');
                if (callback){
                    callback(result);
                }
            },
            fail: function(jqXHR, textStatus) {
                $('body').removeClass('bodyload');
                alert("Error occured");
            }
        });
    }
    
    var setDates = function(){
        holidayArry = [];
        dowArry = [];
        weekArry = [];
        
        var day = moment(now).day();
        var now = moment().tz(abbrs[timezone]).format();
        firstWorkingDay = 0;
        if(optdata.endTime.length && moment().tz(abbrs[timezone]).format("HH:mm") > optdata.endTime ){
            now = moment().tz(abbrs[timezone]).add(1, 'day').format();
            day = moment(now).day();
            firstWorkingDay = 1;
        }
        selectedDate = moment(now).format("YYYY-MM-DD");
        var tddt = moment(now).date();
        var tdm = (moment(now).month() + 1);
        var dt = new Date(moment(now).year(), tdm, 0);
        var monthDays = dt.getDate();
        var mmtdt = selectedDate;
        var count = day;
        for (i = 0; i < 7; i++) {
            var tdd = days[day];
            var today = days[count];
            if(optdata.newTimings[today].length == 0){
                holidayArry.push(true);
            }else{
                holidayArry.push(false);
            }
            daysOrder[i] = tdd.toLowerCase();
            dowArry.push(days[day]);
            weekArry.push(moment(mmtdt).add(i, 'd').date());
            count++;
            if(count > 6){
                count = 0;
            }
            day++;
            if (day > 6) {
                day = 0;
            }
        }
        if(firstWorkingDay != 0){
            var todaysDay, fstDay = 0;
            daysOrder.forEach(function(item, index){
                if(fstDay == 0){
                    now = moment().tz(abbrs[optdata.timeZone]).add(index+1, 'day').format();
                    day = moment(now).day();
                    selectedDate = moment(now).format("YYYY-MM-DD");
                    todaysDay = moment(selectedDate).format("ddd");
                    if(optdata.newTimings[todaysDay].length){
                        firstWorkingDay = index+1;
                        fstDay = index+1;
                    }
                }
            });
            
            if(optdata.newTimings[todaysDay].length){
                optdata.startTime = optdata.newTimings[todaysDay][0][0];
                optdata.endTime = optdata.newTimings[todaysDay][optdata.newTimings[todaysDay].length-1][1];    
            }
            setData(today,thisDate, firstWorkingDay);
        }else{
            setData(today,thisDate, 0);
        }
        var weekDay = dayLoop(dowArry,'.dow');
        var weekDates = dayLoop(weekArry,'.weekSec');
        var weekDates = dayLoop(catag,'.catagories',showItemsList);
        //ClickFn
        var weekDates2 = clickFn(weekArry,'.weekSec');
        var weekDAYS = clickFn(catag,'.catagories');
        timeSchdule(timeschd);
    }
    
    var getApptsAck = function(result){
        appointmentsData = [];
        timeschd = [
            {
                "events": []
            }
        ];
        appointmentsData = result;
        appointmentsData.forEach(function(item, index){
                timeschd[0].events.push({
                    "startT": item.data.startTime,
                    "endT": item.data.endTime,
                    "eventName": item.data.data.name,
                    "descrip": item.data.data.details,
                    "email": item.data.data.email,
                    "mobile": item.data.data.mobile,
                    "catagory": optdata.rows[item.data.timeline].title,
                    "selectedDate": item.selecteddate,
                    "status": item.data.confirm,
                    "id": item._id
                }); 
        });
        var dataRow = $('.content').find('.events-container');
        eventsFn(timeschd,dataRow);
    }
    
    var getresourcesAck = function(result){
        var schData = [];
        catag = [];
        (result.specialities || []).forEach(function(item, idx){
            if(item.enable){
                catag.push(item.name);
            }
            var tt = {
                title: item.name,
                mins: item.mins,
                url: item.icon,
                enable: item.enable,
                resources: []
            };
            (item.resources || []).forEach(function(item1, idx1){
                tt.resources.push({
                    title: item1.name,
                    mins: item1.mins,
                    url: item1.icon
                });
            });
            schData.push(tt);
        });
        optdata.rows = schData;
        optdata.businessType = result.businessType;
        optdata.overlap = result.overlap;
        optdata.overlapCount = result.concurrentCount;
        optdata.allowCustom = result.allowCustom;
        optdata.autoAcknowledge =  result.autoAcknowledge;
        optdata.defaultDuration = result.defaultDuration;
        optdata.contactMandatory = result.contactMandatory;
        optdata.timeZone = result.timeZone;
        optdata.newTimings = result.timings;       
        optdata.companyEmail = result.companyEmail;
        optdata.allowICS = result.allowICS;
        var address = "";
        if(result.geo.address.premise)
            address += result.geo.address.premise+", ";
        if(result.geo.address.sublocality)
            address += result.geo.address.sublocality+", ";
        if(result.geo.address.city)
            address += result.geo.address.city+", ";
        if(result.geo.address.state){
            address += result.geo.address.state;
        }else{
            if(address.length)
                address = address.substring(0, address.length - 2);
        }
        optdata.address = address;
        optdata.latitude = result.geo.coordinates[1];
        optdata.longitude = result.geo.coordinates[0]; 
        timezone = result.timeZone;
        var todaysDay = moment.tz(new Date(), abbrs[result.timeZone]).format("ddd");        
        if(result.timings[todaysDay].length){       
          optdata.startTime = result.timings[todaysDay][0][0];      
          optdata.endTime = result.timings[todaysDay][result.timings[todaysDay].length-1][1];       
        }else{
            optdata.startTime = "";
            optdata.endTime = "";
        }
        var now = moment().tz(abbrs[optdata.timeZone]).format();        
        if(moment().tz(abbrs[optdata.timeZone]).format("HH:mm") > optdata.endTime ){        
            now = moment(now).add(1, 'day').format();       
        }       
        selectedDate = moment(now).format("YYYY-MM-DD");
        /*if(optdata.allowed == "1"){
            //$(".appsSec ul li a").css("display","block");
            //$(".appsSec ul li a span").css("display","block");
            $(".profileSec").css("display","block");
            checkSession();
        }*/
        //optdata.perdayCapacity = result.perdayCapacity;
        //selectedDate = moment().tz(abbrs[optdata.timeZone]).format("YYYY-MM-DD");
        //ajaxCall("getcounts", {}, populateWdayText);
        //$sc = jQuery("#schedule").timeSchedule(optdata);
        $(".cmpnyName").text(result.companyName);
        setDates();
    }
    
    socketio.on('connect', function () {
        socketio.emit('room', subdomain);
        
        socketio.on('newAppointment', function(message) {
            var result = {
                "Data": message
            }
            var newObj = {
                "startT": result.Data.data.startTime,
                "endT": result.Data.data.endTime,
                "eventName": result.Data.data.data.name,
                "descrip": result.Data.data.data.details,
                "email": result.Data.data.data.email,
                "mobile": result.Data.data.data.mobile,
                "catagory": result.Data.data.timeline,
                "selectedDate": result.Data.selecteddate,
                "status": result.Data.data.confirm,
                "id": result.Data._id
            };
            timeschd[0].events.push(newObj);
            newBooking(newObj);
        });
            
        socketio.on('updateAppointment', function(message) {
            var result = {
                "Data": message
            }
            var newObj = {
                "startT": result.Data.data.startTime,
                "endT": result.Data.data.endTime,
                "eventName": result.Data.data.data.name,
                "descrip": result.Data.data.data.details,
                "email": result.Data.data.data.email,
                "mobile": result.Data.data.data.mobile,
                "catagory": result.Data.data.timeline,
                "selectedDate": result.Data.selecteddate,
                "status": result.Data.data.confirm,
                "id": result.Data._id
            };
	        timeschd[0].events.forEach(function(item, index){
	            if(item.id == newObj.id){
	                timeschd[0].events[index] = newObj;
	            }
	        });
	        if(selectedDate == moment(result.Data.selecteddate).format("YYYY-MM-DD")){
	            var minutes = 0;
                var s = result.Data.data.startTime.split(':');
                var e = result.Data.data.endTime.split(':');
                minutes += (e[0] - s[0]) * 60;
                if(e[1] > s[1])
                    minutes += e[1] - s[1];
                else
                    minutes -= s[1] - e[1];
                    
                var h = 60 / minutes;
                var hVal = 100 / h;
                if(minutes > 60)
                    hVal = 100;
                var names = result.Data.data.data.name.split(' ');
                var nameVal = names.length > 1 ? names[0].substring()[0] + names[1].substring()[0] : (names[0] ? names[0].substring()[0] : "");
                var cls = newObj.status ? 'confirm' : 'notConfirmed';
                $('.content').find('.events-container').each(function(ind,eles){
                    $(eles).find('.eveClass').each(function(e){
                        var dat = $(this).find('span').data("eventdata");
                        if(dat.id == newObj.id){
                            $(this).find('span').removeClass('confirm notConfirmed');
                            $(this).find('span').addClass(cls);
                            $(this).find('span').css("height", hVal+"%");
                            $(this).find('span').find(".evName").text(nameVal);
                            $(this).find('span').data("eventdata", newObj);     
                        }
                   })
                });  
	        }
        });
        
        socketio.on('deleteAppointment', function(obj) {
            timeschd[0].events.forEach(function(item, index){
	            if(item.id == obj.id){
	                timeschd[0].events.splice(index, 1);
	            }
	        });
	        $('.content').find('.events-container').each(function(ind,eles){
                $(eles).find('.eveClass').each(function(e){
                    var dat = $(this).find('span').data("eventdata");
                    if(dat.id == obj.id){
                        $(this).remove();  
                        var child = $(eles).find('.eveClass').length;
                        $(eles).width(child * 36);
                    }
               })
            });  
        });
        
    });
    if(subdomain.length)
        ajaxCall("getresources", {}, getresourcesAck);
    else{
        alert("Subdomain not exists.");
    }
})