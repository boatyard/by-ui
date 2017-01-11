
var Quote = {
    
    init: function(){
        
        var that = this;
        
        //get order details
        //TODO: get from Boatyard API.
        
        this.getOrderDetails();
        
       
       
        
    },
    
    getOrderDetails: function(){
        
        var that = this;
        
        //test ajax call
        //$.ajax = this._ajaxResponse('{"status":"success-get-data"}', 'success');
     
        $.ajax({
            url: api.url + "/external/orders/" + queries.token + "/quotes/" + queries.quote_id,
            type: "GET",
            //data: "rating="+encodeURIComponent($('#inputRating',reviewForm).val())+"&text=" + $('#inputReviewText',reviewForm).val(),
            success: function(data, statusText, xhr){
                
                //calculate item subtotals
                var itemsTotal = 0;
                
                var items = data.quote.quote_entities;
                for (var i in items) {
                     var item = items[i];
                     item.total = item.quantity * item.cost;
                     itemsTotal += item.total;
                     
                }
                
                //calculate quote subtotal
                data.quote.subtotal = itemsTotal;
                
                var source   = $("#quote-template").html();
                var template = Handlebars.compile(source);
                $('.page').html(template(data));
                
                
                $('#btnAccept').on('click', function(e){
                    that.submit(e,'accept'); 
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
    
    orderDetailsError: function(){
        $( ".loading" ).fadeOut("slow");
        $('.page').hide();
        $('.error-message').removeClass('hidden');
          
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
     
        $.ajax({
            url: api.url + "/external/orders/" + queries.token + "/quotes/" + queries.quote_id + "/" + response,
            type: "PUT",
            //data: "rating="+encodeURIComponent($('#inputRating',reviewForm).val())+"&text=" + $('#inputReviewText',reviewForm).val(),
            success: function(data, statusText, xhr){
              
               
                //console.log(result);
                
                fStatus.success();
                $('.page').hide();
                $('.thankyou').removeClass('hidden');
                
                
                var statusWord = "approved";
                
                if(data.quote.status == 'reject'){
                    statusWord = 'rejected';
                }
                
                data.quote.statusWord = statusWord;
                
                var source   = $("#thankyou-template").html();
                var template = Handlebars.compile(source);
                $('#thankyou-message').html(template(data));
              
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
   Quote.init();
   
});