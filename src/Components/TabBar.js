import React, {useContext} from "react";
import '../Style/ExternalDataStyle.css';


export default function TabBar({navigateTo}){




    return(
        <header className="tab-header">
            <div>
                <nav className="tab">
                    <ul className="tab-list">
                        <li className="tabItem">
                            <button onClick={()=> navigateTo('ElectricDataPage')} className="tabButton">
                                Electric
                            </button>
                        </li>
                        <li className="tabItem">
                            <button onClick={()=> navigateTo('MechanicDataPage')} className="tabButton">
                                Mechanic
                            </button>
                        </li>
                        <li className="tabItem">
                            <button onClick={()=> navigateTo('PilotDataPage')} className="tabButton">
                                Pilot
                            </button>
                        </li>
                        <li className="tabItem">
                            <button onClick={()=> navigateTo('GeneralExternalDataPage')} className="tabButton">
                                General
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>

    )
}