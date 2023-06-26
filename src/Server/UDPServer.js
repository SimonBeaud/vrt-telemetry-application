
const express = require('express');
const app = express();
const { ipcMain } = require('electron');
const dgram = require('dgram');
const { Buffer } = require('buffer');
const fs = require('fs');
const {addDataValue} = require("../DataBase/Database");


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



class UDPServer{





    constructor(port1) {
        //const IPAddress = "192.168.1.106";
        const IPAddress = "192.168.1.127";

        this.listeningPoint = {address: IPAddress, port: port1};
        this.udpServer = dgram.createSocket("udp4", this.listeningPoint);
        this.isRunning= false;

        console.log(`Server listening on: ${IPAddress} port1: ${port1}`);

        this.udpServer.on('message', this.receiveData.bind(this));


    }


    //Start method:
    start(){
        if(!this.isRunning){
            this.isRunning=true;
            this.udpServer.bind(this.listeningPoint.port);
        }
    }


    //Stop method:
    stop(){
        if(this.isRunning){
            this.isRunning = false;
            this.udpServer.close();
        }
    }


    //Reception Data methode:
    receiveData(data){
        const jsonString = data.toString();
        const jsonData = JSON.parse(jsonString);
        this.handleData(jsonData);
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
        const timeRecord = Date.now();

        for(const dataTypeName in data){
            const dataRecord = data[dataTypeName];
            console.log("dataType: "+dataTypeName)
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


/*
function getTensionBatteryHV(){
    return TensionBatteryHV;
}

function getAmperageBatteryHV(){
    return AmperageBatteryHV;
}

function getTemperatureBatteryHV(){
    return TemperatureBatteryHV;
}

function getEnginePower(){
    return EnginePower;
}

function getEngineTemperature(){
    return EngineTemperature;
}

function getEngineAngularSpeed(){
    return EngineAngularSpeed;
}

function getCarSpeed(){
    return CarSpeed;
}

function getPressureTireFL(){
    return PressureTireFL;
}

function getPressureTireFR(){
    return PressureTireFR;
}

function getPressureTireBL(){
    return PressureTireBL;
}

function getPressureTireBR(){
    return PressureTireBR;
}

function getInverterTemperature(){
    return InverterTemperature;
}

function getTemperatureBatteryLV(){
    return TemperatureBatteryLV;
}
*/





const server = new UDPServer(7070);

module.exports={
    start: server.start.bind(server),
    /*
    getTensionBatteryHV: getTensionBatteryHV,
    getAmperageBatteryHV: getAmperageBatteryHV,
    getTemperatureBatteryHV: getTemperatureBatteryHV,
    getEnginePower: getEnginePower,
    getEngineTemperature: getEngineTemperature,
    getEngineAngularSpeed: getEngineAngularSpeed,
    getCarSpeed: getCarSpeed,
    getPressureTireFL: getPressureTireFL,
    getPressureTireFR: getPressureTireFR,
    getPressureTireBL: getPressureTireBL,
    getPressureTireBR: getPressureTireBR,
    getInverterTemperature: getInverterTemperature,
    getTemperatureBatteryLV: getTemperatureBatteryLV,

     */
    getLiveData: getLiveData

};