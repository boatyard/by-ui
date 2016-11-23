var serverInfoDisplay = function (data) {

    this.success = function () {
        //this.element.parent().find(".action-button").removeAttr('disabled');
        $('.action-button').removeAttr('disabled');
        this.element.find(".status").html(this.successCopy);
        this.element.removeClass('alert-warning');
        this.element.addClass('alert-success fade in');

    };

    this.error = function (message) {
        //this.element.parent().find(".action-button").removeAttr('disabled');
        $('.action-button').removeAttr('disabled');
        this.element.find(".status").html(this.errorCopy + " " + message);
        this.element.removeClass('alert-warning');
        this.element.addClass('alert-danger fade in');

    };

    this.sending = function () {

        this.element.find(".status").html(this.sendingCopy);
        //this.element.parent().find(".action-button").attr('disabled', 'disabled');
        $('.action-button').attr('disabled', 'disabled');
        this.element.removeClass('alert-success');
        this.element.removeClass('alert-danger');
        this.element.addClass('alert-warning fade in');
        this.element.removeClass('hidden');

    };

    this.element = data.element;
    this.successCopy = "Success!";
    this.errorCopy = "There was an error";
    this.sendingCopy = "Sending please wait.";

    if (data.send != undefined) {
        this.sendingCopy = data.send;
    }
    if (data.success != undefined) {
        this.successCopy = data.success;
    }
    if (data.error != undefined) {
        this.errorCopy = data.error;
    }

    return this;
};


var api = {
    //url: 'http://boatyard-sass.dev.geno.me/api/v1',
    url: 'https://ahoy.boatyard.com/api/v1',
}

var queries = {};
$.each(document.location.search.substr(1).split('&'), function(c,q){
    var i = q.split('=');
    if(!jQuery.isEmptyObject(q)){
        queries[i[0].toString()] = i[1].toString();
    }
    
});


if(queries.user_token){
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', queries.user_token);
        }
    });
    
}


Handlebars.registerHelper('moment', function (context, block) {
    if (window.moment) {
        
        if(block.hash.format){
            //{{moment creation_date format="MMMM YYYY"}}
            var f = block.hash.format || "MM/DD/YYYY hh:mm A";
            return moment(context).format(f); //had to remove Date(context)
        }
        
        if(block.hash.fromNow == ""){
            //{{moment creation_date fromNow=""}}
            return moment(context).fromNow(); //had to remove Date(context)
        }
        
        return context;
        
    } else {
        return context;   //  moment plugin not available. return data as is.
    }
    ;
});

Handlebars.registerHelper('accounting', function (context, block) {
    if (window.accounting) {
        
        if(block.hash.formatMoney == ""){
            //{{moment creation_date fromNow=""}}
            return accounting.formatMoney(context, "$", 2);
        }
        
        return context;
        
    } else {
        return context;   //  moment plugin not available. return data as is.
    }
    ;
});

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    //{{math cost "*" quantity}}
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});