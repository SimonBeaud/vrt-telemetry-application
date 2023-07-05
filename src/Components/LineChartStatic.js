import React, { useEffect, useRef } from 'react';
import 'chart.js/auto';
import moment from "moment";
import Chart from "chart.js/auto";

const LineChartStatic = ({ datasets }) => {
    const chartRef3 = useRef(null);

    useEffect(() => {
        let chart3;

        const createChart = () => {
            const ctx = chartRef3.current.getContext('2d');
            const labels = datasets[0].map((dataValue) =>
                moment(dataValue.timeRecord).format('HH:mm:ss')
            );

            const chartDatasets = datasets.map((dataset, index) => ({
                label: `Jeu de données ${index + 1}`,
                data: dataset.map((dataValue) => dataValue.DataRecord),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 3,
            }));

            if (!chart3) {
                chart3 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: chartDatasets,
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
                chart3.data.labels = labels;
                chart3.data.datasets = chartDatasets;
                chart3.update();
            }
        };

        createChart();

        // Détruire le chart lors du démontage du composant
        return () => {
            if (chart3) {
                chart3.destroy();
            }
        };
    }, [datasets]);

    return (
        <div>
            <canvas ref={chartRef3} width={600} height={350} />
        </div>
    );
};

export default LineChartStatic;
