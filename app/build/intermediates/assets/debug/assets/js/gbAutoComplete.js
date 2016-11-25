(function($){

$.fn.gbAutocomplete = function(opt){
    var defaults = {
        data:null,
        mySearch:".autoSearch",
        mySearchField: "city"
    },
    set = $.extend({},defaults,opt);

    return this.each(function(){
        var $this = $(this),
        mainCont = $('<div/>').addClass('mainCont'),
        dropListDiv = $('<div/>').addClass('dropListDiv'),
        mydata,
        getULlist,
        getVal,
        globalUL,
        searchField = $this.find(set.mySearch),
        item;

         init(set.data);
    
    function init(data){
        
        mydata = data;
        myTemp(mydata)
    }

    //temp
    
    function myTemp(mydata){
        globalUL = $('<ul class="dropList"/>');
        
        for(var i=0; i < mydata.length; i++){
             item =$('<li>' + mydata[i][set.mySearchField] + '</li>');
             globalUL.append(item);
        }
        
        dropListDiv.html(globalUL);

        getULlist = $(globalUL).find('li');
        
            for(var x=0; x < getULlist.length; x++ ){
               getULlist[x].onclick = function(e){
                    e.stopPropagation();
                   myChangeTextClick(this)
               }
           }
       }

       function myChangeTextClick(_this){
            console.log($(_this).text());
         var indText = $(_this).text();
         $(set.mySearch).val(indText);
         //dropListDiv.html('');
         //myTemp(mydata);
         $this.find('.dropListDiv').slideUp();
         if(set.mySearchField == "name")
            $('.autoComplete .fa-search').click();
        }

        /*$('.currentLocation .fa-pencil').focus(function(){
            $(searchField).val('');
        })*/
        $(searchField).keyup(function(e){
            
        e.stopPropagation();
        var e = e || window.event;
        
        if(e.keyCode != 38 && e.keyCode != 40){
            if($(this).val() !='' && $(this).val() !=' '){
                getVal = $(this).val();
                
                function getList(items){
                    return items[set.mySearchField].toLowerCase().indexOf(getVal.toLowerCase()) !==-1;
                }
                dropListDiv.html('');
                var newobj = mydata.filter(getList);
                myTemp(newobj)
                $this.find('.dropListDiv').slideDown();
                
            }else {
                dropListDiv.html('');
                myTemp(mydata);
                $this.find('.dropListDiv').slideDown();
            }
        }

    });

$(document).click(function(e){
        e.stopPropagation();
        $('.dropListDiv').slideUp();
    })

        //append 
        $this.append(mainCont);
        $this.append(dropListDiv);
    });
}

})(jQuery)

var refreshOnForeground = function(){
    //location.reload();
}