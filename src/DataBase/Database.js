const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const electron = require('electron');
//const databasePath = path.resolve(electron.app.getPath('userData'), 'VRT-database.db');
let databasePath=null;
console.log('Path de la DB: '+databasePath);
const {ipcMain} = electron;


let database

const getDatabase = ()=>{
    if(!database){

        if(!databasePath){
            databasePath = path.resolve(electron.app.getPath('userData'), 'VRT-database.db');
        }

        database = new sqlite3.Database(databasePath);

        database.serialize(()=>{
            database.run('CREATE TABLE IF NOT EXISTS session (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pilot TEXT, date TEXT)');


            const session={
                name: 'My First VRT Session',
                pilot: 'Simon',
                date: '2 juin 2023'
            };

            const {name, pilot, date} = session;


            const stmt = database.prepare('INSERT INTO session (name, pilot, date) VALUES(?,?,?)');
            stmt.run(name, pilot, date, (err)=>{
                if(err){
                    console.error(err.message);
                }else{
                    console.log('Session inserted successfully');
                }
            });
            stmt.finalize();
        });
    }
    return database;
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








module.exports = {
    getDatabase,
    getSessions
};
