import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {ipcRenderer} from "electron";
import { saveAs } from 'file-saver';
import {SessionContext} from "../SessionContext";

function ExportDataPage(){

    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;

    const [dataValues, setDataValues] = useState([]);

    const fetchData = async () => {

        try {
            const response = await ipcRenderer.invoke('get-values-bySession', { sessionId });

            if (response.success) {
                setDataValues(response.dataValues);
            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    const exportCSV = () => {
        const csvContent = [['Session ID', 'Session Name','DataRecord', 'timeRecord', 'DataType']];
        dataValues.forEach((item) => {
            csvContent.push([sessionId, session.name, item.DataRecord, item.timeRecord, item.DataType_id]);
        });

        const csv = csvContent.map((row) => row.join(',')).join('\n');
        const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(csvBlob, 'export_dataValue_'+session.name+'.csv');

    }





    return(
        <header className="App-header">
            <div className="PageContainer">
                <h1>Export Data Page</h1>
                <button className="ReloadButton" onClick={exportCSV}>Export Data</button>
            </div>
        </header>
    )
}

export default ExportDataPage;