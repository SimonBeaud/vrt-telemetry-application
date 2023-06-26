import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from "moment";

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
            const visibleLabels = labels.slice(startIndex);
            const visibleValues = values.slice(startIndex);

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
                        animation: false, // Désactiver l'animation pour améliorer les performances
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Temps',
                                },
                                zoom: {
                                    enabled: true, // Activer le zoom sur l'axe x
                                    mode: 'x', // Mode de zoom horizontal
                                    sensitivity: 3,
                                },
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Valeurs',
                                },
                            },
                        },
                        plugins: {
                            annotation: {
                                annotations: [],
                            },
                        },
                        pan: {
                            enabled: true,
                            mode: 'x',
                        },
                    },
                });

                // Écouter les événements de la souris pour la navigation et le zoom
                handleMouseMove = (e) => {
                    if (
                        chart2.chartArea &&
                        chart2.chartArea.left <= e.offsetX &&
                        e.offsetX <= chart2.chartArea.right
                    ) {
                        chart2.pan({ enabled: true, mode: 'x' });
                    } else {
                        chart2.pan({ enabled: false });
                    }
                };

                handleMouseWheel = (e) => {
                    const zoomOptions = {
                        animation: {
                            duration: 3,
                        },
                    };

                    if (e.deltaY < 0) {
                        chart2.options.scales.x.zoom.sensitivity = 0.5;
                        chart2.options.scales.y.zoom.sensitivity = 0.5;
                        chart2.update();
                    } else {
                        chart2.options.scales.x.zoom.sensitivity = 3;
                        chart2.options.scales.y.zoom.sensitivity = 3;
                        chart2.update();
                    }
                };

                chartRef2.current.addEventListener('mousemove', handleMouseMove);
                chartRef2.current.addEventListener('wheel', handleMouseWheel);
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
