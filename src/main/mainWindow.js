// import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'
import * as utils from './utils'
// const fs = require('fs')
const shell = require('shelljs')
const { ipcMain } = require('electron')
// const configPath = path.join(app.getPath('userData'), 'schedule-config.json')
// const exampleConfigPath = utils.getResPath('example-config.json')
// const metadataPath = utils.getResPath('meta.json')
// const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))

// console.log('Dirname', __dirname)
// console.log('ExampleConfig', exampleConfigPath)
// console.log('Config', configPath)
// console.log('Metadata', metadataPath)
// const appVersion = metadata.appVersion

utils.migrateConfig()

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
  ipcMain.handle('readConfig', utils.readConfig)
  ipcMain.on('saveConfig', (event, data) => {
    utils.saveConfig(data)
  })
  ipcMain.on('courseClick', (event, data) => {
    courseClick(data)
  })
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
