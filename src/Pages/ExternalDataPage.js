import React from 'react'
const { ipcRenderer, remote } = window.require('electron');



//GC
function ExternalDataPage() {


    const handleFileSelection = () => {
        ipcRenderer.send('openFileSelection');
    };

    return (
        <header className="App-header">
            <div className="PageContainer">
                <h1>External Data Page</h1>
                <button className="ReloadButton" onClick={handleFileSelection}>Sélectionner un fichier CSV</button>
            </div>
        </header>
    );
}


export default ExternalDataPage;