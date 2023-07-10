

const electron = require("electron");
const path = require("path");
const screen = electron.screen;
const app = electron.app;
const server = require("../src/Server/UDPServer");
const {getDatabase, addSession, deleteAllSessions, addDataType, setCurrentSession, getDataValuesBySessionAndDataType,
    deleteAllDataValue, getDataValuesBySession, addDataValue, getDataTypeID, addDataValueFromCSV
} = require('../src/DataBase/Database');
const { getSessions } = require('../src/DataBase/Database');
const { ipcMain, dialog, BrowserWindow } = require('electron');
const DataTypeJson = require('../src/DataBase/Data/DataTypesTables.json');
const async = require("async");
const csv = require('csv-parser');
const fs = require("fs");
let isConnected = false;
let mainWindow;
let progressBarWindow;
let database = null;


function createWindow() {

    // Create the browser window.
    const { Width, Height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: { nodeIntegration: true, contextIsolation: false },
    });
    // and load the index.html of the app.
    //console.log(__dirname);
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));

    //init database
    database = getDatabase();
    addDataType(DataTypeJson);
    console.log("isConnected: "+isConnected);

    ipcMain.on('start-server', () => {
        server.start();
    });




    //######################################################################################
    //Live Data connexion at the lauching time


    //CODE GENERE; A MODIFIER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    mainWindow.webContents.on('did-finish-load', () => {
        //server.start();

        let LiveData = server.getLiveData();


        const updateLiveData = () =>{
            LiveData = server.getLiveData();
            mainWindow.webContents.send('get-live-data', LiveData);
            isConnected = server.getConnectedStatus();
            mainWindow.webContents.send('ConnectedStatus', isConnected);
        }


        updateLiveData();

        setInterval(updateLiveData, 100);
        //setInterval(updateTensionBatteryHV, 100);



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

ipcMain.handle('deleteDataValues', async ()=> {
    return deleteAllDataValue();
})


ipcMain.handle("get-values-bySession", async(event, args)=>{
    const{sessionId}=args;
    try{
        const dataValues=await getDataValuesBySession(sessionId);
        return{success: true, dataValues};

    }catch (err){
        console.log(err);
    }
})


//hangle get all value data
ipcMain.handle("get-values-bySession-byType", async (event, args)=>{
    const{dataTypeName, sessionId}=args;
    try{
        const dataValues = await getDataValuesBySessionAndDataType(dataTypeName, sessionId);
        return{success: true, dataValues};

    }catch (err){
        console.log(err);
    }
})



//Get datatypeID

ipcMain.handle("get-datatype-id", async (event, args)=>{
    const{dataTypeName}=args;
    try{
        const dataTypeID = await getDataTypeID(dataTypeName);
        return{success: true, dataTypeID};

    }catch (err){
        console.log(err);
    }
})


//GC To modify

/*
const moment = require('moment');


ipcMain.on('openFileSelection', (event, arg) => {
    const window = BrowserWindow.getFocusedWindow();

    dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [{ name: 'CSV Files', extensions: ['csv'] }],
    }).then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];

            // Lire les valeurs du fichier CSV
            fs.createReadStream(filePath)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) => {
                    const sessionID = null;
                    const timeRecordMilliseconds = data[Object.keys(data)[0]];
                    const timeRecord = moment(parseInt(timeRecordMilliseconds)).toISOString();

                    Object.entries(data).forEach(([columnName, value], index) => {
                        if (index > 0 && value !== null && value !== "") {
                            addDataValue(sessionID, columnName, value, timeRecord)
                                .then((lastID) => {
                                    console.log(`DataValue added with the id: ${lastID}`);
                                })
                                .catch((err) => {
                                    console.log('Error when adding the dataValue: ' + err);
                                });
                        }
                    });
                })
                .on('end', () => {
                    console.log('CSV file processing complete.');
                    dialog.showMessageBox(window, {
                        type: 'info',
                        message: 'CSV file load successfully, please reload the data to see them !',
                        buttons: ['OK']
                    });
                });
        }
    });
});


ipcMain.on('openFileSelection', async (event, arg) => {
    const window = BrowserWindow.getFocusedWindow();

    const result = await dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [{ name: 'CSV Files', extensions: ['csv'] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const loadingDialog = dialog.showMessageBox(window, {
            type: 'info',
            message: 'Loading data... Please Wait',
        });

        const dataPromises = [];

        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (data) => {
                const sessionID = null;
                const timeRecordMilliseconds = data[Object.keys(data)[0]];
                const timeRecord = moment(parseInt(timeRecordMilliseconds)).toISOString();

                Object.entries(data).forEach(([columnName, value], index) => {
                    if (index > 0 && value !== null && value !== '') {
                        dataPromises.push(addDataValue(sessionID, columnName, value, timeRecord));
                    }
                });
            })
            .on('end', async () => {
                console.log('CSV file processing complete.');

                try {
                    await Promise.all(dataPromises);
                    loadingDialog.close();
                    dialog.showMessageBox(window, {
                        type: 'info',
                        message: 'CSV file loaded successfully. Please reload the data to see them!',
                        buttons: ['OK'],
                    });
                } catch (err) {
                    console.log('Error when adding the dataValue: ' + err);
                    loadingDialog.close();
                    dialog.showMessageBox(window, {
                        type: 'error',
                        message: 'An error occurred while loading the CSV file.',
                        buttons: ['OK'],
                    });
                }
            });
    }
});


/*
const batchSize = 1000; // Nombre de lignes à traiter par lot

ipcMain.on('openFileSelection', async (event, arg) => {
    const window = BrowserWindow.getFocusedWindow();

    const result = await dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [{ name: 'CSV Files', extensions: ['csv'] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const loadingDialog = dialog.showMessageBox(window, {
            type: 'info',
            message: 'Loading data... Please Wait',
        });

        const dataBatch = [];
        let rowCount = 0;

        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', async (data) => {
                const sessionID = null;
                const timeRecordMilliseconds = data[Object.keys(data)[0]];
                const timeRecord = moment(parseInt(timeRecordMilliseconds)).toISOString();

                Object.entries(data).forEach(([columnName, value], index) => {
                    if (index > 0 && value !== null && value !== '') {
                        dataBatch.push({ sessionID, columnName, value, timeRecord });
                    }
                });

                rowCount++;

                if (rowCount % batchSize === 0) {
                    await insertDataBatch(dataBatch);
                    dataBatch.length = 0;
                }
            })
            .on('end', async () => {
                console.log('CSV file processing complete.');

                try {
                    if (dataBatch.length > 0) {
                        await insertDataBatch(dataBatch);
                    }

                    loadingDialog.response = 0;
                    dialog.showMessageBox(window, {
                        type: 'info',
                        message: 'CSV file loaded successfully. Please reload the data to see them!',
                        buttons: ['OK'],
                    });
                } catch (err) {
                    console.log('Error when adding the dataValue: ' + err);
                    loadingDialog.response = 0;
                    dialog.showMessageBox(window, {
                        type: 'error',
                        message: 'An error occurred while loading the CSV file.',
                        buttons: ['OK'],
                    });
                }
            });
    }
});

async function insertDataBatch(dataBatch) {
    let transaction;

    try {
        // Démarrer une transaction dans la base de données
        transaction = await database.startTransaction();

        // Insérer le lot de données dans la base de données
        for (const data of dataBatch) {
            await addDataValue(data.sessionID, data.columnName, data.value, data.timeRecord);
        }

        // Valider la transaction
        await database.commitTransaction(transaction);
    } catch (err) {
        // Annuler la transaction en cas d'erreur
        if (transaction) {
            await database.rollbackTransaction(transaction);
        }
        throw err;
    }
}



 */


const moment = require('moment');

/*
ipcMain.on('openFileSelection', (event, arg) => {
    const window = BrowserWindow.getFocusedWindow();

    dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [{ name: 'CSV Files', extensions: ['csv'] }],
    }).then((result) => {
        if (!result.canceled && result.filePaths.length > 0) {
            const filePath = result.filePaths[0];

            const readStream = fs.createReadStream(filePath);
            const csvParser = csv({ separator: ';' });

            let totalDataCount = 0;
            let processedDataCount = 0;

            // Créer une promesse manuelle pour attendre les données du fichier CSV
            const processDataPromise = new Promise((resolve, reject) => {
                csvParser.on('data', (data) => {
                    const sessionID = null;
                    const timeRecordMilliseconds = data[Object.keys(data)[0]];
                    const timeRecord = moment(parseInt(timeRecordMilliseconds)).toISOString();

                    if (Object.entries(data).length > 1) {
                        totalDataCount++;

                        addDataValueFromCSV(sessionID, Object.keys(data)[1], data[Object.keys(data)[1]], timeRecord)
                            .then((lastID) => {
                                processedDataCount++;
                                const progress = Math.round((processedDataCount / totalDataCount) * 100);
                                event.reply('csvProcessingProgress', progress);
                                console.log(`DataValue added with the id: ${lastID}`);

                                if (processedDataCount === totalDataCount) {
                                    resolve(); // Toutes les données ont été traitées, résoudre la promesse
                                }
                            })
                            .catch((err) => {
                                console.log('Error when adding the dataValue: ' + err);
                                reject(err); // Rejeter la promesse en cas d'erreur
                            });
                    }
                });

                csvParser.on('end', () => {
                    console.log('CSV file processing complete.');
                    resolve(); // Toutes les données ont été traitées, résoudre la promesse
                });

                csvParser.on('error', (err) => {
                    console.log('Error during CSV file processing: ' + err);
                    reject(err); // Rejeter la promesse en cas d'erreur
                });
            });

            // Lire les données du fichier CSV
            readStream.pipe(csvParser);

            // Attendre la fin du traitement des données
            processDataPromise
                .then(() => {
                    dialog.showMessageBox(window, {
                        type: 'info',
                        message: 'CSV file load successfully, please reload the data to see them!',
                        buttons: ['OK']
                    });
                })
                .catch((err) => {
                    // Gérer les erreurs lors du traitement du fichier CSV
                    console.log('Error during CSV file processing: ' + err);
                });
        }
    });
});

*/
const ProgressBar = require('electron-progressbar');
ipcMain.on('openFileSelection', (event, arg) => {
    const window = BrowserWindow.getFocusedWindow();

    dialog
        .showOpenDialog(window, {
            properties: ['openFile'],
            filters: [{ name: 'CSV Files', extensions: ['csv'] }],
        })
        .then((result) => {
            if (!result.canceled && result.filePaths.length > 0) {
                const filePath = result.filePaths[0];
                const readStream = fs.createReadStream(filePath);
                const csvParser = csv({ separator: ';' });

                let totalDataCount = 0;
                let processedDataCount = 0;

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
                });

                progressBarWindow.loadURL(
                    `file://${path.join(__dirname, 'progressBar.html')}`
                ).then(() => {
                    progressBarWindow.show();
                });

                const progressBarWebContents = progressBarWindow.webContents;

                const processDataPromise = new Promise((resolve, reject) => {
                    csvParser.on('data', (data) => {
                        const sessionID = null;
                        const timeRecordMilliseconds = data[Object.keys(data)[0]];
                        const timeRecord = moment(parseInt(timeRecordMilliseconds)).toISOString();

                        const columnNames = Object.keys(data);
                        const values = Object.values(data);

                        for (let i = 1; i < columnNames.length; i++) {
                            const columnName = columnNames[i];
                            const value = values[i];

                            if (value !== null && value !== '') {
                                totalDataCount++;

                                addDataValueFromCSV(sessionID, columnName, value, timeRecord)
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

                    csvParser.on('end', () => {
                        console.log('CSV file processing complete.');
                    });

                    csvParser.on('error', (err) => {
                        console.log('Error during CSV file processing: ' + err);
                        reject(err);
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
