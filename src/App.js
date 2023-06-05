import logo from './logo.svg';
import './App.css';
//import {BrowserRouter, Route, Routes} from "react-router-dom";
//import Navbar from "./Components/Navbar";
import GeneralDataPage from "./Pages/GeneralDataPage";
import ExternalDataPage from "./Pages/ExternalDataPage";
import HistoricDataPage from "./Pages/HistoricDataPage";
import ExportDataPage from "./Pages/ExportDataPage";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import {createContext, useEffect, useState} from "react";
import {ipcRenderer} from "electron";
import ProjectNavigationPage from "./Pages/ProjectNavigationPage";
import Navbar from "./Components/Navbar";

export const AppContext = createContext();


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


    const navigateTo = (path) => {
        setCurrentPage(path);
    };






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
            case 'ProjectNavigation':
                return <ProjectNavigationPage/>;
            default:
                return <ProjectNavigationPage/>;
        }
    };




  return (
    <div className="App">
        <AppContext.Provider value={{currentPage, navigateTo}}>
            {currentPage!== 'ProjectNavigation' && <Navbar navigateTo={navigateTo}/>}
            <div>{renderPage()}</div>
        </AppContext.Provider>
    </div>
  )
}
export default App;
