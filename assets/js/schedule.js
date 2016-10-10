
var Schedule = {
    chosenTime: null,
    init: function(){
        
        var that = this;
        
        var scheduleForm = $('#schedule-form');
         
 
        //get order details
        //TODO: get from Boatyard API.
        
        this.getOrderDetails();
        
        
        //get the form ready
        scheduleForm.submit(function (e) {
            
            that.submit(e, this); 
          
        });
        
    },
    
    populateTimes : function(result){
        
        var that = this;
        
        console.log("populating times")
        $('.btn-time').click(function(e){
            
            $('.btn-time').removeClass("selected");
            
            e.preventDefault();
            
            var time = $(this).attr("data-time");
            that.chosenTime = time;
            
            $(this).addClass("selected");

            $("[type=submit]").removeAttr('disabled');
        });
        
        
    },
    
    getOrderDetails: function(){
        
        var that = this;
        
        //test ajax call
        $.ajax = this._ajaxResponse('{"status":"success-get-data"}', 'success');
     
        $.ajax({
            url: '[/signup.php]',
            type: "POST",
            //data: "rating="+encodeURIComponent($('#inputRating',reviewForm).val())+"&text=" + $('#inputReviewText',reviewForm).val(),
            success: function(data, statusText, xhr){
              
                var result = JSON.parse(data);
                console.log(result)
                
                $( ".loading" ).fadeOut("slow");
                
                //if success to put times:
                that.populateTimes(result);
                
                
                /*
                if(result.status == "subscribed"){
                 
                    fStatus.success();
                }else if (result.status == 400){
                    fStatus.error("Oh oh! Looks like you are already on the beta list.");
                 
                }else{
                    fStatus.error(data.detail);

                }*/
            },
            error: function(data, statusText, xhr){
                that.orderDetailsError();
                
            }
     
        });    
        
    },
    
    orderDetailsError: function(){
        $( ".loading" ).fadeOut("slow");
        $('.page').hide();
        $('.error-message').removeClass('hidden');
          
    },
    
    submit: function(e, scheduleForm){
        var that = this;
        //set server statuses
        var fStatus = new serverInfoDisplay({
                    element: $(".alert", scheduleForm),
                    send: "Sending your selected time, please wait..",
                    success: "Success!",
                    error: ""
                });
                
        e.preventDefault();
        //console.log($('#inputRating',reviewForm).val());
        fStatus.sending();
        //console.log(that._ajaxTests);
          
        //test ajax call  
        $.ajax = this._ajaxResponse('{"status":"success"}', 'success');
     
        $.ajax({
            url: '[/signup.php]',
            type: "POST",
            //data: "time="+encodeURIComponent($('#inputRating',scheduleForm).val()),
            success: function(data, statusText, xhr){
              
                var result = JSON.parse(data);
                //console.log(result);
                fStatus.success();
                $('.page').hide();
                
                
                if(that.chosenTime == 0){
                    $('.no-time').removeClass('hidden');
                }else{
                    $('.thankyou').removeClass('hidden');
                }
                /*
                if(result.status == "subscribed"){
                 
                    fStatus.success();
                }else if (result.status == 400){
                    fStatus.error("Oh oh! Looks like you are already on the beta list.");
                 
                }else{
                    fStatus.error(data.detail);

                }*/
            },
            error: function(data, statusText, xhr){
                console.log(data);
                fStatus.error("Server Error.");
            }
     
        });        
        
    },
    
    _ajaxResponse: function(response, type){
        return function (params) {
            if(type=='success'){
                params.success(response);
            }else if(type=='error'){
                params.error(response);
            }
            
          };
    }
}



$(document).ready(function() {
   
   //lets get this party started
   Schedule.init();
   
});