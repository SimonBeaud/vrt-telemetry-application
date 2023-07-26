import React, {createContext, useContext, useState} from 'react';

export const SessionContext = createContext();

export const SessionProvider =({children})=>{
    const [session, setSession] = useState({ id: 0, name: 'Default Session' });

    const updateSession = (id, name) =>{
        setSession({id, name});

    };

    const clearSession = () =>{
        setSession(null);
    };

    return(
        <SessionContext.Provider value={{session, updateSession, clearSession}}>
            {children}
        </SessionContext.Provider>
    );

};

export const sessionContextInstance = {
    session: {id: 0, name: 'Default Session'},
};

