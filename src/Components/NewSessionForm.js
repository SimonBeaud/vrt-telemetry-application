import React, { useState } from 'react';
import e, {response} from "express";
import * as Console from "console";
import {ipcRenderer} from "electron";

export default function NewSessionForm({handleSubmit, handleSessionAdd}){
    const [name, setName] = useState("");
    const [pilot, setPilot] = useState("");
    const [date, setDate] = useState("");


    const handleNameChange = (e) =>setName(e.target.value);
    const handlePilotChange = (e) =>setPilot(e.target.value);
    const handleDateChange = (e) =>setDate(e.target.value);


    const handleFormSubmit=(e)=>{
        e.preventDefault();
        addSession(name, pilot, date).then(response=>{
            if(response.success){
                console.log("session add successfully: ", response.sessionId);
                handleSessionAdd();
            }else{
                console.log("Error when adding succession: ", response.error);
            }
        }).catch(err=>{
                console.error("Error when calling the methode add session: ", err);
            });
    }


    //call the add session methode
    const addSession = (name, pilot, date)=>{
        return ipcRenderer.invoke('add-session', {name, pilot, date});
    };




    return(
        <form onSubmit={handleFormSubmit}>
            <div className="NewSessionFormContainer">
                <div className="inputContainer">
                    <p className="labelInput">Name</p>
                    <input
                        className="inputSession"
                        type="text"
                        onChange={handleNameChange}
                        value={name}
                        required
                    />
                </div>
                <br/>
                <div className="inputContainer">
                    <p className="labelInput">Pilot</p>
                    <input
                        className="inputSession"
                        type="text"
                        onChange={handlePilotChange}
                        value={pilot}
                        required
                    />
                </div>
                <br/>
                <div className="inputContainer">
                    <p className="labelInput">Date</p>
                    <input
                        className="inputSession"
                        type="date"
                        onChange={handleDateChange}
                        value={date}
                        required
                    />
                </div>
                <br/>

                <button className="buttonForm" type="submit">Create</button>
            </div>
        </form>
    )
}



