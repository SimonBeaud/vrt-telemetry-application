import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {ipcRenderer} from "electron";
import { saveAs } from 'file-saver';
import {SessionContext} from "../SessionContext";
import '../Style/ExportDataStyle.css';
import moment from 'moment';


function ExportDataPage(){

    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;
    const [dataValues, setDataValues] = useState([]);
    const [exportName, setExportName] = useState(['']);
    const [exportComment, setExportComment] = useState(['']);

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

    const exportCSV = async () => {
        const csvContent = [
            ['Export Name', 'Export Comment'],
            [exportName,  exportComment],
            [],
            ['Session ID', 'Session Name', 'DataRecord', 'timeRecord', 'DataType'],
        ];

        dataValues.forEach((item) => {
            const TimeRecord = moment(item.timeRecord).format('YYYY-MM-DD HH:mm:ss');
            //const DataTypeName = await ipcRenderer.invoke('get-datatype-name', { DataType_id: item.DataType_id });
            csvContent.push([sessionId, session.name, item.DataRecord,  TimeRecord, item.DataType_id]);
        });
        const csv = csvContent.map((row) => row.join(';')).join('\n');
        const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        saveAs(csvBlob, exportName+"_"+session.name+'.csv');
    }

    return(
        <header className="App-header">
            <div className="PageContainer">
                <div className="ExportFormContainer">
                    <div className="FormContent">
                        <h3 className="titleForm">Export session data</h3>
                        <form onSubmit={exportCSV}>
                            <div className="InputExportForm">
                                <p className="labelExportInput">Export name:</p>
                                <input className="inputExport" type="text" value={exportName} onChange={(e) => setExportName(e.target.value)} />
                            </div>
                            <div className="InputExportForm">
                                <p className="labelExportInput">Export comment:</p>
                                <input className="inputExport" type="text" value={exportComment} onChange={(e) => setExportComment(e.target.value)} />
                            </div>
                            <button className="buttonExportForm" type="submit">Export Data</button>
                        </form>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ExportDataPage;