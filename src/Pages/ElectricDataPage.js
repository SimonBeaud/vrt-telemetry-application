import React, {useContext, useEffect, useState} from 'react'
import ChartLine from "../Components/ChartLine";
import LineChartStatic from "../Components/LineChartStatic";
import {SessionContext} from "../SessionContext";
import {ipcRenderer} from "electron";


function ElectricDataPage(){

    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;

    const dataTypesNames = {
        TensionBatteryHV: 1,
        AmperageBatteryHV: 2,
        TemperatureBatteryHV: 3,
    };

    const [tensionBatteryHV, setTensionBatteryHV] = useState([]);
    const [amperageBatteryHV, setAmperageBatteryHV] = useState([]);
    const [temperatureBatteryHV, setTemperatureBatteryHV] = useState([]);


    const fetchData = async () => {
        try {
            // const response = await ipcRenderer.invoke('get-values-bySession-byType', { dataTypeName, sessionId });
            const response = await ipcRenderer.invoke('get-values-bySession', {sessionId});

            if (response.success) {
                // Créer un objet pour stocker les sous-matrices
                const subMatrices = {};

                // Regrouper les valeurs par DataType_id dans les sous-matrices correspondantes
                response.dataValues.forEach(item => {
                    const dataTypeId = item.DataType_id;
                    if (!subMatrices[dataTypeId]) {
                        subMatrices[dataTypeId] = [item];
                    } else {
                        subMatrices[dataTypeId].push(item);
                    }
                });

                // Convertir l'objet en tableau de sous-matrices
                const newDataValues = Object.values(subMatrices);

                setTensionBatteryHV(subMatrices[dataTypesNames.TensionBatteryHV] || []);
                setAmperageBatteryHV(subMatrices[dataTypesNames.AmperageBatteryHV] || []);
                setTemperatureBatteryHV(subMatrices[dataTypesNames.TemperatureBatteryHV] || []);

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
            <div className="TabContainer">
                <h1>Electric data</h1>
                <div className="ChartHistoricContainer">
                    <p className="ChartLabel"  id="left">Car speed</p>
                    <LineChartStatic datasets={[tensionBatteryHV, amperageBatteryHV, temperatureBatteryHV]} />
                </div>
            </div>
        </header>
    )
}

export default ElectricDataPage;