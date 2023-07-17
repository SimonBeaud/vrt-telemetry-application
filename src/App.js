import logo from './logo.svg';
import './App.css';
//import {BrowserRouter, Route, Routes} from "react-router-dom";
//import Navbar from "./Components/Navbar";
import LiveDataPage from "./Pages/LiveDataPage";
import ExternalDataPage from "./Pages/ExternalDataPage";
import HistoricDataPage from "./Pages/HistoricDataPage";
import ExportDataPage from "./Pages/ExportDataPage";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import {createContext, useEffect, useState} from "react";
import {ipcRenderer} from "electron";
import ProjectNavigationPage from "./Pages/ProjectNavigationPage";
import Navbar from "./Components/Navbar";
import {SessionProvider} from "./SessionContext";
import {ChartProvider} from "./ChartContext";

export const AppContext = createContext();


function App() {

    const [currentPage, setCurrentPage] = useState('ProjectNavigation')
    console.log("current page: "+currentPage);


    /*
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
*/

    const navigateTo = (path) => {
        setCurrentPage(path);
    };


    const renderPage = () => {
        switch (currentPage) {
            case 'GeneralData':
                return <ChartProvider>  <LiveDataPage/> </ChartProvider>;
            case 'ExternalData':
                return <ExternalDataPage/>;
            case 'HistoricData':
                return <HistoricDataPage/>;
            case 'ExportData':
                return <ExportDataPage/>;
            case 'ProjectNavigation':
                return <ProjectNavigationPage/>;

        }
    };


  return (
    <div className="App">
        <SessionProvider>
            <AppContext.Provider value={{currentPage, navigateTo}}>
                <div className="container">
                    {currentPage!== 'ProjectNavigation' && <Navbar navigateTo={navigateTo}/>}
                </div>
                <div>{renderPage()}</div>
            </AppContext.Provider>
        </SessionProvider>
    </div>
  )
}
export default App;
