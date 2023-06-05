import React, {useContext, useEffect, useState} from 'react'
import {AppContext} from '../App';
import '../Style/ProjectNavigationStyle.css';
import {getDatabase} from "../DataBase/Database";
const electron = window.require('electron');
const { ipcRenderer } = window.require('electron');



function ProjectNavigationPage(){

    const {navigateTo} = useContext(AppContext);
    const [sessions, setSessions] = useState([])



    useEffect(()=>{
        ipcRenderer.invoke('get-sessions').then(sessionAll=>{
            setSessions(sessionAll);
        }).catch(err=>{
            console.error(err)
        })
    }, []);


/*
    //generate code:
    useEffect(() => {
        ipcRenderer.invoke('get-sessions').then(sessionNames => {
            setSessions(sessionNames);
        }).catch(err => {
            console.error(err);
        });
    }, []);
*/







    const navigationClick = ()=>{
        navigateTo('/GeneralData')
    }


    return(

            <div className="ProjectNavigationContainer">
                <div className="linksContainer">
                    <h3 className="titleSession">Last Sessions</h3>
                    <div className="sessionList">
                        <ul>
                            {sessions.map((sessionAll, index)=>(
                                <li key={index}>{sessionAll.name} - {sessionAll.pilot} - {sessionAll.date}</li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="rightContainer">
                    <img className="logoHomeVRT" src={require('../Ressources/LogoVRT.png')}/>
                    <h3 className="titleSystem">TELEMETRY SYSTEM</h3>
                    <button onClick={navigationClick} className="buttonCreateProject">
                        Create a new session
                    </button>
                </div>
            </div>
    )
}

export default ProjectNavigationPage;