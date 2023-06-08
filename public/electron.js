const electron = require("electron");
const path = require("path");
const screen = electron.screen;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const server = require("../src/Server/UDPServer");
const {getDatabase, addSession, deleteAllSessions, addDataType, setCurrentSession} = require('../src/DataBase/Database');
const { getSessions } = require('../src/DataBase/Database');
const { ipcMain } = require('electron');
const DataTypeJson = require('../src/DataBase/Data/DataTypesTables.json');



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

    //init database
    const database = getDatabase();
    addDataType(DataTypeJson);





    //######################################################################################
    //Live Data connexion at the lauching time


    //CODE GENERE; A MODIFIER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    mainWindow.webContents.on('did-finish-load', () => {
        server.start();

        let pressure = server.getPressureData();
        console.log("Pressure data: " + pressure);

        const updatePressure = () => {
            pressure = server.getPressureData();
            mainWindow.webContents.send('update-pressure', pressure);
        };

        updatePressure();

        setInterval(updatePressure, 100);


        //send the DB to the views
        mainWindow.webContents.send('database', database);
    });


    //######################################################################################



}
app.on("ready", createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});



//######################################################################################################################
//Communication between electron process and front process
ipcMain.handle('add-current-session', async (event, sessionId) => {
    await SendCurrentSessionToDB(sessionId);
});

const SendCurrentSessionToDB = async(sessionId)=>{
    await setCurrentSession(sessionId);
}






//generate code
ipcMain.handle('get-sessions', async () => {
    return getSessions();
});



//Send the add session
ipcMain.handle('add-session', async(event, args)=>{
    const{name, pilot, date}=args;
    try{
        const sessionId = await addSession(name, pilot, date);
        return{success: true, sessionId};
    }catch (err){
        return{success: false, error: err.message};
    }
});


ipcMain.handle('delete-sessions', async ()=>{
    return deleteAllSessions();
})

