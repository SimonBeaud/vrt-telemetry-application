import React, {useContext, useEffect, useState} from 'react'
import LineChartStatic from "../Components/LineChartStatic";
import {SessionContext} from "../SessionContext";
import {ipcRenderer} from "electron";


function ElectricDataPage(){

    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;


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


    const fetchData = async () => {

        try{
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


                setEnginePower_NL(subMatrices[await getDataTypeID("EnginePower_NL")] || []);
                setCoupleEngine(subMatrices[await getDataTypeID("CoupleEngine")] || []);
                setEngineAngularSpeed_NL(subMatrices[await getDataTypeID("EngineAngularSpeed_NL")] || []);
                setCarSpeed_NL(subMatrices[await getDataTypeID("CarSpeed_NL")] || []);
                setTensionBatteryHV_NL(subMatrices[await getDataTypeID("TensionBatteryHV_NL")] || []);
                setAmperageBatteryHV_NL(subMatrices[await getDataTypeID("AmperageBatteryHV_NL")] || []);
                setTemperatureCoolingSystem(subMatrices[await getDataTypeID("TemperatureCoolingSystem")] || []);
                setEngineTemperature_NL(subMatrices[await getDataTypeID("EngineTemperature_NL")] || []);
                setInverterTemperature_NL(subMatrices[await getDataTypeID("InverterTemperature_NL")] || []);
                setTemperatureBatteryHV_NL(subMatrices[await getDataTypeID("TemperatureBatteryHV_NL")] || []);
                setTemperatureBatteryLV_NL(subMatrices[await getDataTypeID("TemperatureBatteryLV_NL")] || []);


            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        console.log("Call fetch methode")
    }, []);


    return(
        <header className="App-header">
            <div className="TabContainer">
                <button className="ReloadButton" onClick={fetchData}>Reload Data</button>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Car speed</p>
                    <LineChartStatic datasets={[carSpeed_NL]}  datasetNames={["Car speed"]} width={900} height={450} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Temperatures</p>
                    <LineChartStatic datasets={[engineTemperature_NL, inverterTemperature_NL, temperatureBatteryHV_NL, temperatureBatteryLV_NL, temperatureCoolingSystem]} datasetNames={["Engine", "Inverter", "Battery HV", "Battery LV", "Cooling systems"]} width={900} height={450} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Engine Power</p>
                    <LineChartStatic datasets={[enginePower_NL]} datasetNames={["Engine power"]} width={1100} height={450}/>
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Engine Couple</p>
                    <LineChartStatic datasets={[coupleEngine]} datasetNames={["Engine couple"]} width={1100} height={450} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Engine Speed</p>
                    <LineChartStatic datasets={[engineAngularSpeed_NL]} datasetNames={["Angular speed"]}  width={1100} height={450} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Tension Battery HV</p>
                    <LineChartStatic datasets={[tensionBatteryHV_NL]} datasetNames={["Tension"]} width={1100} height={450} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Courant Battery HV</p>
                    <LineChartStatic datasets={[amperageBatteryHV_NL]} datasetNames={["Courant"]}  width={1100} height={450}/>
                </div>
            </div>
        </header>
    )
}

async function getDataTypeID(dataTypeName) {
    const response = await ipcRenderer.invoke("get-datatype-id", { dataTypeName });
    if (response.success) {
        return response.dataTypeID;
    } else {
        console.error(response.error);
        return null;
    }
}




export default ElectricDataPage;