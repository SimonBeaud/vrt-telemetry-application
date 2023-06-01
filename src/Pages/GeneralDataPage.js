import React, {useEffect, useState} from 'react'
import {ipcRenderer} from 'electron'
import Chart from 'chart.js/auto';
import LineChart from "../Components/LineChart";


function GeneralDataPage(){

    //Live data variables
    const [pressure, setPressure] = useState(1);


    //Update live data variables
    const updatePressure = (event, ReceivePressure)=>{
        setPressure(ReceivePressure);
    }


    useEffect(()=>{
        ipcRenderer.on("update-pressure", updatePressure);

        return ()=>{
            ipcRenderer.off("update-pressure", updatePressure);
        };
    }, []);


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



    //##############################################################################

    return(
        <header className="App-header">
            <div className="PageContainer">
                <h1>General Data Page</h1>
                <h1 className="LiveData">{pressure}</h1>
                <LineChart data={pressure}/>
            </div>
        </header>
    )
}

export default GeneralDataPage;