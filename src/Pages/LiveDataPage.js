import React, {useEffect, useState} from 'react'
import {ipcRenderer} from 'electron'
import '../Style/LiveDataStyle.css';
import LineChartLive from "../Components/LineChartLive";

function LiveDataPage(){

    const [liveData, setLiveData] = useState(null);
    const [tensionBatteryHV, setTensionBatteryHV] = useState(1);
    const [amperageBatteryHV, setAmperageBatteryHV] = useState(1);
    const [temperatureBatteryHV, setTemperatureBatteryHV] = useState(1);
    const [enginePower, setEnginePower] = useState(null);
    const [engineTemperature, setEngineTemperature] = useState(1);
    const [engineAngularSpeed, setEngineAngularSpeed] = useState(null);
    const [carSpeed, setCarSpeed] = useState(null);
    const [pressureTireFL, setPressureTireFL] = useState(null);
    const [pressureTireFR, setPressureTireFR] = useState(null);
    const [pressureTireBL, setPressureTireBL] = useState(null);
    const [pressureTireBR, setPressureTireBR] = useState(null);
    const [inverterTemperature, setInverterTemperature] = useState(1);
    const [temperatureBatteryLV, setTemperatureBatteryLV] = useState(1);



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


    //##############################################################################

    return(
        <header className="App-header">
            <div className="PageContainer">
                <div className="leftLiveContainer">
                    <div className="SpeedContainer">
                        <div className="TitleDataContainer">
                            <p className="TitleData">Speed</p>
                        </div>
                        <div className="SpeedDataContainer">
                            <div className="IconContainer">
                                <img className="IconSpeed" src={require('../Ressources/speedIcon.png')} alt="VRT Logo" />
                            </div>
                            <div className="DataContainer">
                                <p className="DataValue" id="big">{carSpeed ?? 0}</p>
                                <p className="DataUnit">kmh/h</p>
                            </div>
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
                        <div>
                            <p className="EnginDataTitle">Speed</p>
                            <div className="EnginDataContainer">
                                <p className="DataValue" id="big">{engineAngularSpeed ?? 0}</p>
                                <p className="DataUnit">rad/s</p>
                            </div>
                        </div>
                        <div>
                            <p className="EnginDataTitle">Electric power</p>
                            <div className="EnginDataContainer">
                                <p className="DataValue" id="big">{enginePower ?? 0}</p>
                                <p className="DataUnit">W</p>
                            </div>
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
                                        <LineChartLive data={engineTemperature} yMin={0} yMax={100} width={200} height={100} marginTop={-20}/>
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
                                        <LineChartLive data={inverterTemperature} yMin={0} yMax={100} width={200} height={100} marginTop={-20} fixedSize={true}/>
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
                                        <LineChartLive data={temperatureBatteryHV} yMin={0} yMax={100} width={200} height={100} marginTop={-20} fixedSize={true}/>
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
                                        <LineChartLive data={temperatureBatteryLV} yMin={0} yMax={100} width={200} height={100} marginTop={-20} fixedSize={true}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="BatteryContainer">
                        <div className="TitleDataContainer">
                            <p className="TitleData">High Voltage Battery</p>
                        </div>
                        <div className="GraphContainer">
                            <div className="TopGraphContainer">
                                <div className="GraphContainer2">
                                    <div className="titleGraphContainer">
                                        <p className="graphTemperatureTitle">Tension battery</p>
                                        <div className="ValueTemperatureContainer">
                                            <p className="DataValue" id="medium">{tensionBatteryHV ?? 0}</p>
                                            <p className="DataUnit">V</p>
                                        </div>
                                    </div>
                                    <div className="chartContainer">
                                        <LineChartLive data={tensionBatteryHV} yMin={0} yMax={600} width={200} height={100} marginTop={-20} fixedSize={true}/>
                                    </div>
                                </div>
                                <div className="GraphContainer2">
                                    <div className="titleGraphContainer">
                                        <p className="graphTemperatureTitle">Amperage battery</p>
                                        <div className="ValueTemperatureContainer">
                                            <p className="DataValue" id="medium">{amperageBatteryHV ?? 0}</p>
                                            <p className="DataUnit">A</p>
                                        </div>
                                    </div>
                                    <div className="chartContainer">
                                        <LineChartLive data={amperageBatteryHV} yMin={0} yMax={200} width={200} height={100} marginTop={-20} fixedSize={true}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default LiveDataPage;