import React, {useEffect, useState} from 'react'
import {ipcRenderer} from 'electron'
import {useNavigate} from "react-router-dom";
//const server = require("../Server/UDPServer");

function GeneralDataPage(){

    const [pressure, setPressure] = useState(null);

    const updatePressure = (event, ReceivePressure)=>{
        setPressure(ReceivePressure);
    }

    useEffect(()=>{
        ipcRenderer.on("update-pressure", updatePressure);

        return ()=>{
            ipcRenderer.off("update-pressure", updatePressure);
        };
    }, []);


    return(
        <header className="App-header">
            <div className="PageContainer">
                <h1>General Data Page</h1>
                <h1 className="LiveData">{pressure}</h1>
            </div>
        </header>
    )
}

export default GeneralDataPage;