

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const electron = require('electron');


let databasePath=null;
let database;
let currentSessionID;


//######################################################################################################################
//Database Creation


const getDatabase = ()=>{

    if(!database){

        if(!databasePath){
            databasePath = path.resolve(electron.app.getPath('userData'), 'VRT-database.db');
        }

        database = new sqlite3.Database(databasePath);

        //Create database tables
        database.serialize(()=>{
            database.run('CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pilot TEXT, date TEXT)');
            database.run('CREATE TABLE IF NOT EXISTS DataType (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, live BOOLEAN)');
            database.run('CREATE TABLE IF NOT EXISTS DataValue (id INTEGER PRIMARY KEY AUTOINCREMENT, session_id INTEGER, DataType_id INTEGER,/* FOREIGN KEY (session_id) REFERENCES session (id), FOREIGN KEY (DataType_id) REFERENCES DataType (id),*/  DataRecord REAL, timeRecord DATETIME)');

        });
    }
    return database;
}







//######################################################################################################################
//Data Type operation


//Add the DataTYpe in the Database from the DataTypesTables.json:
const addDataType = (DataTypesTable)=>{
    return new Promise((resolve, reject)=>{

        const RequestStatement = database.prepare("INSERT INTO DataType (type, live) VALUES (?,?)");
        DataTypesTable.forEach((item)=>{
            RequestStatement.run(item.type, item.live);
        });

        RequestStatement.finalize((err)=>{
            if(err){
                reject(err);
            }else{
                resolve();
            }
        })
    });
};





//######################################################################################################################
//DataValue Operation

//Add DataValue in the Database:

//generated code
const addDataValue = (sessionID, dataTypeName, dataRecord, timeRecord) => {

    sessionID=currentSessionID;

    return getDataTypeID(dataTypeName)
        .then(dataTypeID => {
            console.log("DATATYPE IN THE DB: " + dataTypeID);

            if (dataTypeID === null) {
                throw new Error("DataType not found");
            }

            return new Promise((resolve, reject) => {
                database.run(
                    "INSERT INTO DataValue(session_id, DataType_id, DataRecord, timeRecord) VALUES(?,?,?,?)",
                    [sessionID, dataTypeID, dataRecord, timeRecord],
                    function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this.lastID);
                        }
                    }
                );
            });
        })
        .then(result => {
            console.log("datavalue added with success !");
            return result;
        })
        .catch(err => {
            console.log("Error when adding the datavalue");
            throw err;
        });
};

const getDataTypeID = dataTypeName => {
    return new Promise((resolve, reject) => {
        database.get("SELECT id FROM DataType WHERE type = ?", dataTypeName, (err, row) => {
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




//######################################################################################################################
//Session operations

const setCurrentSession = (SessionID)=>{
    currentSessionID = SessionID;
    console.log("session in the db: "+currentSessionID);

    return currentSessionID;
}



//generate code
const getSessions = () => {
    return new Promise((resolve, reject) => {
        database.all("SELECT * FROM session", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};


//add a session in the DB
const addSession = (name, pilot, date)=>{
    return new Promise((resolve, reject)=>{
        database.run("INSERT INTO session (name, pilot, date) VALUES (?,?,?)", [name, pilot, date], function (err){
            if(err){
                reject(err);
            }else{
                resolve(this.lastID);
            }
        });
    });
};

const deleteAllSessions = () => {
    return new Promise((resolve, reject) => {
        console.log("everything deleted")
        database.run("DELETE FROM session", function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};


//######################################################################################################################

module.exports = {
    getDatabase: getDatabase,
    getSessions: getSessions,
    addSession: addSession,
    deleteAllSessions: deleteAllSessions,
    addDataType: addDataType,
    addDataValue: addDataValue,
    getDataTypeID: getDataTypeID,
    setCurrentSession: setCurrentSession
};
