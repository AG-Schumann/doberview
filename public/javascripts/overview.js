var prefix = '';

function PopulateShifters(shift_div) {
    var shifter_template =
        '<div class="row" style="margin-top:10px;">' +
        '<div style="background-color: #e5e5e5;color: #555;margin-left: 5px; margin-right: 5px;width: 100%;">' +
        '<strong style="padding-left: 10px">{{shift_type}}</strong></div>' +
        '<div class="col-12"><i class="fa fa-user"></i>&nbsp;{{name}}</div>' +
        '<div class="col-12"><i class="fa fa-envelope"></i>&nbsp;{{email}}</div>' +
        '<div class="col-12"><i class="fa fa-phone"></i>&nbsp;{{sms}}</div></div>';

        $.getJSON(prefix + "get_current_shifters", function (data) {

            var html = "";
            for (var i in data) {
                blank_shifts = {
                    "shift_type": "Expert shifter",
                    "name": "Nobody",
                    "email": "-",
                    "sms": "-"
                };
                if (data[i]['shifter'] !== 'none')
                    html += Mustache.render(shifter_template, data[i]);
                else
                    html += Mustache.render(shifter_template, blank_shifts);
            }
            if (html != "")
                document.getElementById(shift_div).innerHTML = html;
        });
}

function PopulateHosts(host_div){
    var host_template = '<div class="row" style="margin-top:10px;">' +
        '<div style="background-color: #e5e5e5;color: #555;margin-left: 5px; margin-right: 5px;width: 100%;">' +
        '<strong style="padding-left: 10px">{{hostname}}</strong></div>' +
        '<div class="col-12"><i class="fas fa-heartbeat"></i>&nbsp;{{heartbeat}}</div></div>';

    $.getJSON(prefix + "get_host_status", function (data) {

        var html = "";
        for (var i in data) {
            blank_hosts = {
                "hostname": "I AM HOST",
                "heartbeat": "-",
            };
            if (data[i]['hostname'] !== 'none')
                html += Mustache.render(host_template, data[i]);
            else
                html += Mustache.render(host_template, blank_shifts);
        }
        if (html != "")
            document.getElementById(host_div).innerHTML = html;

    });

}