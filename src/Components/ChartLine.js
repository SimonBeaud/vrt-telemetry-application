import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from "moment";
import 'chartjs-plugin-zoom';

const ChartLine = ({ data }) => {

    let state;

    state = {
        canvasWidth: 600,
        canvasHeight: 350
    }


    const chartRef2 = useRef(null);

    useEffect(() => {
        let chart2;
        //let handleMouseMove;
        //let handleMouseWheel;

        const createChart = () => {
            // Récupérer le contexte du canvas
            const ctx = chartRef2.current.getContext('2d');

            // Récupérer les données et les labels pour le chart
            const labels = data.map((dataValue) =>
                //moment(dataValue.timeRecord).format('DD.MM.YYYY HH:mm:ss')
                moment(dataValue.timeRecord).format('HH:mm:ss')
            );
            const values = data.map((dataValue) => dataValue.DataRecord);

            // Définir la plage visible initiale (30 secondes)
            //const startIndex = Math.max(0, labels.length - 30);

            const visibleLabels = labels;
            const visibleValues = values;

            // Créer le chart si le canvas n'a pas encore de chart associé
            if (!chart2) {
                chart2 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: visibleLabels,
                        datasets: [
                            {
                                label: 'Valeurs',
                                data: visibleValues,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 3,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            y: {
                                min: 0,
                                max: 100,
                            },
                        },

                        plugins: {
                            zoom: {
                                pan: {
                                    enabled: true,
                                    mode: 'x',
                                },
                                zoom: {
                                    wheel: {
                                        enabled: true,
                                    },
                                    pinch: {
                                        enabled: true,
                                    },
                                    mode: 'x',
                                },
                            },
                        },
                    },
                });

            } else {
                // Mettre à jour le chart existant avec les nouvelles données
                chart2.data.labels = visibleLabels;
                chart2.data.datasets[0].data = visibleValues;
                chart2.update();
            }
        };

        createChart();

        // Détruire le chart lors du démontage du composant
        return () => {
            if (chart2) {
                chart2.destroy();

            }
        };
    }, [data]);

    return (
        <div >
            <canvas ref={chartRef2} width={state.canvasWidth} height={state.canvasHeight} />
        </div>
    );
};

export default ChartLine;
