if(window.andapp){
    window.andapp.saveLatestURL("chat.html");
}
$('#q1-subdomain').keyup(function(){
    this.value = this.value.toLowerCase();
});
var jss = {
		questions: [
			/*{
				id: "language",
				answered: false,
				idx: 0
			},*/
			{
				id: "businesscategory",
				answered: false,
				idx: 1
			},
			{
				id: "companyname",
				answered: false,
				idx: 2
			},
			{
				id: "contactdetails",
				answered: false,
				idx: 3
			},
			{
				id: "address",
				answered: false,
				idx: 4
			},
			{
				id: "subdomain",
				answered: false,
				idx: 5
			},
			/*{
				id: "logogimage",
				answered: false,
				idx: 6
			},*/
			{
				id: "workinghrs",
				answered: false,
				idx: 7
			}
		]
	};
    var companyName = "", category = "", mobileNumber = "", email = "", street = "", unit = "", city = "", state = "", country = "", zip = "", subdomain = "", startTime = "", endTime = "", latitude = "", longitude = "", password = "", logoName = "sample-logo.jpg";
	var servurl = "https://services.within30.com/";
    var regisurl = "https://registration.within30.com/";
    var hostingIP = "https://socket.within30.com/";
    var geocoder = new google.maps.Geocoder();
    var source = "From W30 Android Chat";
    var timeZone = "IST";
    var servicesId = [];
    var servicesName = [];
    var w30Credentials = "win-HQGQ:zxosxtR76Z80";
    $('#file-2').fileupload({ dataType: 'json', autoUpload: true, 
		done: function(dd, edata){
			$(".newLogo").attr("src", hostingIP+'uploaded/logos/' + edata.result.files[0].name);
			logoName = edata.result.files[0].name;
		} 
	});
	function goBack(){
        /*history.back();*/
        if(window.andapp.checkInternet() == "true"){
    		window.location.href = 'selectCatagory.html';
    	}else{
    	    window.andapp.saveLatestURL("selectCatagory.html");
    		window.andapp.loadLocalFile();
    	}
    }
	$(function(){
	    var errorText;
		var uploadFile = false;
        
		var errorVal = '<div class="cht-wrap-me q-language errorblock" style="display: block;">\
			<div class="pr-pic pr-pic-me"><img src="assets/img/chatImages/logo.png"></div>\
			<div class="bubble me">Please enter values</div>\
		</div>';
		var validerror = false;
	    function scrollSmoothToBottom (ele, ele2) {
           $(ele).animate({ scrollTop: $(window).outerHeight() - $(ele2).outerHeight()}, 1000);
        }
        
        function scrollToBottom (ele) {
            var div = document.querySelector(ele);
            div.scrollTop = div.scrollHeight - div.clientHeight;
        }
        
		var activedata = undefined;
		var resetQuestions = function(){
			jss.questions = jss.questions.sort(function(a,b) {return (a.idx - b.idx) } );
			$(".cht-wrap-me").hide();
			$(".cht-wrap-you").hide();
			$(".question").hide();
			$(".q-welcome").show();
			
			//scroll down..
			//scrollSmoothToBottom($('.cht-disp'), $(".cht-type"));
			
			$(jss.questions).each(function(){
			    $('.cht-wrap-me').removeClass('highlight');
				if (!this.answered){
					activedata = this;
					$(".q-" + this.id).show().addClass('highlight');
					$(".cht-" + this.id).show();
					var selectVal = $("#q1-" + this.id).find('.selected').text();
					$('.chat-field').text(selectVal);
					return false;
				} else {
					$(".q-" + this.id).show();
					$(".a-" + this.id).show();
				}
			});
			ansBlockHeight();
		}
        
        var ansBlockHeight = function(){
            $(".sendVal").css("position","absolute");
            var Wh = $(window).outerHeight();
            if($('.cht-type').is(":visible")){
               var chtBar = $('.cht-type').outerHeight();
                
                if( chtBar < 150){
                    $('.cht-disp').css({
                     'height':(Wh - chtBar) +'px'
                    })
                }else {
                    $('.cht-disp').css({
                     'height':(Wh - 150) +'px'
                    })
                } 
            }else{
                $('.cht-disp').css({
                    'height':(Wh) +'px'
                })
            }
            $(".sendVal").css("position","fixed");
        }
		var process = function(){
			$('.chat-field').text('');
			/*if (activedata.id == "language"){
				var selectVal = $("#q1-" + activedata.id).find('.selected').text();
				$("#c1-" + activedata.id).text(selectVal);
				$(".a-" + activedata.id).show();
				activedata.answered = true;
				if(selectVal == "English"){
				    
				}else if(selectVal == "Telugu"){
				    
				} 
			}
			else */if (activedata.id == "businesscategory"){
				var selectVal = $("#q1-" + activedata.id).find('.selected').text();
				$("#c1-" + activedata.id).text(selectVal);
				$(".a-" + activedata.id).show();
				activedata.answered = true;
			}
			else if (activedata.id == "companyname"){
				$("#c1-" + activedata.id).text($("#q1-" + activedata.id).val());
				$(".a-" + activedata.id).show();
				activedata.answered = true;
			}
			else if (activedata.id == "contactdetails"){
				$("#c1-" + activedata.id).text($("#q1-" + activedata.id).val());
				$("#c2-" + activedata.id).text($("#q2-" + activedata.id).val());
				$(".a-" + activedata.id).show();
				activedata.answered = true;
			}
			else if (activedata.id == "address"){
				$("#c1-" + activedata.id).text($("#q1-" + activedata.id).val());
				$("#c2-" + activedata.id).text($("#q2-" + activedata.id).val());
				$("#c3-" + activedata.id).text($("#q3-" + activedata.id).val());
				$("#c4-" + activedata.id).text($("#q4-" + activedata.id).val());
				$("#c5-" + activedata.id).text($("#q5-" + activedata.id).val());
				$("#c6-" + activedata.id).text($("#q6-" + activedata.id).val());
				$(".a-" + activedata.id).show();
				activedata.answered = true;
			}
			else if (activedata.id == "subdomain"){
				var ttv = $("#q1-" + activedata.id).val();
				//$("#c1-" + activedata.id).attr("href", "https://" + ttv + ".within30.com");
				$("#c1-" + activedata.id).text(ttv + ".within30.com");
				$("#c2-" + activedata.id).text(ttv);
				$(".a-" + activedata.id).show();
				activedata.answered = true;
			}
			else /*if (activedata.id == "logogimage"){
				var ttv = $("#q1-" + activedata.id).val();

				$(".a-" + activedata.id).show();
				if(logoName != "sample-logo.jpg"){
				    $(".chatLogo").attr("src", hostingIP+'uploaded/logos/' + logoName);
				}
				activedata.answered = true;
			}else*/ if(activedata.id == "workinghrs"){
			    var ttv = $("#q1-" + activedata.id).val();
                $("#c1-" + activedata.id).text(startTime);
				$("#c2-" + activedata.id).text(endTime);
				$(".a-" + activedata.id).show();
				activedata.answered = true;
			}
		}

		$(document).on("click", ".sendVal", function(){
		    $("body").addClass("load");
			$('.errorblock').remove();
			if (activedata){
				validate(function(){
				    if(validerror){
    					$('#cht-disp').append(errorVal);
    					$('.errorblock .bubble').html(errorText);
    				}else{
    					process();
    					resetQuestions();
    					$('.errorblock').remove();
    				}
    				/*process();
    				resetQuestions();*/
    				scrollToBottom("#cht-disp"); 
    				$("body").removeClass("load");
				});
			}
		});

		function validate(callback){
		    validerror = false;
			/*if (activedata.id == "language"){
				var selectVal = $("#q1-" + activedata.id).find('.selected').text();
				if(selectVal == 'undefined' || selectVal == null || selectVal == ''){
					errorText = 'Please Select language';
					validerror = true;
					callback();
				}else{
					validerror = false;
					callback();
				}
			}
			else */if (activedata.id == "businesscategory"){
				var selectVal = $("#q1-" + activedata.id).find('.selected').text();
				if(selectVal == 'undefined' || selectVal == null || selectVal == ''){
					errorText = 'Please Select your Business Category';
					validerror = true;
					callback();
				}else{
					validerror = false;
					category = selectVal;
					callback();
				}
			}
			else if (activedata.id == "companyname"){
				var selectVal = $("#q1-" + activedata.id).val();
				if(selectVal == 'undefined' || selectVal == null || selectVal == ''){
					errorText = 'Company Name cannot be empty';
					validerror = true;
					callback();
				}else{
					validerror = false;
					companyName = selectVal;
					callback();
				}
			}
			else if (activedata.id == "contactdetails"){
				var selectVal1 = $("#q1-" + activedata.id).val();
				var selectVal2 = $("#q2-" + activedata.id).val();
				if(selectVal1.length != 10){
					errorText = 'Please Enter your 10-digit Mobile Number';
					validerror = true;
					callback();
				}else if(checkEmailBox(selectVal2)){
					errorText = 'Please Enter proper Email ID';
					validerror = true;
					callback();
				}else{
					mobileNumber = selectVal1;
					email = selectVal2;
					checkCreds(function(result){
					    if(result == "Not Exists"){
                            validerror = false;
                        }else if(result == "Email or Mobile Exists"){
                            errorText = 'Mobile Number or Email already exists for some other business. Please try another creds.';
					        validerror = true;
                        }else{
                            errorText = 'Something went wrong on backend. Please try after some time.';
					        validerror = true;
                        }
                        callback();
					});
				}
			}
			else if (activedata.id == "address"){
				var selectVal1 = $("#q1-" + activedata.id).val();
				var selectVal2 = $("#q2-" + activedata.id).val();
				var selectVal3 = $("#q3-" + activedata.id).val();
				var selectVal4 = $("#q4-" + activedata.id).val();
				var selectVal5 = $("#q5-" + activedata.id).val();
				var selectVal6 = $("#q6-" + activedata.id).val();
				if(selectVal1 == 'undefined' || selectVal1 == null || selectVal1 == ''){
					errorText = 'Please Enter your Street';
					validerror = true;
				}else if(selectVal3 == 'undefined' || selectVal3 == null || selectVal3 == ''){
					errorText = 'Please Enter your City';
					validerror = true;
				}else if(selectVal4 == 'undefined' || selectVal4 == null || selectVal4 == ''){
					errorText = 'Please Enter your State';
					validerror = true;
				}else if(selectVal5 == 'undefined' || selectVal5 == null || selectVal5 == ''){
					errorText = 'Please Enter your Zip';
					validerror = true;
				}else if(selectVal6 == 'undefined' || selectVal6 == null || selectVal6 == ''){
					errorText = 'Please Enter your Country';
					validerror = true;
				}else{
					validerror = false;
					street = selectVal1;
					city = selectVal3;
					state = selectVal4;
					zip = selectVal5;
					country = selectVal6;
					unit = selectVal2;
					getLatLong();
				}
				callback();
			}
			else if (activedata.id == "subdomain"){
				var ttv = $("#q1-" + activedata.id).val();
				if(ttv == 'undefined' || ttv == null || ttv == ''){
					errorText = 'Please Enter your subdomain';
					validerror = true;
					callback();
				}else if(checkIllegalChars(ttv)){
				    errorText = 'Subdomain cannot contain illegal characters.';
					validerror = true;
					callback();
			    }else if(!isNaN(ttv)){
				    errorText = 'Subdomain cannot be only number. It can be a combination of numbers and alphabets';
					validerror = true;
					callback();
			    }else if(ttv.indexOf(" ") > -1){
				    errorText = 'Subdomain cannot have space.';
					validerror = true;
					callback();
			    }else if(ttv.indexOf("www.") > -1 || ttv.indexOf(".com") > -1){
				    errorText = 'Subdomain cannot contain www. or .com';
					validerror = true;
					callback();
			    }else if(ttv != ttv.toLowerCase()){
                    errorText = 'Subdomain cannot contain Capital Letters';
                    validerror = true;
                    callback();
                }else{
			        var query = {
                        subdomain: ttv,
                        checkDomain: true
                    };
                    checkdomain(query, function(result){
                        if(result == "Subdomain not exists"){
                            validerror = false;
					        subdomain = ttv;
                        }else{
                            errorText = 'subdomain is already taken by someone else. Try another subdomain.';
					        validerror = true;
                        }
                        callback();
                    });
					
				}
			}
			else if (activedata.id == "workinghrs"){
				var selectVal1 = $("#sTime").val();
				var selectVal2 = $("#eTime").val();
				var result = checkTimes(selectVal1, selectVal2);
				if(result != ""){
				    errorText = result;
				    validerror = true;
				    callback();
				}else{
				    validerror = false;
				    startTime = selectVal1;
				    endTime =selectVal2;
				    callback();
				    customerCreation();
				}
			}else{
			    callback();
			}
		}
		
		var checkEmailBox = function(val){
    		if (val.length == 0)	{
    			return true;
    		}else {
    			var req = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        		if(!req.test(val)){
        			return true;
        		}else{
    				return false;
        		}
    		}
    	}
    	
    	var checkIllegalChars = function(value){
    		if (/^[a-zA-Z0-9-]*$/.test(value) == false)	{
    			return true;
    		}else{
    			return false;
    		}
    	}
    	
    	var checkTimes = function(time, endTime){
    		if(time.length != 5 || time.slice(2,3) != ":" || isNaN(time.slice(0,2))  || isNaN(time.slice(3,5))){
    			return "Please select start time from time picker";
    		}else if(endTime.length != 5 || endTime.slice(2,3) != ":"  || isNaN(endTime.slice(0,2))  || isNaN(endTime.slice(3,5))){
    			return "Please select end time from time picker";
    		}
    		if(time > endTime){
    			return "Start Time cannot be greater than End Time";
    		}
    		return "";
    	}
    	
    	function getLatLong(){
        	var address = "";
        	if(street)
        		address += street+",";
        	if(city)
        		address += city+",";
        	
        	if(state)
        		address += state+",";
        	if(zip)
        		address += zip+",";
        		
        	if(address.length){
                address = address.substring(0, address.length-1);
            
            	var request = $.ajax({
                    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address,
                    type: "POST"
                });
            
                request.success(function(result) {
                    if(result.status == "OK"){
                        latitude = result.results[0].geometry.location.lat;
                    	longitude = result.results[0].geometry.location.lng;
                    }
                });
                request.fail(function(jqXHR, textStatus) {
                    if(window.andapp.checkInternet() != "true"){
            		    window.andapp.saveLatestURL("chat.html");
            			window.andapp.loadLocalFile();
            		}
                    //console.log("error while getting lat,long");
                });
        	}
        };
        
        function checkCreds(callback){
            var query = {
                email: email,
                mobile: mobileNumber
            }
            var request = $.ajax({
                url: regisurl+"endpoint/checkcreds",
                type: "POST",
                data: JSON.stringify(query), 
                contentType: "application/json; charset=UTF-8"
            });
    
            request.success(function(result) {
                callback(result);
            });
            request.fail(function(jqXHR, textStatus) {
                if(window.andapp.checkInternet() != "true"){
        		    window.andapp.saveLatestURL("chat.html");
        			window.andapp.loadLocalFile();
        		}else{
                    showMessage("error while checking credentials. Try again after some time", "error");
        		}
            });
        }
        
        var checkdomain = function(query, callback){
            var request = $.ajax({
                url: regisurl+"endpoint/checkdomain",
                type: "POST",
                data: JSON.stringify(query), 
                contentType: "application/json; charset=UTF-8"
            });
    
            request.success(function(result) {
                //console.log(result);
            });
            request.fail(function(jqXHR, textStatus) {
                if(window.andapp.checkInternet() != "true"){
        		    window.andapp.saveLatestURL("chat.html");
        			window.andapp.loadLocalFile();
        		}else if(jqXHR.responseText == "Subdomain already taken"){
                    callback("Subdomain already taken");
                } else if(jqXHR.responseText == "Subdomain not exists"){
                    callback("Subdomain not exists");
                }
            });
        }
        
        function customerCreation(){
            var subDomain = subdomain;
            password = makepswrd();
            var request = $.ajax({
                url: servurl + "endpoint/ccreate",
                type: "POST",
                data: JSON.stringify({
                    regis : { 
                        "name" : source, 
                        "email" : email,
                        "mobile" : mobileNumber,
                        "latitude" : latitude,
                        "longitude" : longitude,
                        "passwordString" : password
                    },
                    serviceId: servicesId[jQuery.inArray( category.replace(" ",""), servicesName )]
                }),
                contentType: "application/json; charset=UTF-8"
            });

            request.success(function(result) {
                if(result == "error"){
                    showMessage("Something went wrong. Please try again after sometime.", "error");
                }else if(result == "exists"){
                    showMessage("This email address is already associated with an existing business. Please enroll with a different email address or contact us at Support@within30.com for concerns/questions.", "");
                }else{
                    cupdate(result);
                }
                
            });
            request.fail(function(jqXHR, textStatus) {
                if(window.andapp.checkInternet() != "true"){
        		    window.andapp.saveLatestURL("chat.html");
        			window.andapp.loadLocalFile();
        		}else{
                    showMessage("Error occured while request for Registration.", "error");
        		}
            });
        }
        
        function cupdate(result){
            if(country.toLowerCase() == "india"){
                var obj = {
                        "serviceId" : servicesId[jQuery.inArray( category.replace(" ",""), servicesName )],
                        "premium" : false,
                        "landing" : {
                            "_emailstore" : result.regis.email,
                            "_idstore" : result._id,
                            "_uniqueid" : result.uniqueid,
                            "_status" : "cupdate",
                            "_createdlandingat" : result.createdat
                        },
                        "_clientid" : "",
                        "companyName" : companyName,
                        "subdomain" : subdomain,
                        "logoPath" : logoName,
                        "logoUrl" : subdomain+".within30.com",
                        "fullName" : companyName,
                        "businessType" : category,
                        "mobile" : mobileNumber,
                        "companyEmail" : email,
                        "companyCity" : "",
                        "details" : "",
                        "geo" : {
                            "metro" : "",
                            "region" :street,
                            "city" : city,
                            "country" : country,
                            "ll" : [ 
                                latitude, 
                                longitude
                            ],
                            "address" : {
                                "premise" : unit,
                                "sublocality" : street,
                                "city" : city,
                                "state" : state,
                                "postalcode" : zip,
                                "country" : country
                            },
                            "type" : "Point",
                            "coordinates" : [ 
                                longitude, 
                                latitude
                            ]
                        },
                        "concurrentCount" : "1",
                        "perdayCapacity" : "20",
                        "defaultDuration" : "20",
                        "overlap" : false,
                        "allowCustom" : false,
                        "autoAcknowledge" : true,
                        "disclaimer" : "",
                        "specialities" : result.specialities,
                        "createdat" : new Date().getTime(),
                        "rating" : 0,
                        "contactMandatory" : false,
                        "timeZone" : timeZone,
                        "timings" : {
                            "Mon" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Tue" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Wed" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Thu" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Fri" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Sat" : [],
                            "Sun" : []
                        },
                        "timingType" : "same",
                        "allowICS" : true,
                        "terms" : false
                    };
                
            }else{
                var obj = {
                        "serviceId" : servicesId[jQuery.inArray( category.replace(" ",""), servicesName )],
                        "premium" : false,
                        "landing" : {
                            "_emailstore" : result.regis.email,
                            "_idstore" : result._id,
                            "_uniqueid" : result.uniqueid,
                            "_status" : "cupdate",
                            "_createdlandingat" : result.createdat
                        },
                        "_clientid" : "",
                        "companyName" : $("#fullName1").val(),
                        "subdomain" : subdomain,
                        "logoPath" : logoName,
                        "logoUrl" : subdomain+".within30.com",
                        "fullName" : companyName,
                        "businessType" : category,
                        "mobile" : mobileNumber,
                        "companyEmail" : email,
                        "companyCity" : "",
                        "details" : "",
                        "geo" : {
                            "metro" : "",
                            "region" : street,
                            "city" : city,
                            "country" : country,
                            "ll" : [ 
                                latitude, 
                                longitude
                            ],
                            "address" : {
                                "premise" : unit,
                                "sublocality" : street,
                                "city" : city,
                                "state" : state,
                                "postalcode" : zip,
                                "country" : country
                            },
                            "type" : "Point",
                            "coordinates" : [ 
                                longitude, 
                                latitude
                            ]
                        },
                        "concurrentCount" : "1",
                        "perdayCapacity" : "20",
                        "defaultDuration" : "20",
                        "overlap" : false,
                        "allowCustom" : false,
                        "autoAcknowledge" : true,
                        "disclaimer" : "",
                        "specialities" : result.specialities,
                        "createdat" : new Date().getTime(),
                        "rating" : 0,
                        "contactMandatory" : false,
                        "timeZone" : "CST",
                        "timings" : {
                            "Mon" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Tue" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Wed" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Thu" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Fri" : [ 
                                [ 
                                    startTime,
                                    endTime
                                ]
                            ],
                            "Sat" : [],
                            "Sun" : []
                        },
                        "timingType" : "same",
                        "allowICS" : true,
                        "terms" : false
                    };
            }
           
                     
            var request = $.ajax({
                    url: regisurl+"endpoint/cupdate",
                    type: "POST",
                    data: JSON.stringify(obj),
                    contentType: "application/json; charset=UTF-8"
                });
        
                request.success(function(result) {
        	        window.andapp.saveRegistrationDetails(JSON.stringify({"subdomain": result.subdomain, "email": email}));
        	        showMessage("Successfully Registered. Your admin URL is: <a class='businessLink'>https://" + (result.subdomain)  + ".within30.com/admin</a>. Use the following Pin to login: "+password+".", "success");
                    $(".businessLink").on("click", function(){
                        window.andapp.saveSubdomain("");
                        window.andapp.saveAdminState("false");
                        window.location.href = "adminLogin.html";
                    });
                });
                request.fail(function(jqXHR, textStatus) {
                    if(window.andapp.checkInternet() != "true"){
            		    window.andapp.saveLatestURL("chat.html");
            			window.andapp.loadLocalFile();
            		}else{
                        showMessage("error while cupdate", "");
            		}
                });
        }
        
        function showMessage(message, type){
            $('.errorblock').remove();
	        $('#cht-disp').append(errorVal);
	        $('.errorblock').removeClass("success");
			$('.errorblock .bubble').html(message);
			$("body").removeClass("load");
			if(type == "success"){
			    $('.errorblock').addClass("success");
    			$(".cht-type").hide();
    			ansBlockHeight();
    			scrollToBottom("#cht-disp");
			}
			if(type == "error"){
			    $(".cht-type").hide();
			    ansBlockHeight();
    			scrollToBottom("#cht-disp");
			}
        }
        
        function makepswrd() {
          var text = "";
          var possible = "0123456789";
        
          for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        
          return text;
        }
        
        var requestAPI = function(action, obj, callback){
        	var request = $.ajax({
        		url: servurl + "endpoint/api/"+action,
        		type: "POST",
                beforeSend: function (xhr) {
                	xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
                },
                data: JSON.stringify(obj),
                contentType: "application/json; charset=UTF-8"
            });
            request.success(function(result) {
            	if(result.Status == "Ok"){
        			if(callback)
        			    callback(result.Data);
        		}else{
            		showMessage("Not Able to get services. Try Again after some time.", "error");
            	}
            });
            request.fail(function(jqXHR, textStatus) {
                if(window.andapp.checkInternet() != "true"){
        		    window.andapp.saveLatestURL("chat.html");
        			window.andapp.loadLocalFile();
        		}else{
                    showMessage("Not Able to get services. Try Again after some time.", "error");
        		}
            });
        }
        
        var setServiceIds = function(data){
            if(data.length){
                data.forEach(function(item){
                    if(item.active){
                        servicesId.push(item._id);
                        servicesName.push(item.name.replace(" ",""));
                    }
                });
            }
        }
        
        function showOption(){
            $("#q1-businesscategory li").each(function(item, index){
                if($(this).attr("data-val") == "Photography"){
                    if(country.toLowerCase() != "india"){
                        $(this).hide();
                    }
                }else if($(this).attr("data-val") == "Attorneys"){
                    if(country.toLowerCase() == "india"){
                        $(this).hide();
                    }
                }
            });
        }
        
        var getlatlongfromip = function(){
            var request = $.ajax({
    			url: servurl + "endpoint/api/getLatLong",
    			type: "POST",
                beforeSend: function (xhr) {
                	xhr.setRequestHeader ("Authorization", "Basic " + btoa(w30Credentials));
                },
                contentType: "application/json; charset=UTF-8"
            });
            request.success(function(result) {
            	if(result.status == "success"){
            	    latitude = result.latitude;
            	    longitude = result.longitude;
    	            getLocation(latitude, longitude);
            	}else{
            	    showOption();
            	}
            });
            request.fail(function(jqXHR, textStatus) {
                if(window.andapp.checkInternet() != "true"){
        		    window.andapp.saveLatestURL("chat.html");
        			window.andapp.loadLocalFile();
        		}else{
                    showOption();
        		}
            });
    	}
        
        function getLocation(lat, lng) {
    	  var latlng = new google.maps.LatLng(lat, lng);
    	  geocoder.geocode({latLng: latlng}, function(results, status) {
    	    if (status == google.maps.GeocoderStatus.OK) {
    	      if (results.length) {
    	        var arrAddress = results;
    	        if(arrAddress && arrAddress[0].address_components){
                    $.each(arrAddress[0].address_components, function(i, address_component) {
        	          if (address_component.types[0] == "country") {
        	            country = address_component.long_name;
        	          }
        	        });
        	        showOption(); 
    	        }else{
    	            showOption();
    	        }
    	      } else {
    	        showOption();
    	      }
    	    } else {
    	      showOption();
    	    }
    	  });
    	}
        
        var successFunction = function(pos){
    		latitude = pos.coords.latitude;
    		longitude = pos.coords.longitude;
    		getLocation(latitude, longitude);
    	}
    	var errorFunction = function(err){
    	    getlatlongfromip();
    	}
        
        var navi = function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
                setTimeout(function(){ 
                    if(!latitude)
                        errorFunction(null);
                }, 3000);
            } else {
                errorFunction(null);
            }
        }
        navi();
        
        requestAPI("getmyservices", {}, setServiceIds);
		
		$(document).on('click','.list-btns li',function(){
			$('.list-btns li').removeClass('selected');
			$(this).addClass('selected');
			$('.chat-field').text($(this).text());
		});

		$(document).on('keyup','.field-sec input',function(){
			$('.chat-field').text($(this).val());
		});
		
		$(window).on('resize', function(){
		    ansBlockHeight();
		    scrollToBottom(".cht-disp");
		});
		
		$('.field-sec input').on('focus',function(){
           //$('body').addClass('focusBody');
           ansBlockHeight();
        });
        $('.field-sec input').on('blur',function(){
           //$('body').removeClass('focusBody');
           ansBlockHeight();
        });
        
		resetQuestions();

		$('.select-items').on('click',function(){
			$('body').toggleClass('hideChatsec');
		});

		var input = $('.input-small');
		input.clockpicker({
		    autoclose: true
		});
        $(".back").on("click", function(){
        	history.back();
        });
        var marginTop = 0;
        $("#q3-address,#q4-address,#q5-address").on("focus", function(){
        var h = parseInt($(this).attr('data-height')) * 40;

            scrollToBottom2(".cht-type", h);
        });
        function scrollToBottom2 (ele, height) {
            var div = document.querySelector(ele);
            div.scrollTop = height;
        }
	});
