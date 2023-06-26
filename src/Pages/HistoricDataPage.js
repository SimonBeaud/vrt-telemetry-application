import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {getDataValuesBySessionAndDataType} from "../DataBase/Database";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";
import ChartLine from "../Components/ChartLine";

function HistoricDataPage(){


    const dataTypeName = 'CarSpeed';
    const sessionId = 2300;


    const [dataValues, setDataValues] = useState([]);


    const fetchData = async () => {
        try {
            const response = await ipcRenderer.invoke('get-values-bySession-byType', { dataTypeName, sessionId });

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





    return(
        <header className="App-header">
            <div className="PageContainer">
                <h1>Historic Data Page</h1>
                <button onClick={fetchData}>Retrieve Data</button>
                <ChartLine data={dataValues}/>

            </div>
        </header>
    )
}

export default HistoricDataPage;