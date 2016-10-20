
var Review = {
    init: function(){
        
        var that = this;
        
        var reviewForm = $('#review-form');
         
        //render stars
        $("#inputRating").rating({showCaption:false,showClear: false});
        
        $('#inputRating').on('rating.change', function(event, value, caption) {
            //enabling submit button on form now that we have a rating.
            $("[type=submit]",reviewForm).removeAttr('disabled');
        });
        
        
        //get order details
        //TODO: get from Boatyard API.
        
        
        this.getOrderDetails();
        
        
        //get the form ready
        reviewForm.submit(function (e) {
            
            that.submit(e, this); 
          
        });
        
    },
    
    getOrderDetails: function(){
        
        var that = this;
       
        //test ajax call
        //$.ajax = this._ajaxResponse('{"status":"success-get-data"}', 'success');
     
        $.ajax({
            url: api.url + "/external/orders/" + queries.token,
            type: "GET", 
            //data: "rating="+encodeURIComponent($('#inputRating',reviewForm).val())+"&text=" + $('#inputReviewText',reviewForm).val(),
            success: function(data, statusText, xhr){
                
                //fill in the variables from response into HTML
                var source   = $("#provider-name").html();
                var template = Handlebars.compile(source);
                $('#providerTitle').html(template(data));
                
                var source   = $("#customer-name").html();
                var template = Handlebars.compile(source);
                $('#customerName').html(template(data));
                
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
    
    submit: function(e, reviewForm){
        
        //set server statuses
        var fStatus = new serverInfoDisplay({
                    element: $(".alert", reviewForm),
                    send: "Sending your review, please wait..",
                    success: "Success!",
                    error: ""
                });
                
        e.preventDefault();
        //console.log($('#inputRating',reviewForm).val());
        fStatus.sending();
        //console.log(that._ajaxTests);
        
        var payload = {
            "rating": {
            	"score": $('#inputRating',reviewForm).val(),
                "comments":$('#inputReviewText',reviewForm).val()
            }
        }; 
        //test ajax call  
        //$.ajax = this._ajaxResponse('{"status":"success"}', 'success');
     
       
        $.ajax({
            url: api.url + "/external/orders/" + queries.token + "/rate",
            type: "POST",
            //data: "rating="+encodeURIComponent($('#inputRating',reviewForm).val())+"&text=" + $('#inputReviewText',reviewForm).val(),
            data: payload,
            success: function(data, statusText, xhr){
              
                // 
                fStatus.success();
                $('.page').hide();
                $('.thankyou').removeClass('hidden');
                
                var source   = $("#thankyou-template").html();
                var template = Handlebars.compile(source);
                $('#thankyou-message').html(template(data));
                
                
              
            },
            error: function(data, statusText, xhr){
                //console.log(data);
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
   Review.init();
   
});