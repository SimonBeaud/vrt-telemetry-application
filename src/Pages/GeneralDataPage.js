import React, {useEffect, useState} from 'react'
import {ipcRenderer} from 'electron'
import '../Style/LiveDataStyle.css';

import Chart from 'chart.js/auto';
import LineChart from "../Components/LineChart";


function GeneralDataPage(){

    const [liveData, setLiveData] = useState(null);
    const [tensionBatteryHV, setTensionBatteryHV] = useState(null);
    const [amperageBatteryHV, setAmperageBatteryHV] = useState(null);
    const [temperatureBatteryHV, setTemperatureBatteryHV] = useState(null);
    const [enginePower, setEnginePower] = useState(null);
    const [engineTemperature, setEngineTemperature] = useState(1);
    const [engineAngularSpeed, setEngineAngularSpeed] = useState(null);
    const [carSpeed, setCarSpeed] = useState(null);
    const [pressureTireFL, setPressureTireFL] = useState(null);
    const [pressureTireFR, setPressureTireFR] = useState(null);
    const [pressureTireBL, setPressureTireBL] = useState(null);
    const [pressureTireBR, setPressureTireBR] = useState(null);
    const [inverterTemperature, setInverterTemperature] = useState(null);
    const [temperatureBatteryLV, setTemperatureBatteryLV] = useState(null);


    const updateLiveData = (event, ReceiveLiveData) =>{
        setLiveData(ReceiveLiveData);
    }

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







    //CODE GENERé
    //##############################################################################
    useEffect(() => {
        const chartInstance = Chart.instances[0];
        if (chartInstance && chartInstance && chartInstance.data) {
            const timestamp = Date.now();
            const dataPoint = { x: timestamp, y: engineTemperature };
            chartInstance.data.datasets[0].data.push(dataPoint);
            chartInstance.update({
                preservation: true,
            });
        }
    }, [engineTemperature]);



    //##############################################################################

    return(
        <header className="App-header">
            <div className="PageContainer">
                <div className="leftLiveContainer">


                    <div className="SpeedContainer">
                        <div className="TitleDataContainer">
                            <p className="TitleData">Speed</p>
                        </div>
                        <div className="IconContainer">

                        </div>
                        <div className="DataContainer">
                            <p className="DataValue" id="big">{carSpeed ?? 0}</p>
                            <p className="DataUnit">kmh/h</p>
                        </div>
                    </div>






                    <div className="TyresContainer">
                        <div className="TitleDataContainer">
                            <p className="TitleData">Tyres</p>
                        </div>
                        <div className="PressureContent">


                            <div className="PressureLeft">
                                <div className="PressureLabelContainer">
                                    <p className="PressureLabel"  id="left">pressure</p>
                                </div>
                                <div className="PressureDataContainer" id="topLeft">
                                    <p className="DataValue" id="medium">{pressureTireFL ?? 0}</p>
                                    <p className="DataUnit">bar</p>
                                </div>
                                <div className="PressureLabelContainer">
                                    <p className="PressureLabel" id="left">pressure</p>
                                </div>
                                <div className="PressureDataContainer" id="backLeft">
                                    <p className="DataValue" id="medium">{pressureTireBL ?? 0}</p>
                                    <p className="DataUnit">bar</p>
                                </div>
                            </div>



                            <div className="PressureMiddle">
                                <div>
                                    <img className="IconCar" src={require('../Ressources/car.png')} alt="VRT Logo" />
                                </div>
                            </div>



                            <div className="PressureRight">
                                <div className="PressureLabelContainer">
                                    <p className="PressureLabel"  id="right">pressure</p>
                                </div>
                                <div className="PressureDataContainer" id="topRight">
                                    <p className="DataValue" id="medium">{pressureTireFR ?? 0}</p>
                                    <p className="DataUnit">bar</p>
                                </div>

                                <div className="PressureLabelContainer">
                                    <p className="PressureLabel"  id="right">pressure</p>
                                </div>
                                <div className="PressureDataContainer" id="backRight">
                                    <p className="DataValue" id="medium">{pressureTireBR ?? 0}</p>
                                    <p className="DataUnit">bar</p>
                                </div>
                            </div>
                        </div>
                    </div>










                    <div className="EngineContainer">
                        <div className="TitleDataContainer">
                            <p className="TitleData">Engine</p>
                        </div>
                        <div className="DataContainer">
                            <p className="DataValue" id="big">{engineAngularSpeed ?? 0}</p>
                            <p className="DataUnit">rad/s</p>
                        </div>
                        <div className="DataContainer">
                            <p className="DataValue" id="big">{enginePower ?? 0}</p>
                            <p className="DataUnit">W</p>
                        </div>

                    </div>
                </div>


                <div className="rightLiveContainer">

                    <div className="TemperatureContainer">
                        <div className="TitleDataContainer">
                            <p className="TitleData">Temperatures</p>
                        </div>



                        <div className="GraphContainer">
                           <div className="TopGraphContainer">
                               <div className="GraphContainer2">
                                   <div className="titleGraphContainer">
                                       <p className="graphTemperatureTitle">Engine</p>
                                       <div className="ValueTemperatureContainer">
                                           <p className="DataValue" id="medium">{engineTemperature ?? 0}</p>
                                           <p className="DataUnit">°C</p>
                                       </div>
                                   </div>
                                   <div className="chartContainer">
                                       <LineChart  data={engineTemperature}  width={200} height={100} marginTop={-20}/>
                                   </div>

                               </div>
                               <div className="GraphContainer2">
                                   <div className="titleGraphContainer">
                                       <p className="graphTemperatureTitle">Inverter</p>
                                       <div className="ValueTemperatureContainer">
                                           <p className="DataValue" id="medium">{inverterTemperature ?? 0}</p>
                                           <p className="DataUnit">°C</p>
                                       </div>
                                   </div>
                                   <div className="chartContainer">
                                       <LineChart data={inverterTemperature}  width={200} height={100} marginTop={-20} fixedSize={true}/>
                                   </div>

                               </div>

                           </div>
                            <div className="DownGraphContainer">
                                <div className="GraphContainer2">
                                    <div className="titleGraphContainer">
                                        <p className="graphTemperatureTitle">High voltage Battery</p>
                                        <div className="ValueTemperatureContainer">
                                            <p className="DataValue" id="medium">{temperatureBatteryHV ?? 0}</p>
                                            <p className="DataUnit">°C</p>
                                        </div>
                                    </div>
                                    <div className="chartContainer">
                                        <LineChart data={temperatureBatteryHV} width={200} height={100} marginTop={-20} fixedSize={true}/>
                                    </div>


                                </div>
                                <div className="GraphContainer2">
                                    <div className="titleGraphContainer">
                                        <p className="graphTemperatureTitle">Low voltage Battery</p>
                                        <div className="ValueTemperatureContainer">
                                            <p className="DataValue" id="medium">{temperatureBatteryLV ?? 0}</p>
                                            <p className="DataUnit">°C</p>
                                        </div>
                                    </div>
                                    <div className="chartContainer">
                                        <LineChart data={temperatureBatteryLV} width={200} height={100} marginTop={-20} fixedSize={true}/>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>



                    <div className="BatteryContainer">
                        <div className="TitleDataContainer">
                            <p className="TitleData">High Voltage Battery</p>
                        </div>
                        <div className="DataContainer">

                        </div>
                        <div className="GraphContainer">

                        </div>
                    </div>
                </div>



            </div>
        </header>
    )
}

export default GeneralDataPage;