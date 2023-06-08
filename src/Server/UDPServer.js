
const express = require('express');
const app = express();
const { ipcMain } = require('electron');
const dgram = require('dgram');
const { Buffer } = require('buffer');
const fs = require('fs');
const {addDataValue} = require("../DataBase/Database");





//Data variables
let pressure

class UDPServer{





    constructor(port1) {
        const IPAddress = "192.168.1.106";

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
        console.log('Pressure: '+data.pression);
        pressure = data.pression;

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



//Get pressure function
function getPressureData(){
    return pressure;
}


const server = new UDPServer(7070);

module.exports={
    start: server.start.bind(server),
    getPressureData: getPressureData
};