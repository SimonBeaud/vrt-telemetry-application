const electron = require("electron");
const path = require("path");
const screen = electron.screen;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
    // Create the browser window.
    const { Width, Height } = screen.getPrimaryDisplay().workAreaSize;


    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
    });
    // and load the index.html of the app.
    console.log(__dirname);
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
}

app.on("ready", createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});