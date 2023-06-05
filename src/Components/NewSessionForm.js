import React, { useState } from 'react';
import e from "express";
import * as Console from "console";

export default function NewSessionForm(handleSubmit){
    const [name, setName] = useState("");
    const [pilot, setPilot] = useState("");
    const [date, setDate] = useState("");

    const handleNameChange = (e) =>setName(e.target.value);
    const handlePilotChange = (e) =>setPilot(e.target.value);
    const handleDateChange = (e) =>setDate(e.target.value);



    return(
        <form
            onSubmit={(e)=>{
            handleSubmit(e, name, pilot, date);

        }}
        >
            <div className="NewSessionFormContainer">
                <input
                    className="inputSession"
                    type="text"
                    onChange={handleNameChange}
                />
                <br/>


                <input
                    className="inputSession"
                    type="text"
                    onChange={handlePilotChange}
                />
                <br/>


                <input
                    className="inputSession"
                    type="text"
                    onChange={handleDateChange}
                />
                <br/>
                <button className="SubmitButton" type="submit">Create</button>
            </div>
        </form>
    )



}