import React from 'react'
import {useNavigate} from "react-router-dom";
import NewSessionForm from "../Components/NewSessionForm";

function ExternalDataPage(){

    return(
        <header className="App-header">
            <div className="PageContainer">
                <h1>External Data Page</h1>
                <NewSessionForm/>
            </div>
        </header>
    )
}

export default ExternalDataPage;