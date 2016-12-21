(function($){
	$.fn.gbTab = function(opt){
		var defaults,opt = {
			tabUL:".tabMenu",
			tabCont:".tabContent"
		},
		set = $.extend({},defaults,opt);

		return this.each(function(){
			var $this = $(this),
			tabMenu = $this.find(set.tabUL),
			tabContent = $this.find(set.tabCont),
			list = tabMenu.find('li'),
			num=0;

			init();

			function init(){
		        for(var i =0; i < list.length; i++){
		            list[i].onclick = openTab(i);
		        }
			}

			function openTab(num){
				
	            return function (){
	            	for(var i =0; i < list.length; i++){
			            $(list[i]).removeClass('active');
			        }
			        for(var i =0; i < tabContent.length; i++){
			            $(tabContent[i]).removeClass('active');
			        }
	                $(list[num]).addClass('active');
	                $(tabContent[num]).addClass('active');
	            } 
        	}

		})
	}
})(jQuery)