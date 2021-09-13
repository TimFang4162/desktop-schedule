// Modules to control application life and create native browser window

const {
  app,
  BrowserWindow,
  ipcMain,
  screen
} = require('electron')
const path = require('path')
//var exec = require('child_process').exec;

var mainWindow_g;

//exec('explorer.exe "C:\\"')

function createWindow() {
  // Create the browser window.
  var winh = screen.getPrimaryDisplay().workAreaSize.height
  const mainWindow = new BrowserWindow({
    width: 200,
    height: winh,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    webPreferences: {
      //preload: path.join(__dirname, 'src/preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  console.log(winh);
  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  mainWindow_g = mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



ipcMain.on('min', e => mainWindow_g.minimize());
ipcMain.on('max', e => {
  if (mainWindow_g.isMaximized()) {
    mainWindow_g.unmaximize()
  } else {
    mainWindow_g.maximize()
  }
});
ipcMain.on('close', e => mainWindow_g.close());
ipcMain.on('resize', (event, arg) => {
  console.log(arg);
  mainWindow_g.setSize(arg, 1030)
});