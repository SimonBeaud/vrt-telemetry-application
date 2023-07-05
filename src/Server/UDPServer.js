
const express = require('express');
const app = express();
const { ipcMain } = require('electron');
const dgram = require('dgram');
const { Buffer } = require('buffer');
const fs = require('fs');
const {addDataValue} = require("../DataBase/Database");
//const conversionFile = require('/src/DataBase/Data/ConversionFile.json');


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
       // const IPAddress = "172.20.10.3";
        //const IPAddress = "192.168.43.232";

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
        //DateTime adding
        const currentTime = new Date();
        const day = currentTime.getDate().toString().padStart(2, '0');
        const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
        const year = currentTime.getFullYear();
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const secondes = currentTime.getSeconds().toString().padStart(2, '0');

        //const timeRecord = `${day}.${month}.${year} ${hours}:${minutes}:${secondes}`;
        const timeRecord = currentTime;


        //Add the values in the Database
        for(const dataTypeName in data){
            const dataRecord = data[dataTypeName];
            console.log("dataType: "+dataTypeName)
            const sessionID=null;


            const convertDataRecord = dataRecordConversion(dataTypeName, dataRecord);

            addDataValue(sessionID, dataTypeName, convertDataRecord, timeRecord)
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
//Data Conversion Function

function dataRecordConversion(dataTypeName, dataRecord){

    /*
    if(conversionFile.hasOwnProperty(dataTypeName)){
        const { ConversionFactor, Offset} = conversionFile[dataTypeName];
        const result = dataRecord * ConversionFactor + Offset;

        return result;
    }*/

    return dataRecord
}







//######################################################################################################################
//Get sensor values variables

function getLiveData(){
    return LiveData;
}


const server = new UDPServer(7070);

module.exports={
    start: server.start.bind(server),
    getLiveData: getLiveData

};