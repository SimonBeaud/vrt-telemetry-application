import React from 'react'
import {useNavigate} from "react-router-dom";

function ProjectNavigationPage(){
    let navigate = useNavigate();

    const routeChange = () =>{
        let path = '/ProjectNavigationPage';
        navigate(path);
    }

    return(
        <header className="App-header">
            <div>
                <h1> Project Navigation Page</h1>
            </div>
        </header>
    )
}

export default ProjectNavigationPage;