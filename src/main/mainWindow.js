import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'
// const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const { app, ipcMain } = require('electron')

const configPath = path.join(app.getPath('userData'), 'schedule-config.json')
const exampleConfigPath = app.isPackaged
  ? path.join(__dirname, '../../../example-config.json')
  : path.join(__dirname, '../extraResources/example-config.json')

console.log('Dirname', __dirname)
console.log('ExampleConfig', exampleConfigPath)
console.log('Config', configPath)
fs.stat(
  configPath,
  function (err, stats) {
    if (!err) {
      console.log('Config file exists.')
    } else {
      console.warn("Can't find config file!")
      const example = fs.readFileSync(exampleConfigPath, 'utf8')
      console.log(example)
      fs.writeFileSync(
        configPath,
        example.toString(),
        'utf8'
      )
      console.log('Config file generated.')
    }
  }
)
function readConfig () {
  const data = fs.readFileSync(
    configPath,
    'utf8'
  )
  return JSON.parse(data.toString())
}

function saveConfig (data) {
  fs.writeFileSync(
    configPath,
    JSON.stringify(data),
    'utf8'
  )
}

function courseClick (course) {
  shell.config.execPath = shell.which('node').toString()
  shell.config.silent = true
  shell.exec('explorer')
  console.log(course)
}

const winHandler = new BrowserWinHandler({
  height: 600,
  width: 1000,
  frame: false,
  transparent: true
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/')
  _browserWindow.maximize()
  ipcMain.handle('readConfig', readConfig)
  ipcMain.on('saveConfig', (event, data) => {
    saveConfig(data)
  })
  ipcMain.on('courseClick', (event, data) => {
    courseClick(data)
  })
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
