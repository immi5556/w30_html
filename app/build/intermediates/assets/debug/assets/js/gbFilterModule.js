(function($){

$.fn.gbFilter = function(opt){
	var defaults = {
		serviceCall:null
	},
	set = $.extend({},defaults,opt);

	return this.each(function(){
		var $this =$(this),
			inputSearch = $('.input_filter'),
			serviceData = set.serviceCall,
			dropdown = $('<div class="dropWrap"></div>'),
			filterArr;

			//append
			$this.append(dropdown);

			init();
			function init(){
				filterSearch();
				$(document).on('click',function(){
				    $(dropdown).html('');
				})
			}
			function filterSearch(){
				$(inputSearch).on('keyup',function(e){
				    e.stopPropagation();
					$(dropdown).html('');
					var thisVal = $(this).val();
					if(thisVal !=='' && thisVal !==' '){
						function getFn(obj){
							if(obj.companyName && thisVal && obj.companyName.toLowerCase().indexOf(thisVal.toLowerCase()) !=-1){
								return obj;
							}
						}
						filterArr = serviceData.filter(getFn);
						if(filterArr.length == 0){
							$(dropdown).html('<p>No Records found...</p>');
						}else {
							tempBuild(filterArr);
						}
						
					}
				});
			};

			function tempBuild(arr){
				var UL = $('<ul class="dropList"></ul>');
				for(var i=0; i < arr.length; i++){
					var item = $('<li>'+arr[i].companyName+'</li>');
					$(item).data('gbData',arr[i]);
					UL.append(item);
					$(item).on('click',function(e){
					    e.stopPropagation();
						$(dropdown).html('');
						$(inputSearch).val($(this).text());
					});
				}
				$(dropdown).append(UL);
			};
			
	});
}

})(jQuery)