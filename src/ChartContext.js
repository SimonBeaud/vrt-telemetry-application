// ChartContext.js
import React, { createContext, useContext, useRef } from 'react';

const ChartContext = createContext(null);

export const ChartProvider = ({ children }) => {
    const chartInstancesRef = useRef([]);

    return (
        <ChartContext.Provider value={chartInstancesRef}>
            {children}
        </ChartContext.Provider>
    );
};

export const useChartInstances = () => useContext(ChartContext);
