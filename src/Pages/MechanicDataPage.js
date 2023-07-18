import React, {useContext, useEffect, useState} from 'react'
import {SessionContext} from "../SessionContext";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";


function MechanicDataPage(){

    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;
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

                setCoupleEngine(subMatrices[await getDataTypeID("CoupleEngine")] || []);
                setSteeringWheelAngle(subMatrices[await getDataTypeID("SteeringWheelAngle")] || []);
                setAxisInertialSensor(subMatrices[await getDataTypeID("AxisInertialSensor")] || []);
                setCarSpeed_NL(subMatrices[await getDataTypeID("CarSpeed_NL")] || []);
                setCoupleWheelBL(subMatrices[await getDataTypeID("CoupleWheelBL")] || []);
                setCoupleWheelBR(subMatrices[await getDataTypeID("CoupleWheelBR")] || []);
                setSuspensionFL(subMatrices[await getDataTypeID("SuspensionFL")] || []);
                setSuspensionFR(subMatrices[await getDataTypeID("SuspensionFR")] || []);
                setSuspensionBL(subMatrices[await getDataTypeID("SuspensionBL")] || []);
                setSuspensionBR(subMatrices[await getDataTypeID("SuspensionBR")] || []);
                setPressureTireFL_NL(subMatrices[await getDataTypeID("PressureTireFL_NL")] || []);
                setPressureTireFR_NL(subMatrices[await getDataTypeID("PressureTireFR_NL")] || []);
                setPressureTireBL_NL(subMatrices[await getDataTypeID("PressureTireBL_NL")] || []);
                setPressureTireBR_NL(subMatrices[await getDataTypeID("PressureTireBR_NL")] || []);
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

async function getDataTypeID(dataTypeName) {
    const response = await ipcRenderer.invoke("get-datatype-id", { dataTypeName });
    if (response.success) {
        return response.dataTypeID;
    } else {
        console.error(response.error);
        return null;
    }
}