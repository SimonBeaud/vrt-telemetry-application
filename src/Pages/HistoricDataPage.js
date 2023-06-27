import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {getDataValuesBySessionAndDataType} from "../DataBase/Database";
import {ipcRenderer} from "electron";
import LineChartStatic from "../Components/LineChartStatic";
import ChartLine from "../Components/ChartLine";
import '../Style/HistoricLiveDataStyle.css';
import { SessionContext } from '../SessionContext';

function HistoricDataPage(){

    /*Session id management*/
    const dataTypeName = 'CarSpeed';
    const {session, updateSession} = useContext(SessionContext);
    const sessionId = session.id;


    const dataTypesNames = {
        TensionBatteryHV: 'TensionBatteryHV',
        AmperageBatteryHV: 'AmperageBatteryHV',
        TemperatureBatteryHV: 'TemperatureBatteryHV',
        EnginePower: 'EnginePower',
        EngineTemperature: 'EngineTemperature',
        EngineAngularSpeed: 'EngineAngularSpeed',
        CarSpeed: 7,
        PressureTireFL: 'PressureTireFL',
        PressureTireFR: 'PressureTireFR',
        PressureTireBL: 'PressureTireBL',
        PressureTireBR: 'PressureTireBR',
        InverterTemperature: 'InverterTemperature',
        TemperatureBatteryLV: 'TemperatureBatteryLV',
    };


    const [dataValues, setDataValues] = useState([]);

    console.log(dataValues);



    const fetchData = async () => {
        try {
           // const response = await ipcRenderer.invoke('get-values-bySession-byType', { dataTypeName, sessionId });
            const response = await ipcRenderer.invoke('get-values-bySession', {sessionId });

            if (response.success) {
                setDataValues(response.dataValues);
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
            <div className="PageContainer">
                <div className="PageHistoricContainer">
                    <div className="TitleContainerHistoric">
                        <h1>Live data history</h1>
                        <button className="ReloadButton" onClick={fetchData}>Reload Data</button>
                    </div>


                    <div className="HistoricContainer">
                        <div className="LeftContainerHistoric">
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Car speed</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Pressure tire front left</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Pressure tire front right</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Pressure tire back left</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Pressure tire back right</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Engine speed</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Engine power</p>
                                <ChartLine data={dataValues}/>
                            </div>
                        </div>
                        <div className="RightContainerHistoric">
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Temperature Engine</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Temperature Inverter</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Temperature high voltage battery</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Temperature low voltage battery</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Tension high voltage battery</p>
                                <ChartLine data={dataValues}/>
                            </div>
                            <div className="ChartHistoricContainer">
                                <p className="ChartLabel"  id="left">Amperage high voltage battery</p>
                                <ChartLine data={dataValues}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HistoricDataPage;