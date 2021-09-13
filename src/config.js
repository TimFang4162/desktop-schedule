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
data = JSON.parse(data);
console.log(data);
$("#folderPath")[0].value = data.config.folderPath;

$("#save_forever").on("click", function () {
    data.config.folderPath = $("#folderPath")[0].value;
    window.opener.postMessage({ action: "config_saveforever", data: { data: data } });
    window.close()
});
$("#save_cancel").on("click", function () {
    window.close()
});