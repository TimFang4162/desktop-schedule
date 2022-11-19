import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'
// const path = require('path')
const fs = require('fs')
const { app, ipcMain } = require('electron')

const configPath = path.join(app.getPath('userData'), 'schedule-config.json')
fs.stat(
  configPath,
  function (err, stats) {
    if (!err) {
      console.log('Config file exists.')
    } else {
      console.warn("Can't find config file!")
      const example = fs.readFileSync(path.join(__dirname, './example-config.json'), 'utf8')
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
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
