import React, {useContext, useEffect, useState} from 'react'
import {AppContext} from '../App';
import '../Style/ProjectNavigationStyle.css';
import {getDatabase} from "../DataBase/Database";
import NewSessionForm from "../Components/NewSessionForm";
const electron = window.require('electron');
const { ipcRenderer } = window.require('electron');



/*
const navigationClick = ()=>{
    navigateTo('/GeneralData')
}
*/



//Page logic
function ProjectNavigationPage(){

    const {navigateTo} = useContext(AppContext);
    const [sessions, setSessions] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);


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
                    <button onClick={openModal} className="buttonCreateProject">
                        Create a new session
                    </button>
                </div>

                {isModalOpen && (
                    <div className="creationModal">
                        <div className="modalContent">
                            <NewSessionForm handleSubmit={() => navigateTo('/GeneralData')} />
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}

            </div>
    );
}

export default ProjectNavigationPage;