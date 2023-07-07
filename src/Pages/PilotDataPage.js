import React, {useContext, useEffect, useState} from 'react'
import {SessionContext} from "../SessionContext";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";


function PilotDataPage(){

        const {session, updateSession} = useContext(SessionContext);
        const sessionId = session.id;

        const dataTypesNames = {
            EngineAngularSpeed_NL: 19,
            CarSpeed_NL: 20,
            AcceleratorPedalPosition: 30 ,
            BreakPedalPosition: 29,
            AxisInertialSensor: 28,
            SteeringWheelAngle: 27,

        }

        const [engineAngularSpeed_NL, setEngineAngularSpeed_NL] = useState([]);
        const [carSpeed_NL, setCarSpeed_NL] = useState([]);
        const [acceleratorPedalPosition, setAcceleratorPedalPosition] = useState([]);
        const [breakPedalPosition, setBreakPedalPosition] = useState([]);
        const [axisInertialSensor, setAxisInertialSensor] = useState([]);
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

                    setEngineAngularSpeed_NL(subMatrices[dataTypesNames.EngineAngularSpeed_NL] || [])
                    setCarSpeed_NL(subMatrices[dataTypesNames.CarSpeed_NL] || []);
                    setAcceleratorPedalPosition(subMatrices[dataTypesNames.AcceleratorPedalPosition] || []);
                    setBreakPedalPosition(subMatrices[dataTypesNames.BreakPedalPosition] || []);
                    setSteeringWheelAngle(subMatrices[dataTypesNames.SteeringWheelAngle] || []);
                    setAxisInertialSensor(subMatrices[dataTypesNames.AxisInertialSensor] || []);


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
                        <LineChartStatic datasets={[carSpeed_NL]} datasetNames={["Car speed"]} width={1100} height={450}/>
                    </div>

                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">Engine angular speed</p>
                        <LineChartStatic datasets={[engineAngularSpeed_NL]}  datasetNames={["Angular speed"]} width={1100} height={450}/>
                    </div>
                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">Pedals</p>
                        <LineChartStatic datasets={[breakPedalPosition, acceleratorPedalPosition]} datasetNames={["Break", "Accelerator"]} width={1100} height={450}/>
                    </div>
                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">2 axes inertial sensor</p>
                        <LineChartStatic datasets={[axisInertialSensor]} datasetNames={["Inertial"]} width={1100} height={450}/>
                    </div>
                    <div className="ChartExternalContainer">
                        <p className="ChartLabel"  id="left">steering Wheel Angle</p>
                        <LineChartStatic datasets={[steeringWheelAngle]} datasetNames={["Steering wheel"]} width={1100} height={450}/>
                    </div>
                </div>
            </header>
        )
    }


export default PilotDataPage;