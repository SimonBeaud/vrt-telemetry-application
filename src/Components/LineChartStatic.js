import React, { useEffect, useRef } from 'react';
import 'chart.js/auto';
import moment from "moment";
import Chart from "chart.js/auto";
import randomColor from "randomcolor";
import 'chartjs-plugin-zoom';


const LineChartStatic = ({ datasets, datasetNames, yMin, yMax, width, height }) => {
    const chartRef3 = useRef(null);

    useEffect(() => {
        let chart3;

        const createChart = () => {
            const ctx = chartRef3.current.getContext('2d');
            const labels = datasets[0].map((dataValue) =>
                moment(dataValue.timeRecord).format('HH:mm:ss')
            );


            const chartDatasets = datasets.map((dataset, index) => ({
                label: datasetNames[index],
                data: dataset.map((dataValue) => dataValue.DataRecord),
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: randomColor({
                    luminosity: 'light',
                    hue: 'random',
                    format: 'rgba',
                    alpha: 1,
                    count: datasets.length,
                    seed: Math.floor(Math.random() * 1000),
                }),
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
                            x: {
                                ticks: {
                                    color: 'white',
                                },
                            },
                            y: {
                                min: yMin,
                                max: yMax,
                                ticks: {
                                    color: 'white',
                                },
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
                chart3.data.labels = labels;
                chart3.data.datasets = chartDatasets;
                chart3.update();
            }
        };

        createChart();

        return () => {
            if (chart3) {
                chart3.destroy();
            }
        };
    }, [datasets,datasetNames, yMin, yMax]);

    return (
        <div>
            <canvas ref={chartRef3} width={width} height={height} />
        </div>
    );
};
export default LineChartStatic;
