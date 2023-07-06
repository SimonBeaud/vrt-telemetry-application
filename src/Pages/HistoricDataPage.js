import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {getDataValuesBySessionAndDataType} from "../DataBase/Database";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";
import ChartLine from "../Components/ChartLine";
import '../Style/HistoricLiveDataStyle.css';
import { SessionContext } from '../SessionContext';

function HistoricDataPage(){

    /*Session id management*/
    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;


    const dataTypesNames = {
        TensionBatteryHV: 1,
        AmperageBatteryHV: 2,
        TemperatureBatteryHV: 3,
        EnginePower: 4,
        EngineTemperature: 5,
        EngineAngularSpeed: 6,
        CarSpeed: 7,
        PressureTireFL: 8,
        PressureTireFR: 9,
        PressureTireBL: 10,
        PressureTireBR: 11,
        InverterTemperature: 12,
        TemperatureBatteryLV: 13,
    };


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
        ipcRenderer.invoke('deleteDataValues').then();
    };





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
                setEnginePower(subMatrices[dataTypesNames.EnginePower] || []);
                setEngineTemperature(subMatrices[dataTypesNames.EngineTemperature] || []);
                setEngineAngularSpeed(subMatrices[dataTypesNames.EngineAngularSpeed] || []);
                setCarSpeed(subMatrices[dataTypesNames.CarSpeed] || []);
                setPressureTireFL(subMatrices[dataTypesNames.PressureTireFL] || []);
                setPressureTireFR(subMatrices[dataTypesNames.PressureTireFR] || []);
                setPressureTireBL(subMatrices[dataTypesNames.PressureTireBL] || []);
                setPressureTireBR(subMatrices[dataTypesNames.PressureTireBR] || []);
                setInverterTemperature(subMatrices[dataTypesNames.InverterTemperature] || []);
                setTemperatureBatteryLV(subMatrices[dataTypesNames.TemperatureBatteryLV] || []);
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


                    <div className="HistoricContainer">
                        <div className="LeftContainerHistoric">
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Car speed</p>
                                <ChartLine data={carSpeed}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Pressure tire front left</p>
                                <ChartLine data={pressureTireFL}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Pressure tire front right</p>
                                <ChartLine data={pressureTireFR}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Pressure tire back left</p>
                                <ChartLine data={pressureTireBL}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Pressure tire back right</p>
                                <ChartLine data={pressureTireBR}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Engine speed</p>
                                <ChartLine data={engineAngularSpeed}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Engine power</p>
                                <ChartLine data={enginePower}/>
                            </div>
                        </div>
                        <div className="RightContainerHistoric">
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Temperature Engine</p>
                                <ChartLine data={engineTemperature}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Temperature Inverter</p>
                                <ChartLine data={inverterTemperature}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Temperature high voltage battery</p>
                                <ChartLine data={temperatureBatteryHV}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Temperature low voltage battery</p>
                                <ChartLine data={temperatureBatteryLV}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Tension high voltage battery</p>
                                <ChartLine data={tensionBatteryHV}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Amperage high voltage battery</p>
                                <ChartLine data={amperageBatteryHV}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HistoricDataPage;