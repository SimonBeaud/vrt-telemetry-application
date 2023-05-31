import React from 'react';
import { Link } from 'react-router-dom';




export default function Navbar({navigateTo}){
    return(
        <header className="header">
            <div>
                <nav className="menu">
                    <ul className="menu-list">
                        <li className="menuItem">
                           <button onClick={()=> navigateTo('GeneralData')} className="menuButton">
                               General Data
                           </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> navigateTo('ExternalData')} className="menuButton">
                                External Data
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> navigateTo('HistoricData')} className="menuButton">
                                Historic Data
                            </button>
                        </li>
                        <li className="menuItem">
                            <button onClick={()=> navigateTo('ExportData')} className="menuButton">
                                Export Data
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

    )
}