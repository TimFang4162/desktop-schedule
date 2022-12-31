import BrowserWinHandler from './BrowserWinHandler'
import * as utils from './utils'
const exec = require('child_process').exec
const { ipcMain, BrowserWindow } = require('electron')

utils.migrateConfig()

function courseClick (course) {
  if (course.action === 'openFtp') {
    exec(`explorer.exe ftp://${course.config.$ftp_user}:${course.config.$ftp_pwd}@${course.config.$ftp_ip}/${course.config.$ftp_folder}`)
  }
  if (course.action === 'runCommand') {
    exec(course.config.$command)
  }
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
  ipcMain.on('setStartWithSystem', (event, data) => {
    utils.setStartWithSystem(data)
  })
  ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.setIgnoreMouseEvents(...args)
  })
})

export default winHandler
