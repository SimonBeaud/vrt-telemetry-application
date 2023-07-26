import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-streaming';
import 'moment';
import 'chartjs-adapter-moment';

function LineChartLive({ data, width, height, yMin, yMax, marginTop, marginBottom, marginLeft, marginRight , fixedSize }) {

    let state;

    state = {
        canvasWidth: 400,
        canvasHeight: 150
    }

    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);

    console.log("Margin: "+marginTop);

    useEffect(() => {
        if (chartContainerRef.current) {
            if (chartInstanceRef.current) {
                const timePoint = Date.now();
                const dataPoint = { x: timePoint, y: data };
                chartInstanceRef.current.data.datasets[0].data.push(dataPoint);
                chartInstanceRef.current.update();
            } else {
                const ctx = chartContainerRef.current.getContext('2d');
                const newChartInstance = new Chart(ctx, {
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
                            min: yMin,
                            max: yMax,
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

                chartInstanceRef.current = newChartInstance;
            }
        }
    }, [data]);
    return <canvas ref={chartContainerRef} width={state.canvasWidth} height={state.canvasHeight}/>
}

export default LineChartLive;


