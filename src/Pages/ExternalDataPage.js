import React, {useState} from 'react'
import TabBar from "../Components/TabBar";
import '../Style/ExternalDataStyle.css';
import {ChartProvider} from "../ChartContext";
import LiveDataPage from "./LiveDataPage";
import HistoricDataPage from "./HistoricDataPage";
import ExportDataPage from "./ExportDataPage";
import ProjectNavigationPage from "./ProjectNavigationPage";
import ElectricDataPage from "./ElectricDataPage";
import MechanicDataPage from "./MechanicDataPage";
import PilotDataPage from "./PilotDataPage";
import GeneralExternalDataPage from "./GeneralExternalDataPage";


const { ipcRenderer, remote } = window.require('electron');




//GC
function ExternalDataPage() {


    const handleFileSelection = () => {
        ipcRenderer.send('openFileSelection');
    };

    /*
    <button className="ReloadButton" onClick={handleFileSelection}>Sélectionner un fichier CSV</button>
    */

    const [currentTabPage, setCurrentTabPage] = useState('ElectricDataPage')

    const navigateTabTo = (path) => {
        setCurrentTabPage(path);
    };





    const renderTabPage = () => {
        switch (currentTabPage) {
            case 'ElectricDataPage':
                return <ElectricDataPage/>;
            case 'MechanicDataPage':
                return <MechanicDataPage/>;
            case 'PilotDataPage':
                return <PilotDataPage/>;
            case 'GeneralExternalDataPage':
                return <GeneralExternalDataPage/>;
        }
    };


    return (
        <header className="App-header">
            <div className="ExternalPageContainer">
                <TabBar navigateTo={navigateTabTo}/>
                <div>{renderTabPage()}</div>
            </div>
        </header>
    );
}


export default ExternalDataPage;