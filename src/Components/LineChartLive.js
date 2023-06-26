import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-streaming';
import 'moment';
import 'chartjs-adapter-moment';

function LineChartLive({ data, width, height, marginTop, marginBottom, marginLeft, marginRight , fixedSize }) {

    let state;

    state = {
        canvasWidth: 400,
        canvasHeight: 150
    }




    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    console.log("Margin: "+marginTop);

    useEffect(() => {
        if (!chartInstance.current) {
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',

                data: {
                    datasets: [
                        {
                            label: 'Temperature',
                            data: [],
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
                            type: 'realtime',
                            realtime: {
                                refresh: 1000,
                                delay: 2000,
                                pause: false,
                                ttl: undefined,
                                frameRate: 30,
                                onRefresh: (chart) => {
                                    if (data !== null) {
                                        const timestamp = Date.now();
                                        const lastDataPoint = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
                                        if (lastDataPoint && lastDataPoint.x < timestamp) {
                                            chart.data.datasets[0].data.push({ x: timestamp, y: lastDataPoint.y });
                                        }
                                        chart.update({
                                            preservation: true,
                                        });
                                    }
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
                            bottom: marginBottom,
                            left: marginLeft,
                            right: marginRight,
                        },

                    },
                },
            });

        }
    }, [data]);

    //return <canvas ref={chartRef} width="200px" ></canvas>;
    return <canvas ref={chartRef} width={state.canvasWidth} height={state.canvasHeight}/>
}

export default LineChartLive;


