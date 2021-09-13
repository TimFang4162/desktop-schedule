//var app = require('electron');
//app.webFrame.setZoomLevel(-1)
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
var data = decodeURIComponent(getQueryVariable("data"));
var onEdit_week = getQueryVariable("onEditWeek")
var onEdit_num = Number(getQueryVariable("onEditNum"))
console.log(onEdit_week, onEdit_num);
data = JSON.parse(data).courses[onEdit_week][onEdit_num]


$("body > div > div:nth-child(2) > input")[0].value = data.name;
$("body > div > div:nth-child(4) > input:nth-child(1)")[0].value = data.time_start.split(":")[0];
$("body > div > div:nth-child(4) > input:nth-child(3)")[0].value = data.time_start.split(":")[1];
$("body > div > div:nth-child(6) > input:nth-child(1)")[0].value = data.time_end.split(":")[0];
$("body > div > div:nth-child(6) > input:nth-child(3)")[0].value = data.time_end.split(":")[1];

$("#save_temp").on("click", function () {

});
$("#save_forever").on("click", function () {
    data.name = $("body > div > div:nth-child(2) > input")[0].value;
    data.time_start = $("body > div > div:nth-child(4) > input:nth-child(1)")[0].value + ":" + $("body > div > div:nth-child(4) > input:nth-child(3)")[0].value;
    data.time_end = $("body > div > div:nth-child(6) > input:nth-child(1)")[0].value + ":" + $("body > div > div:nth-child(6) > input:nth-child(3)")[0].value;
    window.opener.postMessage({ action: "edit_saveforever", data: { week: onEdit_week, num: onEdit_num, data: data } });
    window.close()
});
$("#save_cancel").on("click", function () {
    window.close()
});