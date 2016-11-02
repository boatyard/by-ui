

var Message = {
    conversation_id: null,
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
        
        this.getOrderMessages();
        
        
        //get the form ready
        messageForm.submit(function (e) {
            
            that.submit(e, this); 
          
        });
        
    },
    
    getOrderMessages: function(){
        
        var that = this;
        
        //test ajax call
        //$.ajax = this._ajaxResponse('{"status":"success-get-data"}', 'success');
     
        $.ajax({
            url:  api.url + "/external/orders/" + queries.token + "/conversations",
            type: "GET",
            success: function(data, statusText, xhr){
                
                //sort latest last
                if(data.conversation.comments){
                    data.conversation.comments.sort(function(a,b) {return (a.created_at > b.created_at) ? 1 : ((b.created_at < a.created_at) ? -1 : 0);} ); 
                }
                
                //get last sender
                if(data.conversation.comments){
                     data.sender = data.conversation.comments[data.conversation.comments.length-1].commenter_name;
                }
                //console.log(data);
                that.conversation_id = data.conversation.id;
                //console.log(data.conversation.id);
                //fill in the variables from response into HTML
                var source   = $("#thread-template").html();
                var template = Handlebars.compile(source);
                $('.thread').html(template(data));
                
                var source   = $("#title-template").html();
                var template = Handlebars.compile(source);
                $('#title').html(template(data));
                
                $( ".loading" ).fadeOut("slow");
               
            },
            error: function(data, statusText, xhr){
                that.orderMessagesError();
                
            }
     
        });    
        
    },
    
    orderMessagesError: function(){
        $( ".loading" ).fadeOut("slow");
        $('.page').hide();
        $('.error-message').removeClass('hidden');
          
    },
    
    submit: function(e, reviewForm){
        
        var that = this;
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
        //$.ajax = this._ajaxResponse('{"status":"success"}', 'success');
        
        var payload = {
        	"conversation": {
        		"message": {
        			"body": $('#inputReply',reviewForm).val(),
        			"commenter_id": queries.commenter_id,
        			"commenter_type": "Customer",
        			"is_provider_note": false
        		}
        	}
        }; 
        
       
        $.ajax({
            url: api.url + "/external/orders/" + queries.token + "/conversations/"+ that.conversation_id,
            type: "PUT",
            data: payload,
            success: function(data, statusText, xhr){
              
                
              
                
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
   Message.init();
   
});