import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-streaming';
import 'moment';
import 'chartjs-adapter-moment';

function LineChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartInstance.current) {
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [
                        {
                            label: 'Data',
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
                            max: 100,
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
                            display: true,
                            text: 'Data Evolution',
                            color: 'white',
                        },
                    },
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 40,
                            right: 20,
                        },
                    },
                },
            });
        }
    }, [data]);

    return <canvas ref={chartRef} style={{ height: '400px' }}></canvas>;
}

export default LineChart;


