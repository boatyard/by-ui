
var Message = {
    
    init: function(){
        
        var that = this;
        
        var messageForm = $('#message-form');
       
        $('#inputReply').on('keyup keydown keypress change paste', function() {
           
          if ($(this).val() == '') {
            $("[type=submit]",messageForm).prop('disabled', true);
          } else {
            $("[type=submit]",messageForm).removeAttr('disabled');
          }
        });
        
        //get order details
        //TODO: get from Boatyard API.
        
        this.getOrderDetails();
        
        
        //get the form ready
        messageForm.submit(function (e) {
            
            that.submit(e, this); 
          
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
    
    submit: function(e, reviewForm){
        
        //set server statuses
        var fStatus = new serverInfoDisplay({
                    element: $(".alert", reviewForm),
                    send: "Sending your reply, please wait..",
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
            data: "rating="+encodeURIComponent($('#inputRating',reviewForm).val())+"&text=" + $('#inputReviewText',reviewForm).val(),
            success: function(data, statusText, xhr){
              
                var result = JSON.parse(data);
                //console.log(result);
                
                fStatus.success();
                $('.page').hide();
                $('.thankyou').removeClass('hidden');
              
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
   Message.init();
   
});