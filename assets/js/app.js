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



