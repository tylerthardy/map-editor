// TODO: Make typescript
const { app, BrowserWindow, ipcMain, Menu, nativeTheme } = require('electron');
const url = require('url');
const path = require('path');

let menuVisibility = true;
let menuState = Menu.getApplicationMenu();
console.log(menuState);

function onReady() {
  win = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadURL('http://localhost:4200');
  nativeTheme.themeSource = 'dark';

  ipcMain.on('toggle-menu', () => {
    menuVisibility = !menuVisibility;
    if (menuVisibility) {
      menuState = Menu.getApplicationMenu();
      Menu.setApplicationMenu(null);
    } else {
      Menu.setApplicationMenu(menuState);
    }
    console.log('menuState after', menuState);
  });
}

app.on('ready', onReady);
