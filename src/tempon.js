import React, {useContext, useEffect, useState} from 'react'
import LineChartStatic from "../Components/LineChartStatic";
import {SessionContext} from "../SessionContext";
import {ipcRenderer} from "electron";


function ElectricDataPage(){

    //Variables declaration
    const {session, setSession} = useContext(SessionContext);
    const sessionID = session.id;

    const dataTypesNames = {
        TensionBatteryHV: 1,
        EnginePower_NL: 17,
        CoupleEngine: 39,
        EngineAngularSpeed_NL: 19,
        CarSpeed_NL: 20,
        TensionBatteryHV_NL: 14,
        AmperageBatteryHV_NL: 15,
        TemperatureCoolingSystem: 42,
        EngineTemperature_NL: 18,
        InverterTemperature_NL: 25,
        TemperatureBatteryHV_NL: 16,
        TemperatureBatteryLV_NL: 26,
    }

    const [tensionBatteryHV, setTensionBatteryHV] = useState([]);
    const [enginePower_NL, setEnginePower_NL] = useState([]);
    const [coupleEngine, setCoupleEngine] = useState([]);
    const [engineAngularSpeed_NL, setEngineAngularSpeed_NL] = useState([]);
    const [carSpeed_NL, setCarSpeed_NL] = useState([]);
    const [tensionBatteryHV_NL, setTensionBatteryHV_NL] = useState([]);
    const [amperageBatteryHV_NL, setAmperageBatteryHV_NL] = useState([]);
    const [temperatureCoolingSystem, setTemperatureCoolingSystem] = useState([]);
    const [engineTemperature_NL, setEngineTemperature_NL] = useState([]);
    const [inverterTemperature_NL, setInverterTemperature_NL] = useState([]);
    const [temperatureBatteryHV_NL, setTemperatureBatteryHV_NL] = useState([]);
    const [temperatureBatteryLV_NL, setTemperatureBatteryLV_NL] = useState([]);


    //Get the data values from the electron.js processes

    const fetchData = async () => {

        try{
            const response = await ipcRenderer.invoke('get-values-bySession', {sessionID});

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

                const newDataValues = Object.values(subMatrices);

                setTensionBatteryHV(subMatrices[dataTypesNames.TensionBatteryHV] || []);
                setEnginePower_NL(subMatrices[dataTypesNames.EnginePower_NL] || []);
                setCoupleEngine(subMatrices[dataTypesNames.CoupleEngine] || []);
                setEngineAngularSpeed_NL(subMatrices[dataTypesNames.EngineAngularSpeed_NL] || []);
                setCarSpeed_NL(subMatrices[dataTypesNames.CarSpeed_NL] || []);
                setTensionBatteryHV_NL(subMatrices[dataTypesNames.TensionBatteryHV_NL] || []);
                setAmperageBatteryHV_NL(subMatrices[dataTypesNames.AmperageBatteryHV_NL] || []);
                setTemperatureCoolingSystem(subMatrices[dataTypesNames.TemperatureCoolingSystem] || []);
                setEngineTemperature_NL(subMatrices[dataTypesNames.EngineTemperature_NL] || []);
                setInverterTemperature_NL(subMatrices[dataTypesNames.InverterTemperature_NL] || []);
                setTemperatureBatteryHV_NL(subMatrices[dataTypesNames.TemperatureBatteryHV_NL] || []);
                setTemperatureBatteryLV_NL(subMatrices[dataTypesNames.TemperatureBatteryLV_NL] || []);

                console.log("Tension batteryHV" +dataTypesNames.TensionBatteryHV_NL);

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
                <button className="ReloadButton" onClick={fetchData}>Reload Data</button>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Car speed</p>
                    <LineChartStatic datasets={[tensionBatteryHV]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Car speed</p>
                    <LineChartStatic datasets={[carSpeed_NL]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Temperatures</p>
                    <LineChartStatic datasets={[engineTemperature_NL, inverterTemperature_NL, temperatureBatteryHV_NL, temperatureBatteryLV_NL, temperatureCoolingSystem]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Engine Power</p>
                    <LineChartStatic datasets={[enginePower_NL]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Engine Couple</p>
                    <LineChartStatic datasets={[coupleEngine]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Engine Speed</p>
                    <LineChartStatic datasets={[engineAngularSpeed_NL]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Tension Battery HV</p>
                    <LineChartStatic datasets={[tensionBatteryHV_NL]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Courant Battery HV</p>
                    <LineChartStatic datasets={[amperageBatteryHV_NL]} />
                </div>
            </div>
        </header>
    )
}

export default ElectricDataPage;