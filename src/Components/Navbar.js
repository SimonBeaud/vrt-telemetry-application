import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../SessionContext';
import {ipcRenderer} from "electron";



export default function Navbar({navigateTo}){

    const {session, updateSession} = useContext(SessionContext);
    const [activePage, setActivePage] = useState('');



    const StartServer = async () => {
        ipcRenderer.send('start-server');
    }


    return(
        <header className="header">
            <div className="logoNavBar">
                <img className="logoNavVRT" src={require('../Ressources/LogoVRTNavBar.png')} alt="VRT Logo" />
                <p className="SessionInfo">{session.name}</p>
                <p className="SessionInfo">ID: {session.id}</p>
            </div>
            <div>
                <nav className="menu">
                    <ul className="menu-list">
                        <li className="menuItem">
                            <button onClick={()=> {navigateTo('GeneralData'); setActivePage('GeneralData');}}
                                    className={activePage === 'GeneralData' ? 'menuActive menuButton' : 'menuButton'}>
                                Live Data
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> {navigateTo('ExternalData'); setActivePage('ExternalData');}}
                                    className={activePage === 'ExternalData' ? 'menuActive menuButton' : 'menuButton'}>
                                External data
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> {navigateTo('HistoricData'); setActivePage('HistoricData');}}
                                    className={activePage === 'HistoricData' ? 'menuActive menuButton' : 'menuButton'}>
                                Live history
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> {navigateTo('ExportData'); setActivePage('ExportData');}}
                                    className={activePage === 'ExportData' ? 'menuActive menuButton' : 'menuButton'}>
                                Export data
                            </button>

                        </li>
                        <li className="menuItem">
                            <button onClick={()=> {navigateTo('ProjectNavigation'); setActivePage('ProjectNavigation');}}
                                    className={activePage === 'ProjectNavigation' ? 'menuActive menuButton' : 'menuButton'}>
                                Sessions
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={StartServer}
                                    className={activePage === 'ProjectNavigation' ? 'menuActive menuButton' : 'menuButton'}>
                                Connect car
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

    )
}