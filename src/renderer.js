var app = require('electron');
const { ipcRenderer: ipc } = require('electron');
var fs = require("fs");
var path = require("path");
var exec = require('child_process').exec;
var os = require("os")

fs.exists(path.join(os.homedir(), "./desktop-schedule-config.json"), (exists) => {

    if (exists) {

        console.log("config file exists.");

    }

    else {

        console.log("can't find config file!");
        var data = fs.readFileSync(path.join(__dirname, "./data.json"), 'utf8');
        fs.writeFileSync(path.join(os.homedir(), "./desktop-schedule-config.json"), data.toString(), "utf8")
        alert("配置文件已生成。请重新加载程序")
        window.close()

    }

});

function loadData() {
    var data = fs.readFileSync(path.join(os.homedir(), "./desktop-schedule-config.json"), 'utf8');
    return JSON.parse(data.toString());
}

function saveData(data) {
    fs.writeFileSync(path.join(os.homedir(), "./desktop-schedule-config.json"), JSON.stringify(data), "utf8")
}

function getWeekDate() {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");
    var week = weeks[day];
    return week;
}

function reload_getWeek() {
    data = loadData()
    week = getWeekDate();
    //week = "sun";
    todayCourses = data.courses[week];
}
reload_getWeek();

function buttonGroup_edit(num) {
    console.log("edit", num)
    var e_week = week;
    var editWin = window.open('./edit.html?data=' + encodeURIComponent(JSON.stringify(data)) + '&onEditNum=' + num + '&onEditWeek=' + e_week, 'test', 'width=330,height=280,top=100,left=200,frame=false,nodeIntegration=yes');
}
function buttonGroup_up(num) {
    console.log("up", num)
    if (num != 0) {
        var temp = data.courses[week][num];
        data.courses[week][num] = data.courses[week][num - 1];
        data.courses[week][num - 1] = temp;
        saveData(data);
        reloadAll();
    } else {
        alert("You can not do that!")
    }
}

function buttonGroup_down(num) {
    console.log("down", num)
    if (num != data.courses[week].length - 1) {
        var temp = data.courses[week][num];
        data.courses[week][num] = data.courses[week][num + 1];
        data.courses[week][num + 1] = temp;
        saveData(data);
        reloadAll();
    } else {
        alert("You can not do that!")
    }
}

function buttonGroup_del(num) {
    console.log("del", num)
    var r = confirm("Are you sure?");
    if (r == true) {
        data.courses[week].splice(num, 1);
        saveData(data);
        reloadAll();
    }
}

function addCourse() {
    data.courses[week].push({
        "name": "名称",
        "time_start": "00:00",
        "time_end": "00:00"
    });
    saveData(data);
    reloadAll();
}

function openFolder(id) {
    var name = todayCourses[id].name;
    var fpath = path.join(data.config.folderPath, name);
    console.log(fpath);
    exec('explorer.exe "' + fpath + '"')
}

function openConfig() {
    console.log("openConfig")
    var configWin = window.open('./config.html?data=' + encodeURIComponent(JSON.stringify(data)), 'test', 'frame=true,nodeIntegration=yes');
}


function reload_renderHtml() {
    var courseHtml = "";
    for (each in todayCourses) {
        courseHtml += `
    <div class="courses">
    <div id="course-id-`+ each + `" onclick=openFolder(` + each + `) class="course_click">
      <h2>` + todayCourses[each].name + `</h2>
      <p class="course_time">` + todayCourses[each].time_start + ` - ` + todayCourses[each].time_end + `</p>
    </div>
      <div class="course_buttons_group">
    <button type="button" class="course_buttons" id="course_button_edit" onclick=buttonGroup_edit(` + each + `)>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square"
            viewBox="0 0 16 16">
            <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z">
            </path>
            <path fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z">
            </path>
        </svg>
        Edit
    </button>

    <button type="button" class="course_buttons" id="course_button_up" onclick=buttonGroup_up(` + each + `)>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-up"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z">
            </path>
        </svg>
        Up
    </button>

    <button type="button" class="course_buttons" id="course_button_down" onclick=buttonGroup_down(` + each + `)>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-down"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z">
            </path>
        </svg>
        Down
    </button>

    <button type="button" class="course_buttons" id="course_button_del" onclick=buttonGroup_del(` + each + `)>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash"
            viewBox="0 0 16 16">
            <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z">
            </path>
            <path fill-rule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z">
            </path>
        </svg>
    </button>
</div>
    </div>`;
    }
    if (todayCourses.length == 0) {
        courseHtml += `<div class=course_nocourse><p>今日无课程</p></div>`;
    }
    courseHtml += `
    <div onclick=addCourse() class="course_add">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
</svg>
    </div>`;
    $("#course_list")[0].innerHTML = courseHtml;
}
reload_renderHtml();

function reloadAll() {
    reload_getWeek();
    reload_renderHtml();
}

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
    if (eventObj.data.action == "edit_saveforever") {
        var week = eventObj.data.data.week;
        var num = eventObj.data.data.num;
        data.courses[week][num] = eventObj.data.data.data;
        saveData(data);
        reloadAll();
    }
    if (eventObj.data.action == "config_saveforever") {
        data = eventObj.data.data.data;
        saveData(data);
        reloadAll();
    }
    console.log(eventObj.data)
})