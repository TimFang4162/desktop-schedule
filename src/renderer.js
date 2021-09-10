// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var app = require('electron').remote;
const {ipcRenderer: ipc} = require('electron');
//app.BrowserWindow.getFocusedWindow().openDevTools();
//
//// Close app 
//document.getElementById("close").addEventListener("click", () => {
//    app.BrowserWindow.getFocusedWindow().close();
//    console.log("cl");
//}, false);
//
//// Close app 
//document.getElementById("devtools").addEventListener("click", () => {
//    app.BrowserWindow.getFocusedWindow().openDevTools();
//    console.log("de");
//}, false);

window.localStorage.setItem('course-data', `{
    "mon": [
        {
            "name": "英语",
            "time_start": "8:00",
            "time_end": "8:40"
        },
        {
            "name": "数学",
            "time_start": "8:50",
            "time_end": "9:30"
        },
        {
            "name": "信技",
            "time_start": "10:00",
            "time_end": "10:40"
        },
        {
            "name": "语文/心理",
            "time_start": "10:55",
            "time_end": "11:35"
        },
        {
            "name": "科学",
            "time_start": "13:50",
            "time_end": "14:30"
        },
        {
            "name": "社会",
            "time_start": "14:45",
            "time_end": "15:25"
        },
        {
            "name": "语文",
            "time_start": "15:35",
            "time_end": "16:15"
        }
    ],
    "tue": [
        {
            "name": "科学",
            "time_start": "8:00",
            "time_end": "8:40"
        },
        {
            "name": "英语",
            "time_start": "8:50",
            "time_end": "9:30"
        },
        {
            "name": "数学",
            "time_start": "10:00",
            "time_end": "10:40"
        },
        {
            "name": "语文",
            "time_start": "10:55",
            "time_end": "11:35"
        },
        {
            "name": "体育",
            "time_start": "13:50",
            "time_end": "14:30"
        },
        {
            "name": "社会",
            "time_start": "14:45",
            "time_end": "15:25"
        },
        {
            "name": "探索",
            "time_start": "15:35",
            "time_end": "16:15"
        }
    ],
    "wed": [
        {
            "name": "英语",
            "time_start": "8:00",
            "time_end": "8:40"
        },
        {
            "name": "科学",
            "time_start": "8:50",
            "time_end": "9:30"
        },
        {
            "name": "自修",
            "time_start": "10:00",
            "time_end": "10:40"
        },
        {
            "name": "社会",
            "time_start": "10:55",
            "time_end": "11:35"
        },
        {
            "name": "语文",
            "time_start": "13:50",
            "time_end": "14:30"
        },
        {
            "name": "音乐",
            "time_start": "14:45",
            "time_end": "15:25"
        },
        {
            "name": "班队",
            "time_start": "15:35",
            "time_end": "16:15"
        }
    ],
    "thu": [
        {
            "name": "数学",
            "time_start": "8:00",
            "time_end": "8:40"
        },
        {
            "name": "科学",
            "time_start": "8:50",
            "time_end": "9:30"
        },
        {
            "name": "英语",
            "time_start": "10:00",
            "time_end": "10:40"
        },
        {
            "name": "语文",
            "time_start": "10:55",
            "time_end": "11:35"
        },
        {
            "name": "体育",
            "time_start": "13:50",
            "time_end": "14:30"
        },
        {
            "name": "信技",
            "time_start": "14:45",
            "time_end": "15:25"
        },
        {
            "name": "社会",
            "time_start": "15:35",
            "time_end": "16:15"
        }
    ],
    "fri": [
        {
            "name": "语文",
            "time_start": "8:00",
            "time_end": "8:40"
        },
        {
            "name": "数学",
            "time_start": "8:50",
            "time_end": "9:30"
        },
        {
            "name": "科学",
            "time_start": "10:00",
            "time_end": "10:40"
        },
        {
            "name": "社会",
            "time_start": "10:55",
            "time_end": "11:35"
        },
        {
            "name": "英语",
            "time_start": "13:50",
            "time_end": "14:30"
        },
        {
            "name": "体育",
            "time_start": "14:45",
            "time_end": "15:25"
        },
        {
            "name": "美术",
            "time_start": "15:35",
            "time_end": "16:15"
        }
    ],
    "sat": [],
    "sun": []
}`);
var courses = JSON.parse(window.localStorage.getItem("course-data"));

function getWeekDate() {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");
    var week = weeks[day];
    return week;
}
var week = getWeekDate();
//var week = "mon";
todayCourses = courses[week];
console.log(todayCourses)
var courseHtml = "";
for (each in todayCourses) {
    courseHtml += `
    <div class="courses">
      <h2>` + todayCourses[each].name + `</h2>
      <p>` + todayCourses[each].time_start + ` - ` + todayCourses[each].time_end + `</p>
    </div>`;
    //console.log(each)
}
$("#course_list")[0].innerHTML = courseHtml;

var win_height = 824;
var course_size = (win_height - 10 * (todayCourses.length + 1)-50) / (todayCourses.length );
console.log(course_size)
$(".courses").css("width", course_size/0.618);
$(".courses").css("height", course_size);
//ipc.send('resize', course_size / 0.618 + 30);
//console.log()
document.getElementById("closeButton").addEventListener("click", () => {
    console.log("cl");
    ipc.send('close');
    app.BrowserWindow.getFocusedWindow().close();
}, false);


$("html").hover(function () {
    $("#actions").css("display", "inline-flex");
},
function () {
    $("#actions").css("display", "none");
});
