
const express = require('express');
const app = express();
const { ipcMain, dialog, ipcRenderer} = require('electron');
const dgram = require('dgram');
const { Buffer } = require('buffer');
const fs = require('fs');
const {addDataValue, addDataValueFromCSV} = require("../DataBase/Database");
//const conversionFile = require('/src/DataBase/Data/ConversionFile.json');
const { BrowserWindow } = require('electron');
const prompt = require('electron-prompt');
let isConnected = false;



//Live Data Variables
let TensionBatteryHV;
let AmperageBatteryHV;
let TemperatureBatteryHV;
let EnginePower;
let EngineTemperature;
let EngineAngularSpeed;
let CarSpeed;
let PressureTireFL;
let PressureTireFR;
let PressureTireBL;
let PressureTireBR;
let InverterTemperature;
let TemperatureBatteryLV;

let LiveData;




class UDPServer {



    constructor(port1) {


        //const IPAddress = "192.168.1.106";
        //const IPAddress = "192.168.1.127";
        // const IPAddress = "172.20.10.3";
        //const IPAddress = "192.168.43.232";
        const IPAddress = "192.168.50.65"

        this.listeningPoint = {address: IPAddress, port: port1};
        this.udpServer = dgram.createSocket("udp4", this.listeningPoint);
        this.isRunning= false;
        this.promptWindow = null;


        this.lastKeepAliveCounter = 0;
        this.keepAliveTimeout = null;

        console.log(`IP: ${IPAddress} Port: ${port1}`);

        this.udpServer.on('message', this.receiveData.bind(this));


    }


    //Start method:
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.udpServer.bind(this.listeningPoint.port);
            console.log('The server is now listening');

            const options = {
                title: 'Car connexion',
                resizable: false,
                frame: true,
                customStylesheet: `
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 16px;
        }
      `,
                height: 120,
                alwaysOnTop: true,
                closable: true,
                skipTaskbar: true,
                show: false,
            };

            this.promptWindow = new BrowserWindow(options);
            this.promptWindow.loadURL(`data:text/html;charset=UTF-8,
      <html>
        <body>
          <!-- Insérez ici le code HTML de la roue de chargement -->
          <div style="margin-right: 8px;"></div>
          <div>Waiting for the connexion with the car...</div>
        </body>
      </html>
    `);

            this.promptWindow.once('ready-to-show', () => {
                this.promptWindow.show();
            });

            this.promptWindow.once('closed', () => {
                // Gérer les actions à effectuer après la fermeture de la fenêtre de dialogue
            });
        }


    }



    //Stop method:
    stop(callback){
        if(this.isRunning){
            this.isRunning = false;
            this.udpServer.close();
            console.log("server is stopped")
            isConnected = false;

        }
    }


    //Reception Data methode:

    receiveData(data) {
        const jsonString = data.toString();
        const jsonData = JSON.parse(jsonString);



        if (jsonData.KeepAliveCounter !== undefined) {
            const receivedCounter = jsonData.KeepAliveCounter;
            console.log("ReceivedCounter: " + receivedCounter);

            isConnected = true;

            this.resetKeepAliveTimeout();
            this.lastKeepAliveCounter = receivedCounter;
            this.lastKeepAliveTime = new Date().getTime();
        }




        this.handleData(jsonData);

        if (jsonData !== null) {
            if (this.promptWindow !== null) {
                this.promptWindow.close();
                this.promptWindow = null;
                this.startKeepAliveCheck();
            }
        }
    }


    startKeepAliveCheck() {
        const interval = setInterval(() => {
            if (this.lastKeepAliveCounter !== null) {
                const currentTime = new Date().getTime();
                const elapsedTime = currentTime - this.lastKeepAliveTime;

                if (elapsedTime > 2000) {
                    console.log("La fenetre doit ouvrir !!");
                    dialog.showMessageBoxSync({
                        type: 'info',
                        title: 'Car connexion',
                        message: 'We lost the connexion with the car! Please try to connect again',
                        buttons: ['OK'],
                        noLink: true
                    });

                    clearInterval(interval);
                    if(this.isRunning){
                        this.isRunning = false;
                        this.udpServer.close();

                        isConnected = false;

                        console.log("server is stopped")
                        this.udpServer = dgram.createSocket("udp4", this.listeningPoint);
                        this.udpServer.on('message', this.receiveData.bind(this));
                    }
                }
            }
        }, 1000);
    }


    resetKeepAliveTimeout() {
        clearTimeout(this.keepAliveTimeout);
    }

    //Handle data methode:
    handleData(data){

        //Assign values to each sensor variables
        TensionBatteryHV = data.TensionBatteryHV;
        AmperageBatteryHV = data.AmperageBatteryHV;
        TemperatureBatteryHV = data.TemperatureBatteryHV;
        EnginePower = data.EnginePower;
        EngineTemperature = data.EngineTemperature;
        EngineAngularSpeed = data.EngineAngularSpeed;
        CarSpeed = data.CarSpeed;
        PressureTireFL = data.PressureTireFL;
        PressureTireFR = data.PressureTireFR;
        PressureTireBL = data.PressureTireBL;
        PressureTireBR = data.PressureTireBR;
        InverterTemperature = data.InverterTemperature;
        TemperatureBatteryLV = data.TemperatureBatteryLV;


        LiveData = {
            TensionBatteryHV,
            AmperageBatteryHV,
            TemperatureBatteryHV,
            EnginePower,
            EngineTemperature,
            EngineAngularSpeed,
            CarSpeed,
            PressureTireFL,
            PressureTireFR,
            PressureTireBL,
            PressureTireBR,
            InverterTemperature,
            TemperatureBatteryLV
        }


        //add the data recorded in the database with the methode AddDataValue
        //DateTime adding
        const currentTime = new Date();


        //const timeRecord = `${day}.${month}.${year} ${hours}:${minutes}:${secondes}`;
        const timeRecord = currentTime;


        //Add the values in the Database
        for(const dataTypeName in data){
            const dataRecord = data[dataTypeName];

            const sessionID=null;

            addDataValue(sessionID, dataTypeName, dataRecord, timeRecord)
                .then((lastID)=>{
                    console.log('DataValue added with the id: ${lastID}');
                })
                .catch((err)=>{
                    console.log("Error when adding the dataValue: "+err);
                });
        }
    }
}






//######################################################################################################################
//Get sensor values variables

function getLiveData(){
    return LiveData;
}

function getConnectedStatus(){
    return isConnected;
}


const server = new UDPServer(7070);

module.exports={
    start: server.start.bind(server),
    getLiveData: getLiveData,
    getConnectedStatus: getConnectedStatus,


};







