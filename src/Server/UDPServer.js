const express = require('express');
const { ipcMain, dialog, ipcRenderer} = require('electron');
const dgram = require('dgram');
const {addDataValue} = require("../DataBase/Database");
const { BrowserWindow } = require('electron');
const os = require('os');

//Variable declaration
let isConnected = false;
let LiveData;
let PortNumber = 7070;
let IPAddressFound;


//######################################################################################################################
//UDP server


class UDPServer {

    //constructor
    constructor(port) {
        getIPAddress((err, ipAddress) =>{
            if(!err){
                this.listeningPoint = {address: ipAddress, port: port};
                this.udpServer = dgram.createSocket("udp4", this.listeningPoint);
                this.isRunning = false;
                this.prompteWindow = null;
                this.lastKeepAliveCounter = 0;
                this.keepAliveTimeout = null;
               // this.udpServer.on('message', this.receiveData.bind(this));
                this.udpServer.on('message', (data) => this.receiveData(data));
            }else{
                console.error("Error when searching wlan network")
            }
        });
    }


//__________________________________________
//Server start
//__________________________________________

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.udpServer.bind(this.listeningPoint.port);

            //Connexion Windows waiting to client message
            const options = {
                title: 'Waiting car connexion',
                resizable: false,
                frame: true,
                height: 200,
                alwaysOnTop: true,
                closable: true,
                skipTaskbar: true,
                show: false,
                customStylesheet: `
                     body {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0;
                        padding: 16px;
                        }
                `,
            }
            this.prompteWindow = new BrowserWindow(options);
            this.prompteWindow.loadURL(`data:text/html;charset=UTF-8,
                <html>
                    <body>
                        <div style="margin-right: 8px;"></div>
                        <div>Waiting for the connexion with the car...</div>
                        <br/>
                        <div>IP Address: ${IPAddressFound.address}</div>
                        <div>Connection port: ${PortNumber}</div>
                    </body>
                 </html>
            `);

            this.prompteWindow.once('ready-to-show', () => {
                this.prompteWindow.show();
            });

            this.prompteWindow.once('closed', () => {

            });
        }
    }


//__________________________________________
//Server stop
//__________________________________________

    stop(callback) {
        if (this.isRunning) {
            this.isRunning = false;
            this.udpServer.close();
            isConnected = false;
        }
    }


//__________________________________________
//Data reception
//__________________________________________


    receiveData(data) {
        const jsonString = data.toString();
        const jsonData = JSON.parse(jsonString);

        //Start the connexion check when receiving the first data
        if (jsonData.KeepAliveCounter !== undefined) {
            const receivedCounter = jsonData.KeepAliveCounter;
            isConnected = true;
            this.resetKeepAliveTimeout();
            this.lastKeepAliveCounter = receivedCounter;
            this.lastKeepAliveTime = new Date().getTime();
        }

        //send the data received to handleData
        this.handleData(jsonData);

        //close the prompte window and start keep alive check
        if (jsonData !== null) {
            if (this.prompteWindow !== null) {
                this.prompteWindow.close();
                this.prompteWindow = null;
                this.startKeepAliveCheck();
                isConnected = true;

            }
        }
    }


//__________________________________________
//Keep Alive Check
//__________________________________________

    startKeepAliveCheck() {
        const interval = setInterval(() => {
            if (this.lastKeepAliveCounter !== null) {
                const currentTime = new Date().getTime();
                const elapsedTime = currentTime - this.lastKeepAliveTime;

                //Action if the connexion is lost
                if (elapsedTime > 2000) {
                    dialog.showMessageBoxSync({
                        type: 'info',
                        title: 'Connexion lost',
                        message: 'Connexion with the car lost, please try to connect again !',
                        buttons: ['OK'],
                        noLink: true
                    });

                    clearInterval(interval);
                    if (this.isRunning) {
                        this.isRunning = false;
                        this.udpServer.close();
                        isConnected = false;
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


//__________________________________________
//Handle the data received
//__________________________________________

    handleData(data){
        LiveData = {...data};
        const timeRecord = new Date();
        for(const datatypeName in data){
            const dataRecord = data[datatypeName];
            const sessionID = null;
            addDataValue(sessionID, datatypeName, dataRecord, timeRecord)
                .then((lastID)=>{
                    console.log('DataValue added');
                })
                .catch((err)=>{
                    console.log("Error when adding the dataValue: "+err);
                });
        }
    }
};



//__________________________________________
//IPv4 get
//__________________________________________


function getIPAddress(callback){
    const interfaceName = 'Wi-Fi';
    const interfaces = os.networkInterfaces();
    const wifiInterface = interfaces[interfaceName];
    if(wifiInterface){
        const IPAddress = wifiInterface.find(iface => iface.family === 'IPv4' && !iface.internal);
        IPAddressFound = IPAddress;
        if(IPAddress){
            callback(null, IPAddress.address);
            return;
        }
    }
    callback(new Error("No wlan found"));

}

//__________________________________________
//Export elements
//__________________________________________


function getLiveData(){
    return LiveData;
}

function getConnectedStatus(){
    return isConnected;
}

const server = new UDPServer(PortNumber);

module.exports={
    start: server.start.bind(server),
    getLiveData: getLiveData,
    getConnectedStatus: getConnectedStatus,

};





