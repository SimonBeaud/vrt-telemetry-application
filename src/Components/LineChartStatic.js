import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';
import 'chartjs-adapter-moment';
import 'moment/locale/fr';
import {months} from "moment";
import {min} from "moment";
import moment from "moment";



function LineChartStatic({ data }) {
    const state = {
        canvasWidth: 800,
        canvasHeight: 300,
    };

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const labels = data.map((dataItem) => moment(dataItem.timeRecord).toDate());

    useEffect(() => {
        if (!chartInstance.current) {
            const ctx = chartRef.current.getContext('2d');

            const minTime = moment(labels[0]);
            const maxTime = moment(labels[data.length - 1]);

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data.map((dataItem) => dataItem.value),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 3,
                            pointRadius: 0,
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM DD',
                                },
                            },
                            min: minTime,
                            max: maxTime,
                            ticks: {
                                source: 'auto',
                            },
                            adapters: {
                                date: {
                                    minUnit: 'day',
                                },
                            },
                        },
                        y: {
                            min: 0,
                            max: 50,
                            ticks: {
                                stepSize: 10,
                                fontColor: 'white',
                            },
                            beginAtZero: false,
                            position: 'left',
                            grid: {
                                drawBorder: false,
                                color: 'rgba(255, 255, 255, 0.5)',
                                lineWidth: 1,
                                display: true,
                            },
                        },
                    },
                    plugins: {
                        title: {
                            display: false,
                            text: 'Data Evolution',
                            color: 'white',
                        },
                    },
                    layout: {
                        padding: {
                            top: -60,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        },
                    },
                },
            });
        }
    }, [data]);

    return <canvas ref={chartRef} width={state.canvasWidth} height={state.canvasHeight} />;
}


export default LineChartStatic;
