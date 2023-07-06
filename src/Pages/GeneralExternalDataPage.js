import React, {useContext, useEffect, useState} from 'react'
import {SessionContext} from "../SessionContext";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";


function GeneralExternalDataPage(){

    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;

    const dataTypesNames = {

        AxisInertialSensor: 28,
        CarSpeed_NL: 20,
        TemperatureBatteryHV_NL: 16,
        AmperageBatteryHV_NL: 15,
        SteeringWheelAngle: 27,

    }

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

                setAxisInertialSensor(subMatrices[dataTypesNames.AxisInertialSensor] || []);
                setCarSpeed_NL(subMatrices[dataTypesNames.CarSpeed_NL] || []);
                setAmperageBatteryHV_NL(subMatrices[dataTypesNames.AmperageBatteryHV_NL] || []);
                setTemperatureBatteryHV_NL(subMatrices[dataTypesNames.TemperatureBatteryHV_NL] || []);
                setSteeringWheelAngle(subMatrices[dataTypesNames.SteeringWheelAngle] || []);


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
                    <LineChartStatic datasets={[carSpeed_NL]} />
                </div>

                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">2 axis inertial sensor</p>
                    <LineChartStatic datasets={[axisInertialSensor]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Amperage battery HV</p>
                    <LineChartStatic datasets={[amperageBatteryHV_NL]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Temperature battery HV</p>
                    <LineChartStatic datasets={[temperatureBatteryHV_NL]} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Steering wheel angle</p>
                    <LineChartStatic datasets={[steeringWheelAngle]} />
                </div>
            </div>
        </header>
    )
}

export default GeneralExternalDataPage;