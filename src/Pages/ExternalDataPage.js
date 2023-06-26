import React from 'react'
import {ipcRenderer} from "electron";


function ExternalDataPage(){

    const deleteAllDataValue=()=>{
        ipcRenderer.invoke('deleteDataValues').then();
    }




    return(
        <header className="App-header">
            <div className="PageContainer">
                <h1>External Data Page</h1>
                <button onClick={deleteAllDataValue}></button>
            </div>
        </header>
    )
}

export default ExternalDataPage;