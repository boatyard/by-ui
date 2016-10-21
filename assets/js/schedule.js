
var Schedule = {
    chosenTime: null,
    providerName: null,
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
        
        //console.log("populating times")
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
        //$.ajax = this._ajaxResponse('{"status":"success-get-data"}', 'success');
     
        $.ajax({
            url: api.url + "/external/orders/" + queries.token,
            type: "GET", 
            //data: "rating="+encodeURIComponent($('#inputRating',reviewForm).val())+"&text=" + $('#inputReviewText',reviewForm).val(),
            success: function(data, statusText, xhr){
                
                //fill in the variables from response into HTML
               
                
                
                var source   = $("#thankyou-template").html();
                var template = Handlebars.compile(source);
                $('#thankyou-message').html(template(data));
                
                var source   = $("#no-time-template").html();
                var template = Handlebars.compile(source);
                $('#no-time-message').html(template(data));
               
                //console.log(data);
                that.providerName = data.order.provider.name;
                that.getOrderTimes();
                //$( ".loading" ).fadeOut("slow");
                
                
            },
            error: function(data, statusText, xhr){
                that.orderDetailsError();
                
            }
     
        });    
        
    },
    
    getOrderTimes: function(){
        
        var that = this;
        
        //test ajax call
        //$.ajax = this._ajaxResponse('{"status":"success-get-data"}', 'success');
     
        $.ajax({
            url: api.url + "/external/orders/" + queries.token + "/show_time_slots",
            type: "GET", 
            //data: "rating="+encodeURIComponent($('#inputRating',reviewForm).val())+"&text=" + $('#inputReviewText',reviewForm).val(),
            success: function(data, statusText, xhr){
                
                var noTimeLabel = "None of these times work for me.";
                var timeLabel = "times";
                
                //console.log(data.time_slots.length);
                if(data.time_slots){
                    if(data.time_slots.length == 1){
                        noTimeLabel = "This time doesn't work for me.";
                        timeLabel = "time";
                    }
                    
                }
                
                data.no_time_label = noTimeLabel;
                data.provider_name = that.providerName;
                data.time = timeLabel;
                
                //fill in the variables from response into HTML
                var source   = $("#time-slots-template").html();
                var template = Handlebars.compile(source);
                $('#timeSlots').html(template(data));
                
                
                var source   = $("#title-template").html();
                var template = Handlebars.compile(source);
                $('#title').html(template(data));
                
                
                $( ".loading" ).fadeOut("slow");
                that.populateTimes();
                
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
        //$.ajax = this._ajaxResponse('{"status":"success"}', 'success');
        
        var callUrl = api.url + "/external/orders/" + queries.token + "/confirm_schedule/" + that.chosenTime;
       
        if(that.chosenTime == 0){
            callUrl = api.url + "/external/orders/" + queries.token + "/reject_schedules";
        }
        
        $.ajax({
            url: callUrl,
            type: "PUT",
            //data: "time="+encodeURIComponent($('#inputRating',scheduleForm).val()),
            success: function(data, statusText, xhr){
              
               
                fStatus.success();
                $('.page').hide();
                
                
                if(that.chosenTime == 0){
                    $('.no-time').removeClass('hidden');
                }else{
                    $('.thankyou').removeClass('hidden');
                }
                
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