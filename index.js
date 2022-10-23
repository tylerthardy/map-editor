// TODO: Make typescript
const { app, BrowserWindow, ipcMain, Menu, nativeTheme, dialog } = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

let menuVisibility = true;
let menuState = Menu.getApplicationMenu();

let mainWindow;

function onReady() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      // https://github.com/electron/electron/issues/9920#issuecomment-575839738
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  });
  mainWindow.loadURL('http://localhost:4200');
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

  ipcMain.on('save-file', () => {
    let content = 'Some text to save into the file';
    dialog.showSaveDialog((fileName) => {
      if (fileName === undefined) {
        console.log("You didn't save the file");
        return;
      }

      // fileName is a string that contains the path and filename created in the save file dialog.
      fs.writeFile(fileName, content, (err) => {
        if (err) {
          alert('An error ocurred creating the file ' + err.message);
        }

        alert('The file has been succesfully saved');
      });
    });
  });

  ipcMain.on('open-file', (event, data) => {
    dialog.showOpenDialog(mainWindow).then((openDialogReturnValue) => {
      const { canceled, filePaths } = openDialogReturnValue;
      if (canceled) {
        console.log('open dialog canceled');
        return;
      }
      if (filePaths === undefined || filePaths.length === 0) {
        console.log('no file selected');
        return;
      }

      const filePath = filePaths[0];
      const dataBuffer = fs.readFileSync(filePath);
      console.log('main: sending file-loading', dataBuffer);
      event.sender.send('file-loading', dataBuffer);

      // fs.readFile(filePath, 'utf-8', (err, data) => {
      //   console.log('in:readfile');
      //   if (err) {
      //     console.log(err);
      //     alert('An error ocurred reading the file :' + err.message);
      //     return;
      //   }

      //   // Change how to handle the file content
      //   console.log('The file content is : ' + data);
      // });
      // console.log('after:readfile');
    });
  });
}

app.on('ready', onReady);
