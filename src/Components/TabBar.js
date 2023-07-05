import React, {useContext, useState} from "react";
import '../Style/ExternalDataStyle.css';
import {ipcRenderer} from "electron";


export default function TabBar({navigateTo}){

    const [activeTab, setActiveTab] = useState('');

    const handleFileSelection = () => {
        ipcRenderer.send('openFileSelection');
    };

    return(
        <header className="tab-header">
            <div>
                <nav className="tab">
                    <ul className="tab-list">
                        <li className="tabItem">
                            <button onClick={()=> {navigateTo('ElectricDataPage'); setActiveTab('ElectricDataPage');}}
                                    className={activeTab === 'ElectricDataPage' ? 'tabActive tabButton' : 'tabButton'}>
                                Electric
                            </button>
                        </li>
                        <li className="tabItem">
                            <button onClick={()=> {navigateTo('MechanicDataPage'); setActiveTab('MechanicDataPage');}}
                                    className={activeTab === 'MechanicDataPage' ? 'tabActive tabButton' : 'tabButton'}>
                                Mechanic
                            </button>
                        </li>
                        <li className="tabItem">
                            <button onClick={()=> {navigateTo('PilotDataPage'); setActiveTab('PilotDataPage');}}
                                    className={activeTab === 'PilotDataPage' ? 'tabActive tabButton' : 'tabButton'}>
                                Pilot
                            </button>
                        </li>
                        <li className="tabItem">
                            <button onClick={()=> {navigateTo('GeneralExternalDataPage'); setActiveTab('GeneralExternalDataPage');}}
                                    className={activeTab === 'GeneralExternalDataPage' ? 'tabActive tabButton' : 'tabButton'}>
                                General
                            </button>
                        </li>
                        <li>
                            <button className="ReloadButton" onClick={handleFileSelection}>Load CSV File</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

    )
}