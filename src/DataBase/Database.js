const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const electron = require('electron');


//Variable declaration

let databasePath = null;
let database;
let currentSessionID;


//######################################################################################################################
//Creation of the SQLite Database

const getDatabase = () => {
    if(!database){

        //database path creation
        if(!databasePath){
            databasePath = path.resolve(electron.app.getPath('userData'), 'VRT-database.db');
        }

        database = new sqlite3.Database(databasePath);

        //Database tables creation
        database.serialize(() =>{
            database.run('CREATE TABLE IF NOT EXISTS session(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pilot TEXT, date TEXT)');
            database.run('CREATE TABLE IF NOT EXISTS DataType(id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, live BOOLEAN, unity TEXT)');
            database.run('CREATE TABLE IF NOT EXISTS DataValue(id INTEGER PRIMARY KEY AUTOINCREMENT, session_id INTEGER, DataType_id INTEGER, DataRecord REAL, timeRecord DATETIME)');
        });
    }
    return database;
}


//#########################################################################################
//CRUD Operations


//__________________________________________
//Session operations
//__________________________________________


//Insert a new session
const addSession = (name, pilot, date) =>{
    return new Promise((resolve, reject) =>{
        database.run("INSERT INTO session (name, pilot, date) VALUES (?,?,?)", [name, pilot, date], function (err){
            if(err){
                reject(err);
            }else {
                resolve(this.lastID);
            }
        });
    });
}



//Get all sessions
const getAllSessions = () => {
    return new Promise((resolve, reject) =>{
        database.all("SELECT * FROM session", [], (err, rows) =>{
            if(err){
                reject(err);
            }else {
                resolve(rows);
            }
        });
    });
};



//Delete one session by ID
const deleteSession = (sessionID) =>{
    return new Promise((resolve, reject) =>{
        database.run("DELETE FROM session WHERE id = ?", [sessionID], function (err){
            if(err){
                reject(err);
            }else {
                resolve(this.changes);
            }
        });
    });
};


//Set Session to the context
const setCurrentSession = (SessionID) =>{
    currentSessionID = SessionID;
    return currentSessionID;
}


//__________________________________________
//DataType operations
//__________________________________________

//Add dataType from the configuration file and check if it doesn't already exist
const addDataType = (DataTypesTable) =>{
    return new Promise((resolve, reject) =>{
        database.serialize(() =>{
            database.run("BEGIN TRANSACTION");
            DataTypesTable.forEach((item) =>{
                const RequestSelect = database.prepare("SELECT type FROM DataType WHERE type = ?");
                RequestSelect.get(item.type, (err, row) =>{
                    if(err){
                        reject(err);
                        return;
                    }
                    if(!row){
                        const RequestInsert = database.prepare("INSERT INTO DataType (type, live, unity) VALUES (?, ?, ?)");
                        RequestInsert.run(item.type, item.live, item.unity);
                        RequestInsert.finalize();
                    }
                });
                RequestSelect.finalize();
            });
            database.run("COMMIT", (err) =>{
                if(err){
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    });
}



//Get DataTypeID by Name
const getDataTypeID = dataTypeName => {
    return new Promise((resolve, reject) => {
        database.get("SELECT id FROM DataType WHERE type = ?", dataTypeName, (err, row) =>{
            if (err) {
                reject(err);
            } else if (!row) {
                reject(new Error("DataType not found"));
            } else {
                resolve(row.id);
            }
        });
    });
};

//Get DataType Name by ID
const getDataTypeName = dataTypeID =>{
    return new Promise((resolve, reject)=>{
        database.get("SELECT type FROM DataType WHERE id = ?", dataTypeID,  (err, row) =>{
            if (err) {
                reject(err);
            } else if (!row) {
                reject(new Error("DataType name not found"));
            } else {
                resolve(row.type);
            }
        });
    })
}



//__________________________________________
//DataValue operations
//__________________________________________

//add a new DataValue
const addDataValue = (sessionID, dataTypeName, dataRecord, timeRecord) =>{
    sessionID = currentSessionID;

    return getDataTypeID(dataTypeName).then((dataTypeID) =>{
        if(dataTypeID === null){
            throw new Error('DataType do not exists !');
        }

        return new Promise((resolve, reject) =>{
            database.serialize(() =>{

                //using transaction to add data faster
                database.run('BEGIN TRANSACTION');
                const Request = database.prepare('INSERT INTO DataValue(session_id, DataType_id, DataRecord, timeRecord) VALUES (?, ?, ?, ?)')
                Request.run(sessionID, dataTypeID, dataRecord, timeRecord, function (err){
                    if(err){
                        reject(err);
                    }else {
                        resolve(this.lastID);
                    }
                });
                Request.finalize((err) =>{
                    if(err){
                        reject(err);
                    }
                });

                database.run('COMMIT');
            });
        });
    }).then((result) =>{
        return result;
    }).catch((err) =>{
        throw err;
    });
};



//get Data Values by session and DataType
const getDataValues = (dataTypeName, sessionId) => {
    return new Promise((resolve, reject) =>{
        getDataTypeID(dataTypeName).then((dataTypeID) =>{
            database.all("SELECT DataValue.DataRecord, DataValue.timeRecord, DataValue.DataType_id FROM DataValue INNER JOIN DataType ON DataValue.DataType_id = DataType.id WHERE DataType.type = ? AND DataValue.session_id = ?",
                [dataTypeName, sessionId], function(err, rows){
                    if(err){
                        reject(err);
                    }else{
                        reject(rows);
                    }
                });
        }).catch((err) =>{
            reject(err);
        });
    });
};



//get Data Values by session
const getDataValueBySession = (sessionId) =>{
    return new Promise((resolve, reject) =>{
       database.all(
           "SELECT DataValue.DataRecord, DataValue.timeRecord, DataValue.DataType_id FROM DataValue WHERE DataValue.session_id = ?",
           [sessionId], function(err, rows){
               if(err){
                   reject(err);
               }else {
                   resolve(rows);
               }
           }
       );
    });
};


//Delete Data Values by session
const deleteDataValues = (sessionID) =>{
    return new Promise((resolve, reject) =>{
        database.run("DELETE FROM DataValue WHERE session_id = ?", [sessionID], function(err){
            if(err){
                reject(err);
            }else {
                resolve(this.changes);
            }
        });
    });
};


//#########################################################################################
//Export functions

module.exports = {
    database,
    databasePath,

    getDatabase,

    addSession,
    getAllSessions,
    deleteSession,
    setCurrentSession,

    addDataType,
    getDataTypeID,
    getDataTypeName,

    addDataValue,
    getDataValues,
    getDataValueBySession,
    deleteDataValues
}