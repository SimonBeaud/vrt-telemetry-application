const electron = require("electron");
const path = require("path");
const screen = electron.screen;
const app = electron.app;
const server = require("../src/Server/UDPServer");
const { getSessions } = require('../src/DataBase/Database');
const { ipcMain, dialog, BrowserWindow } = require('electron');
const DataTypeJson = require('../src/DataBase/Data/DataTypesTables.json');
const async = require("async");
const csv = require('csv-parser');
const fs = require("fs");
const moment = require('moment');
const {getDatabase, addSession, deleteSession, addDataType, setCurrentSession, getDataValues,
    deleteDataValues, getDataValueBySession, addDataValue, getDataTypeID, getAllSessions
} = require('../src/DataBase/Database');


//variable declaration

let isConnected = false;
let mainWindow;
let progressBarWindow;
let database = null;


//######################################################################################################################
//Electron main windows creation



function createWindow(){

    //basic configuration
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {nodeIntegration: true, contextIsolation: false}
    });

    //load the index of the application
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));

    //init the database when creating the window
    database = getDatabase();
    addDataType(DataTypeJson).then();
    mainWindow.webContents.send('database', database);

    //handle server start to display process
    ipcMain.on('start-server', () =>{
        server.start();
    })

    //received live data in the window when server is started
    mainWindow.webContents.on('did-finish-load', ()=>{
        let LiveData = server.getLiveData();
        const updateLiveData = () =>{
            LiveData = server.getLiveData();
            mainWindow.webContents.send('get-live-data', LiveData);
            isConnected = server.getConnectedStatus();
            mainWindow.webContents.send('connected-status', isConnected);
        }
        updateLiveData();
        setInterval(updateLiveData, 100);
    })
}
app.on("ready", createWindow);

app.on("window-all-closed", function (){
    if (process.platform !== 'darwin') app.quit();
    //setInterval(null);
})


//######################################################################################################################
//Communication between electron processes


//__________________________________________
//Session operations
//__________________________________________


//handle get all session
ipcMain.handle('get-sessions', async() =>{
    return getAllSessions();
});



//handle add a new session
ipcMain.handle('add-session', async(event, parameters) =>{
    const{name, pilot, date}=parameters
    try{
        const session = await addSession(name, pilot, date);
        return{success: true, session};
    }catch (err){
        return {success: false, error: err.message};
    }
});



//handle delete a session
ipcMain.handle('delete-session', async(event, parameter) =>{
    const {sessionID}= parameter;
    return deleteSession(sessionID);
});



//handle Add current session
ipcMain.handle('add-current-session', async(event, parameter) =>{
    await SendCurrentSessionToDB(parameter);
});
const SendCurrentSessionToDB = async(parameter)=>{
    await setCurrentSession(parameter);
}




//__________________________________________
//DataType operations
//__________________________________________



//handle get datatype ID
ipcMain.handle("get-datatype-id", async(event, parameter) =>{
    const {dataTypeName} = parameter;
    try{
        const dataTypeID = await getDataTypeID(dataTypeName);
        return{success: true, dataTypeID};
    }catch (err){
        return{success: false, error: err};
    }
})



//__________________________________________
//DataValue operations
//__________________________________________

//handle get DataValues by session
ipcMain.handle('get-values-bySession', async(event, parameter) =>{
    const {sessionId} = parameter;
    try{
        const dataValues = await getDataValueBySession(sessionId);
        return{success: true, dataValues};
    }catch (err){
        return{success: false, error: err};
    }
})



//handle delete DataValues by session
ipcMain.handle('delete-data-value', async(event, parameter) =>{
    const{sessionId} = parameter;
    return deleteSession(sessionId);
})



//handle addDataValues by CSV
ipcMain.on('add-datavalues-csv', (event, parameters) =>{
    const window = BrowserWindow.getFocusedWindow();


    //open the dialog to choose the csv
    dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [{name: 'CSV Files', extensions: ['csv']}],
    })
        .then((result) =>{
        if(!result.canceled && result.filePaths.length >0){
            const filePath = result.filePaths[0];
            const readStream = fs.createReadStream(filePath);
            const csvParser = csv({separator: ';'});
            let totalDataCount = 0;
            let processedDataCount = 0;

            //Create a progress window
            const progressBarWindow = new BrowserWindow({
                parent: window,
                modal: true,
                show: false,
                width: 400,
                height: 150,
                frame: true,
                webPreferences: {
                    nodeIntegration: true,
                },
            })

            //Loading the progress page
            progressBarWindow.loadURL(
                `file://${path.join(__dirname, 'progressBar.html')}`
            ).then(() => {
                progressBarWindow.show();
            });

            const progressBarWebContents = progressBarWindow.webContents;

            const processDataPromise = new Promise((resolve, reject) =>{
                csvParser.on('data', (data) =>{
                    const sessionID = null;
                    const timeRecordMilliseconds = data[Object.keys(data)[0]];
                    const timeRecord = moment(parseInt(timeRecordMilliseconds)).toISOString();
                    const columnNames = Object.keys(data);
                    const values = Object.values(data);

                    //Reading the csv content and adding to database
                    for (let i = 1; i < columnNames.length; i++) {
                        const columnName = columnNames[i];
                        const value = values[i];

                        if (value !== null && value !== '') {
                            totalDataCount++;

                            addDataValue(sessionID, columnName, value, timeRecord)
                                .then((lastID) => {
                                    processedDataCount++;
                                    const progress = Math.round((processedDataCount / totalDataCount) * 100);

                                    progressBarWebContents.send('update-progress', progress);

                                    progressBarWindow.webContents.on('did-finish-load', () => {
                                        progressBarWebContents.send('total-data-count', totalDataCount);
                                    });

                                    const message = `DataValue added with the id: ${lastID}`;
                                    console.log(message);

                                    if (processedDataCount === totalDataCount) {
                                        resolve();
                                    }
                                })
                                .catch((err) => {
                                    console.log('Error when adding the dataValue: ' + err);
                                    reject(err);
                                });
                        }

                    }
                });
            });
            processDataPromise
                .then(() => {
                    progressBarWindow.close();

                    dialog.showMessageBox(window, {
                        type: 'info',
                        message: 'CSV file load successfully, please reload the data to see them!',
                        buttons: ['OK'],
                    });
                })
                .catch((err) => {
                    console.log('Error during CSV file processing: ' + err);
                });

            readStream.pipe(csvParser);
        }
    });
});