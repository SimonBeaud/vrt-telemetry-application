import React, {useEffect, useState} from 'react'
import {ipcRenderer} from 'electron'
import Chart from 'chart.js/auto';
import LineChart from "../Components/LineChart";


function GeneralDataPage(){

    const [liveData, setLiveData] = useState(null);
    const [tensionBatteryHV, setTensionBatteryHV] = useState(null);
    const [amperageBatteryHV, setAmperageBatteryHV] = useState(null);
    const [temperatureBatteryHV, setTemperatureBatteryHV] = useState(null);
    const [enginePower, setEnginePower] = useState(null);
    const [engineTemperature, setEngineTemperature] = useState(null);
    const [engineAngularSpeed, setEngineAngularSpeed] = useState(null);
    const [carSpeed, setCarSpeed] = useState(null);
    const [pressureTireFL, setPressureTireFL] = useState(null);
    const [pressureTireFR, setPressureTireFR] = useState(null);
    const [pressureTireBL, setPressureTireBL] = useState(null);
    const [pressureTireBR, setPressureTireBR] = useState(null);
    const [inverterTemperature, setInverterTemperature] = useState(null);
    const [temperatureBatteryLV, setTemperatureBatteryLV] = useState(null);


    //console.log("tension; "+tensionBatteryHV);

    /*
    const updateTensionBatteryHV = (event, ReceiveTensionBatteryHV) =>{
        setTensionBatteryHV(ReceiveTensionBatteryHV);
    }
    */


    const updateLiveData = (event, ReceiveLiveData) =>{
        setLiveData(ReceiveLiveData);
    }


/*
    useEffect(()=>{
        ipcRenderer.on("get-tension", updateTensionBatteryHV);

        return ()=>{
            ipcRenderer.off("get-tension", updateTensionBatteryHV);
        };
    }, []);
*/

    useEffect(()=>{
        ipcRenderer.on("get-live-data", updateLiveData);

        return ()=>{
            ipcRenderer.off("get-live-data", updateLiveData);
        };
    }, []);



    useEffect(() => {
        if (liveData) {
            setTensionBatteryHV(liveData.TensionBatteryHV);
            setAmperageBatteryHV(liveData.AmperageBatteryHV);
            setTemperatureBatteryHV(liveData.TemperatureBatteryHV);
            setEnginePower(liveData.EnginePower);
            setEngineTemperature(liveData.EngineTemperature);
            setEngineAngularSpeed(liveData.EngineAngularSpeed);
            setCarSpeed(liveData.CarSpeed);
            setPressureTireFL(liveData.PressureTireFL);
            setPressureTireFR(liveData.PressureTireFR);
            setPressureTireBL(liveData.PressureTireBL);
            setPressureTireBR(liveData.PressureTireBR);
            setInverterTemperature(liveData.InverterTemperature);
            setTemperatureBatteryLV(liveData.TemperatureBatteryLV);

        }
    }, [liveData]);






    /*
    //CODE GENERé
    //##############################################################################
    useEffect(() => {
        const chartInstance = Chart.instances[0];
        if (chartInstance && chartInstance && chartInstance.data) {
            const timestamp = Date.now();
            const dataPoint = { x: timestamp, y: pressure };
            chartInstance.data.datasets[0].data.push(dataPoint);
            chartInstance.update({
                preservation: true,
            });
        }
    }, [pressure]);
    */


    //##############################################################################

    return(
        <header className="App-header">
            <div className="PageContainer">
                <h1>General Data Page</h1>
                <h1>{tensionBatteryHV}</h1>
            </div>
        </header>
    )
}

export default GeneralDataPage;