import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from '../SessionContext';


export default function Navbar({navigateTo}){

    const {session, updateSession} = useContext(SessionContext);


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
                           <button onClick={()=> navigateTo('GeneralData')} className="menuButton">
                               Live Data
                           </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> navigateTo('ExternalData')} className="menuButton">
                                External Data
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> navigateTo('HistoricData')} className="menuButton">
                                Live History
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> navigateTo('ExportData')} className="menuButton">
                                Export Data
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> navigateTo('ProjectNavigation')} className="menuButton">
                                Sessions
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

    )
}