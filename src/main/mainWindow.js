import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'
import * as utils from './utils'
const exec = require('child_process').exec
const { ipcMain, BrowserWindow, shell, app, dialog } = require('electron')

utils.migrateConfig()

function courseClick (course) {
  if (course.action === 'openFtp') {
    exec(`explorer.exe ftp://${course.config.$ftp_user}:${course.config.$ftp_pwd}@${course.config.$ftp_ip}/${course.config.$ftp_folder}`)
  }
  if (course.action === 'runCommand') {
    exec(course.config.$command)
  }
  if (course.action === 'openPath') {
    shell.openPath(course.config.$path)
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
  ipcMain.handle('getMetadata', utils.getMetadata)
  ipcMain.handle('readConfig', utils.readConfig)
  ipcMain.handle('selectFolder', async () => {
    return await dialog.showOpenDialogSync({ properties: ['openDirectory'] })
  })
  ipcMain.on('saveConfig', (event, data) => {
    utils.saveConfig(data)
  })
  ipcMain.on('courseClick', (event, data) => {
    courseClick(data)
  })
  ipcMain.on('setStartWithSystem', (event, data) => {
    utils.setStartWithSystem(data)
  })
  ipcMain.on('openDevTools', (event, data) => {
    _browserWindow.webContents.openDevTools()
  })
  ipcMain.on('openConfigFolder', (event, data) => {
    shell.showItemInFolder(path.join(app.getPath('userData'), 'schedule-config.json'))
  })
  ipcMain.on('openExternal', (event, data) => {
    shell.openExternal(data)
  })
  ipcMain.on('set-ignore-mouse-events', (event, ...args) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win.setIgnoreMouseEvents(...args)
  })
})

export default winHandler
