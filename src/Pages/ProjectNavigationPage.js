import React, {useContext, useEffect, useState} from 'react'
import {AppContext} from '../App';
import '../Style/ProjectNavigationStyle.css';
import {getDatabase} from "../DataBase/Database";
import NewSessionForm from "../Components/NewSessionForm";
import {BrowserRouter} from "react-router-dom";
import { SessionContext } from '../SessionContext';

const electron = window.require('electron');
const { ipcRenderer } = window.require('electron');
const { BrowserWindow } = require('electron');


//Page logic
function ProjectNavigationPage(){

    const {navigateTo} = useContext(AppContext);
    const [sessions, setSessions] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {session, updateSession} = useContext(SessionContext);


    useEffect(() => {
        console.log("session: " + session.id + " " + session.name);
    }, [session]);



    //Session click handle
    const handleSessionClick = (id, name) =>{
        console.log('Session clicked:', id, name);
        navigateTo("GeneralData");
        updateSession(id, name);
        ipcRenderer.invoke('add-current-session', id);

    }



    //Modal Logic
    const openModal = ()=>{
        setIsModalOpen(true);
    };
    const closeModal = ()=>{
        setIsModalOpen(false);
    };

    const navigationClick = () =>{
        openModal();
    };



    useEffect(()=>{
        ipcRenderer.invoke('get-sessions').then(sessionAll=>{
            setSessions(sessionAll);
        }).catch(err=>{
            console.error(err)
        })
    }, []);


    const deleteAllSession=()=>{
        ipcRenderer.invoke('delete-sessions').then();
    }


    //Update session list
    const handleSessionAdd=()=>{
        ipcRenderer.invoke('get-sessions').then(sessionAll=>{
          setSessions(sessionAll);
        }).catch(err=>{
            console.error(err);
        })
    }





    return(
            <div className="ProjectNavigationContainer">
                <div className="leftContainer">
                    <h3 className="titleSession">Last Sessions</h3>
                    <div className="sessionList">
                        <ul>
                            {sessions.map((sessionAll, index)=>(
                                <li key={index} onClick={()=>handleSessionClick(sessionAll.id, sessionAll.name)}>{sessionAll.name} - {sessionAll.pilot} - {sessionAll.date}</li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="rightContainer">

                    {!isModalOpen && (
                        <div>
                            <img className="logoHomeVRT" src={require('../Ressources/LogoVRT.png')} alt="VRT Logo" />
                            <h3 className="titleSystem">TELEMETRY SYSTEM</h3>
                            <button onClick={openModal} className="buttonCreateProject">
                                Create a new session
                            </button>
                        </div>
                    )}

                    {isModalOpen && (
                        <div className="creationForm">
                            <div className="modalContent">
                                <h3 className="titleForm">Create a new session</h3>
                                <NewSessionForm handleSubmit={() => navigateTo('GeneralData')} handleSessionAdd={handleSessionAdd} />
                                <button className="buttonFormClose" onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    );
}

export default ProjectNavigationPage;