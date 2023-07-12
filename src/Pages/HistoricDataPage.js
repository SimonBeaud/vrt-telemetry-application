import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {getDataValuesBySessionAndDataType} from "../DataBase/Database";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";
import '../Style/HistoricLiveDataStyle.css';
import { SessionContext } from '../SessionContext';

function HistoricDataPage(){

    /*Session id management*/
    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;


    const [tensionBatteryHV, setTensionBatteryHV] = useState([]);
    const [amperageBatteryHV, setAmperageBatteryHV] = useState([]);
    const [temperatureBatteryHV, setTemperatureBatteryHV] = useState([]);
    const [enginePower, setEnginePower] = useState([]);
    const [engineTemperature, setEngineTemperature] = useState([]);
    const [engineAngularSpeed, setEngineAngularSpeed] = useState([]);
    const [carSpeed, setCarSpeed] = useState([]);
    const [pressureTireFL, setPressureTireFL] = useState([]);
    const [pressureTireFR, setPressureTireFR] = useState([]);
    const [pressureTireBL, setPressureTireBL] = useState([]);
    const [pressureTireBR, setPressureTireBR] = useState([]);
    const [inverterTemperature, setInverterTemperature] = useState([]);
    const [temperatureBatteryLV, setTemperatureBatteryLV] = useState([]);


    const deleteAllDataValue = () => {
        ipcRenderer.invoke('delete-data-value', {sessionId}).then();
    };





    const fetchData = async () => {
        try {
            const response = await ipcRenderer.invoke('get-values-bySession', {sessionId});

            if (response.success) {

                const subMatrices = {};


                response.dataValues.forEach(item => {
                    const dataTypeId = item.DataType_id;
                    if (!subMatrices[dataTypeId]) {
                        subMatrices[dataTypeId] = [item];
                    } else {
                        subMatrices[dataTypeId].push(item);
                    }
                });



                setTensionBatteryHV(subMatrices[await getDataTypeID("TensionBatteryHV")] || []);
                setAmperageBatteryHV(subMatrices[await getDataTypeID("AmperageBatteryHV")] || []);
                setTemperatureBatteryHV(subMatrices[await getDataTypeID("TemperatureBatteryHV")] || []);
                setEnginePower(subMatrices[await getDataTypeID("EnginePower")] || []);
                setEngineTemperature(subMatrices[await getDataTypeID("EngineTemperature")] || []);
                setEngineAngularSpeed(subMatrices[await getDataTypeID("EngineAngularSpeed")] || []);
                setCarSpeed(subMatrices[await getDataTypeID("CarSpeed")] || []);
                setPressureTireFL(subMatrices[await getDataTypeID("PressureTireFL")] || []);
                setPressureTireFR(subMatrices[await getDataTypeID("PressureTireFR")] || []);
                setPressureTireBL(subMatrices[await getDataTypeID("PressureTireBL")] || []);
                setPressureTireBR(subMatrices[await getDataTypeID("PressureTireBR")] || []);
                setInverterTemperature(subMatrices[await getDataTypeID("InverterTemperature")] || []);
                setTemperatureBatteryLV(subMatrices[await getDataTypeID("TemperatureBatteryLV")] || []);
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
                <div className="PageHistoricContainer">
                    <div className="TitleContainerHistoric">
                        <h1>Live data history</h1>
                        <button className="ReloadButton" onClick={fetchData}>Reload Data</button>
                        <button className="ReloadButton" onClick={deleteAllDataValue}>Delete Data</button>
                    </div>

                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">Car speed</p>
                        <LineChartStatic datasets={[carSpeed]}  datasetNames={["Car speed"]} width={900} height={450} />
                    </div>
                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">Tyres pressure</p>
                        <LineChartStatic datasets={[pressureTireFL, pressureTireFR, pressureTireBL ,pressureTireBR ]}  datasetNames={["Front left", "Front right", "Back left", "Back right"]} width={900} height={450} />
                    </div>
                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">Temperatures</p>
                        <LineChartStatic datasets={[engineTemperature, inverterTemperature, temperatureBatteryHV ,temperatureBatteryLV ]}  datasetNames={["Engine", "Inverter", "Battery HV", "Battery LV"]} width={900} height={450} />
                    </div>
                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">Power</p>
                        <LineChartStatic datasets={[enginePower]}  datasetNames={["Engine"]} width={900} height={450} />
                    </div>
                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">Engine speed</p>
                        <LineChartStatic datasets={[engineAngularSpeed]}  datasetNames={["Angular speed"]} width={900} height={450} />
                    </div>
                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">Battery HV</p>
                        <LineChartStatic datasets={[tensionBatteryHV, amperageBatteryHV ]}  datasetNames={["Tension", "Amperage"]} width={900} height={450} />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HistoricDataPage;


async function getDataTypeID(dataTypeName) {
    const response = await ipcRenderer.invoke("get-datatype-id", { dataTypeName });
    if (response.success) {
        return response.dataTypeID;
    } else {
        console.error(response.error);
        return null;
    }
}
