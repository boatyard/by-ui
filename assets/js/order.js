
var Order = {
    
    init: function(){
        
        var that = this;

        this.getOrderDetails();
        
       
    },
    
    getOrderDetails: function(){
        
        var that = this;
        
        //test ajax call
        //$.ajax = this._ajaxResponse('{"status":"success-get-data"}', 'success');
        
        //$( ".loading" ).fadeOut("slow");
        
        
        $.ajax({
            url: api.url + "/external/orders/" + queries.token + "/provider_order_details",
            type: "GET",
            success: function(data, statusText, xhr){
                

                var source   = $("#order-template").html();
                var template = Handlebars.compile(source);
                $('.page').html(template(data));
                

                $('#btnAccept').on('click', function(e){
                    console.log("accept");
                    that.submit(e,'accept'); 
                    //location.reload();
                    
                });
                
                $('#btnDashboard').on('click', function(e){
                   
                    window.location =  dashboard.url + "/order-detail/" + data.order.id;
                    
                });
                
                 
                $('#btnReject').on('click', function(e){
                    that.submit(e,'reject'); 
                   
                }); 
                
                $( ".loading" ).fadeOut("slow");
               
            },
            error: function(data, statusText, xhr){
                that.orderDetailsError();
                
            }
     
        });    
        
        
    },
    
    submit: function(e,response){
        
        //set server statuses
        var fStatus = new serverInfoDisplay({
                    element: $(".alert"),
                    send: "Sending your response, please wait..",
                    success: "Success!",
                    error: ""
                });
                
        e.preventDefault();
        //console.log($('#inputRating',reviewForm).val());
        fStatus.sending();
        //console.log(that._ajaxTests);
          
        //test ajax call  
        //$.ajax = this._ajaxResponse('{"status":"success"}', 'success');
        var option = "";
        var data = null;
        
        if(response == 'reject'){
            option = "/reject";
        }else{
            data = {"order":{"status":"accepted"}}
            
        } 
         
         
        $.ajax({
          
            url: api.url + "/external/orders/" + queries.token + option,
            type: "PUT",
            data: data,
            dataType: "json",
            success: function(data, statusText, xhr){

                fStatus.success();
                $('.page').hide();
                
                
                if(response == 'reject'){
                    //order was rejected, let the user know
                    $('.rejected').removeClass('hidden');
                }else{
                    //order was accepted, refresh to show customer info
                    location.reload();
                }
                
                
            },
            error: function(data, statusText, xhr){
                console.log(data);
                fStatus.error("Server Error.");
            }
     
        });        
        
    },
    
    orderDetailsError: function(){
        $( ".loading" ).fadeOut("slow");
        $('.page').hide();
        $('.error-message').removeClass('hidden');
          
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
   Order.init();
   
});