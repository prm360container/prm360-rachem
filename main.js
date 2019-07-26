// Modules to control application life and create native browser window
const {app, dialog, BrowserWindow, Menu, shell, arg} = require('electron')
const {autoUpdater} = require('electron-updater')
const electronLocalshortcut = require('electron-localshortcut')
const notifier = require('electron-notifications')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let childWindow

app.setLoginItemSettings({
  openAtLogin: true,
  path : app.getPath("exe")
});

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 850,
    width: 1850,
    titleBarStyle: 'customButtonsOnHover',
    icon: __dirname + 'prm.ico',
    webPreferences: {
      nodeIntegration: false
    }
  })

  
  
  mainWindow.setIcon(path.join(__dirname, 'prm.ico'));
  

  // mainWindow.setMenu(null)
  mainWindow.maximize()
  // mainWindow.setResizable(false)
  //mainWindow.on('unmaximize', () => mainWindow.maximize())

  
  //mainWindow.setMenuBarVisibility(false)

  //and load the website
  
  mainWindow.loadURL("https://rachem.prm360.com/WEBDEV/prm360.html")
  

  electronLocalshortcut.register(mainWindow, 'F12', () => {
    // Open DevTools
    mainWindow.webContents.openDevTools()
  });

  electronLocalshortcut.register(mainWindow, 'F5', () => {
    // Open DevTools
    mainWindow.webContents.reload();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

let template = [
  {
    role: 'Help',
    submenu: [
      {
        label: 'App Version',
        click () { 
          notifier.notify('Current Version: ',{
          message:`Current version ${app.getVersion()}`,
          icon: 'https://www.prm360.com/frontend/web/images/logo.png',
          buttons: ['Close']
          }) 
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

app.on('ready', function()  {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();  

  
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

//setup auto updates

autoUpdater.on('error', (error) => {
  notifier.notify('Updates in Progress: ',{
    message: 'Downloading Updates',                     //error == null ? "unknown" : (error.stack || error).toString(),
    icon: 'https://www.prm360.com/frontend/web/images/logo.png',
    buttons: ['Report']
  })
})

autoUpdater.on('update-available', () => {
  notifier.notify('Updates Found', {
    message: 'Do you want update now?',
    icon: 'https://www.prm360.com/frontend/web/images/logo.png',
    buttons: ['Download']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
  })
});


autoUpdater.on('update-not-available', () => {
  notifier.notify('Stable Version Found', {
    message: ` Version ${app.getVersion()}`,
    icon: 'https://www.prm360.com/frontend/web/images/logo.png',
    buttons : ['Ignore']
  })
  
});

autoUpdater.on('update-downloaded', () => {
  notifier.notify('Update Downloaded', {
    message: 'Reset now.',
    icon: 'https://www.prm360.com/frontend/web/images/logo.png',
    buttons: ['Restart']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.quitAndInstall()
    }
  })
});