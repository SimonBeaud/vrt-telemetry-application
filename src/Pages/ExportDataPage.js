import React from 'react'
import {useNavigate} from "react-router-dom";

function ExportDataPage(){

    return(
        <header className="App-header">
            <div className="PageContainer">
                <h1>Export Data Page</h1>
                <img className="LogoIcon" src={require('../Ressources/logo.png').default} alt="Logo" />
            </div>
        </header>
    )
}

export default ExportDataPage;