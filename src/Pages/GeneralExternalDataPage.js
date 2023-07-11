import React, {useContext, useEffect, useState} from 'react'
import {SessionContext} from "../SessionContext";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";


function GeneralExternalDataPage(){

    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;

    const [axisInertialSensor, setAxisInertialSensor] = useState([]);
    const [carSpeed_NL, setCarSpeed_NL] = useState([]);
    const [temperatureBatteryHV_NL, setTemperatureBatteryHV_NL] = useState([]);
    const [amperageBatteryHV_NL, setAmperageBatteryHV_NL] = useState([]);
    const [steeringWheelAngle, setSteeringWheelAngle] = useState([]);



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

                setAxisInertialSensor(subMatrices[await getDataTypeID("AxisInertialSensor")] || []);
                setCarSpeed_NL(subMatrices[await getDataTypeID("CarSpeed_NL")] || []);
                setAmperageBatteryHV_NL(subMatrices[await getDataTypeID("AmperageBatteryHV_NL")] || []);
                setTemperatureBatteryHV_NL(subMatrices[await getDataTypeID("TemperatureBatteryHV_NL")] || []);
                setSteeringWheelAngle(subMatrices[await getDataTypeID("SteeringWheelAngle")] || []);


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
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Car speed</p>
                    <LineChartStatic datasets={[carSpeed_NL]} datasetNames={["Car speed"]} />
                </div>

                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">2 axis inertial sensor</p>
                    <LineChartStatic datasets={[axisInertialSensor]} datasetNames={["inertial"]} width={1100} height={450}/>
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Amperage battery HV</p>
                    <LineChartStatic datasets={[amperageBatteryHV_NL]} datasetNames={["Courant"]} width={1100} height={450}/>
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Temperature battery HV</p>
                    <LineChartStatic datasets={[temperatureBatteryHV_NL]} datasetNames={["Temperature"]} width={1100} height={450}/>
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Steering wheel angle</p>
                    <LineChartStatic datasets={[steeringWheelAngle]} datasetNames={["Steering wheel"]} width={1100} height={450}/>
                </div>
            </div>
        </header>
    )
}

export default GeneralExternalDataPage;

async function getDataTypeID(dataTypeName) {
    const response = await ipcRenderer.invoke("get-datatype-id", { dataTypeName });
    if (response.success) {
        return response.dataTypeID;
    } else {
        console.error(response.error);
        return null;
    }
}