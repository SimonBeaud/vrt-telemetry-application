import React, {useContext, useEffect, useState} from 'react'
import {SessionContext} from "../SessionContext";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";


function MechanicDataPage(){

    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;

    const dataTypesNames = {
        CoupleEngine: 39,
        SteeringWheelAngle: 27,
        AxisInertialSensor: 28,
        CarSpeed_NL: 20,
        CoupleWheelBL: 40,
        CoupleWheelBR: 41,
        SuspensionFL: 31,
        SuspensionFR: 32,
        SuspensionBL: 33,
        SuspensionBR: 34,
        PressureTireFL_NL: 21,
        PressureTireFR_NL: 22,
        PressureTireBL_NL: 23,
        PressureTireBR_NL: 24,
    }

    const [coupleEngine, setCoupleEngine] = useState([]);
    const [steeringWheelAngle, setSteeringWheelAngle] = useState([]);
    const [axisInertialSensor, setAxisInertialSensor] = useState([]);
    const [carSpeed_NL, setCarSpeed_NL] = useState([]);
    const [coupleWheelBL, setCoupleWheelBL] = useState([]);
    const [coupleWheelBR, setCoupleWheelBR] = useState([]);
    const [suspensionFL, setSuspensionFL] = useState([]);
    const [suspensionFR, setSuspensionFR] = useState([]);
    const [suspensionBL, setSuspensionBL] = useState([]);
    const [suspensionBR, setSuspensionBR] = useState([]);
    const [pressureTireFL_NLL, setPressureTireFL_NL] = useState([]);
    const [pressureTireFR_NL, setPressureTireFR_NL] = useState([]);
    const [pressureTireBL_NL, setPressureTireBL_NL] = useState([]);
    const [pressureTireBR_NL, setPressureTireBR_NL] = useState([]);


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

                setCoupleEngine(subMatrices[dataTypesNames.CoupleEngine] || []);
                setSteeringWheelAngle(subMatrices[dataTypesNames.SteeringWheelAngle] || []);
                setAxisInertialSensor(subMatrices[dataTypesNames.AxisInertialSensor] || []);
                setCarSpeed_NL(subMatrices[dataTypesNames.CarSpeed_NL] || []);
                setCoupleWheelBL(subMatrices[dataTypesNames.CoupleWheelBL] || []);
                setCoupleWheelBR(subMatrices[dataTypesNames.CoupleWheelBR] || []);
                setSuspensionFL(subMatrices[dataTypesNames.SuspensionFL] || []);
                setSuspensionFR(subMatrices[dataTypesNames.SuspensionFR] || []);
                setSuspensionBL(subMatrices[dataTypesNames.SuspensionBL] || []);
                setSuspensionBR(subMatrices[dataTypesNames.SuspensionBR] || []);
                setPressureTireFL_NL(subMatrices[dataTypesNames.PressureTireFL_NL] || []);
                setPressureTireFR_NL(subMatrices[dataTypesNames.PressureTireFR_NL] || []);
                setPressureTireBL_NL(subMatrices[dataTypesNames.PressureTireBL_NL] || []);
                setPressureTireBR_NL(subMatrices[dataTypesNames.PressureTireBR_NL] || []);


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
                    <LineChartStatic datasets={[carSpeed_NL]}  datasetNames={["Car speed"]} width={1100} height={450}/>
                </div>

                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Suspensions</p>
                    <LineChartStatic datasets={[suspensionFL, suspensionFR, suspensionBL, suspensionBR]}
                                     datasetNames={["front left", "front right", "back left", "back right"]} width={1100} height={450}/>
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Pressure</p>
                    <LineChartStatic datasets={[pressureTireFL_NLL, pressureTireFR_NL, pressureTireBL_NL, pressureTireBR_NL]}
                                     datasetNames={["front left", "front right", "back left", "back right"]} width={1100} height={450}/>
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Couple</p>
                    <LineChartStatic datasets={[coupleWheelBL, coupleWheelBR]}
                                     datasetNames={["back left wheel", "back right wheel"]} width={1100} height={450}/>
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Engine Couple</p>
                    <LineChartStatic datasets={[coupleEngine]} datasetNames={["Couple engine"]} width={1100} height={450} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">Wheel angle</p>
                    <LineChartStatic datasets={[steeringWheelAngle]} datasetNames={["Angle"]} width={1100} height={450} />
                </div>
                <div className="ChartExternalContainer">
                    <p className="ChartLabel"  id="left">inertial 2 axe</p>
                    <LineChartStatic datasets={[axisInertialSensor]} datasetNames={["inertial"]}  width={1100} height={450}/>
                </div>

            </div>
        </header>
    )
}

export default MechanicDataPage;