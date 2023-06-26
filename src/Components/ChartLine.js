import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from "moment";
import 'chartjs-plugin-zoom';

const ChartLine = ({ data }) => {
    const chartRef2 = useRef(null);

    useEffect(() => {
        let chart2;
        let handleMouseMove;
        let handleMouseWheel;

        const createChart = () => {
            // Récupérer le contexte du canvas
            const ctx = chartRef2.current.getContext('2d');

            // Récupérer les données et les labels pour le chart
            const labels = data.map((dataValue) =>
                moment(dataValue.timeRecord).format('DD.MM.YYYY HH:mm:ss')
            );
            const values = data.map((dataValue) => dataValue.DataRecord);

            // Définir la plage visible initiale (30 secondes)
            const startIndex = Math.max(0, labels.length - 30);

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
                                borderColor: 'blue',
                                backgroundColor: 'transparent',
                            },
                        ],
                    },
                    options: {
                        // ...

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
        <div style={{ width: '100%', height: '500px' }}>
            <canvas ref={chartRef2} />
        </div>
    );
};

export default ChartLine;
