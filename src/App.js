import logo from './logo.svg';
import './App.css';
//import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./Components/Navbar";
import GeneralDataPage from "./Pages/GeneralDataPage";
import ExternalDataPage from "./Pages/ExternalDataPage";
import HistoricDataPage from "./Pages/HistoricDataPage";
import ExportDataPage from "./Pages/ExportDataPage";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import {useEffect, useState} from "react";
import {ipcRenderer} from "electron";


function App() {

    const [currentPage, setCurrentPage] = useState('GeneralData')
    console.log("current page: "+currentPage);


    //database reception
    useEffect(() => {
        // Écoutez l'événement pour recevoir l'objet de base de données
        ipcRenderer.on('database', (event, database) => {
            // Utilisez l'objet de base de données ici
            console.log(database);
        });

        // Nettoyez l'écouteur d'événement lorsque le composant est démonté
        return () => {
            ipcRenderer.removeAllListeners('database');
        };
    }, []);








    const renderPage = () => {
        switch (currentPage) {
            case 'GeneralData':
                return <GeneralDataPage/>;
            case 'ExternalData':
                return <ExternalDataPage/>;
            case 'HistoricData':
                return <HistoricDataPage/>;
            case 'ExportData':
                return <ExportDataPage/>;
            default:
                return <GeneralDataPage/>;
        }
    };

    const navigateTo = (path) => {
        setCurrentPage(path);
    };


  return (
    <div className="App">
          <Navbar navigateTo={navigateTo}/>
         <div>{renderPage()}</div>
    </div>
  )
}
export default App;
