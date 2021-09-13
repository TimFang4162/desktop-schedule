var app = require('electron');
const { ipcRenderer: ipc } = require('electron');
var fs = require("fs");
var path = require("path");
var exec = require('child_process').exec;


function loadData() {
    var data = fs.readFileSync(path.join(__dirname, "./data.json"), 'utf8');
    return JSON.parse(data.toString());
}

function saveData(data) {
    fs.writeFileSync(path.join(__dirname, "./data.json"), JSON.stringify(data), "utf8")
}

function getWeekDate() {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");
    var week = weeks[day];
    return week;
}

var data = loadData()
var week = getWeekDate();
//var week = "mon";
todayCourses = data.courses[week];

function openEdit(num, week) {
    var editWin = window.open('./edit.html?data=' + encodeURIComponent(JSON.stringify(data)) + '&onEditNum=' + num + '&onEditWeek=' + week, 'test', 'width=330,height=260,top=100,left=200,frame=false,nodeIntegration=yes');
}

function openFolder(id) {
    var name = todayCourses[id].name;
    var path = data.config.folderPath + '\\' + name;
    console.log(path);
    exec('explorer.exe "' + path + '"')
}


var courseHtml = "";
for (each in todayCourses) {
    courseHtml += `
    <div class="courses">
    <div id="course-id-`+ each + `" onclick=openFolder(` + each + `)>
      <h2>` + todayCourses[each].name + `</h2>
      <p class="course_time">` + todayCourses[each].time_start + ` - ` + todayCourses[each].time_end + `</p>
    </div>
      <div></div>
    </div>`;
    //$("#course-id-" + each).on("click", function () {
    //    console.log(each)
    //});
    //console.log(each)
}
$("#course_list")[0].innerHTML = courseHtml;

document.getElementById("close_button").addEventListener("click", () => {
    console.log("cl");
    ipc.send('close');
    app.BrowserWindow.getFocusedWindow().close();
}, false);

var actions_dropdown_status = false;

$("#actions_button").on("click", function () {
    if (actions_dropdown_status == false) {
        $("#dropdown_actions").css("display", "block");
        actions_dropdown_status = true;
    } else {
        $("#dropdown_actions").css("display", "none");
        actions_dropdown_status = false;
    }
});

window.addEventListener("message", (eventObj) => {
    console.log(eventObj.data)
})