import React, { useState, useEffect } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { AgChartsReact } from 'ag-charts-react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export function DashboardDeviceTypes({ option }) {
    const numFormatter = new Intl.NumberFormat("en-US");

    const [chartOptions, setChartOptions] = useState({
        data: [],
        series: [
            {
                type: "donut",
                calloutLabelKey: "device",
                angleKey: "count",
                sectorLabelKey: "count",
                calloutLabel: {
                    enabled: false,
                },
                sectorLabel: {
                    formatter: ({ datum, sectorLabelKey }) => {
                        const value = datum[sectorLabelKey];
                        return numFormatter.format(value);
                    },
                },
                innerRadiusRatio: 0.7,
                innerLabels: [],
                tooltip: {
                    renderer: ({ datum, calloutLabelKey, title, sectorLabelKey }) => {
                        const total = chartOptions.data.reduce((sum, d) => sum + d["count"], 0);
                        const percentage = ((datum[sectorLabelKey] / total) * 100).toFixed(2);
                        return {
                            title,
                            content: `${datum[calloutLabelKey]}: ${numFormatter.format(datum[sectorLabelKey])} (${percentage}%)`,
                        };
                    },
                },
                strokeWidth: 3,
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = firebase.firestore();
                const gameSnapshot = await db.collection('games').get();
                const deviceData = {};

                for (const doc of gameSnapshot.docs) {
                    const game = doc.data();
                    const gameDate = game.date ? game.date.toDate() : null;
                    if (gameDate && gameDate >= new Date(option.start) && gameDate <= new Date(option.end)) {
                        if (Array.isArray(game.devices)) {
                            game.devices.forEach(device => {
                                if (!deviceData[device]) {
                                    deviceData[device] = 0;
                                }
                                deviceData[device]++;
                            });
                        }
                    }
                }


                const data = Object.keys(deviceData).map(key => ({
                    device: key,
                    count: deviceData[key],
                }));

                const total = data.reduce((sum, d) => sum + d["count"], 0);

                setChartOptions((prevOptions) => ({
                    ...prevOptions,
                    data,
                    series: [
                        {
                            ...prevOptions.series[0],
                            innerLabels: [
                                {
                                    text: numFormatter.format(total),
                                    fontSize: 24,
                                },
                                {
                                    text: "Total",
                                    fontSize: 16,
                                    margin: 10,
                                },
                            ],
                            tooltip: {
                                renderer: ({ datum, calloutLabelKey, title, sectorLabelKey }) => {
                                    const percentage = ((datum[sectorLabelKey] / total) * 100).toFixed(2);
                                    return {
                                        title,
                                        content: `${datum[calloutLabelKey]}: ${numFormatter.format(datum[sectorLabelKey])} (${percentage}%)`,
                                    };
                                },
                            },
                        }
                    ],
                }));
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        if (option.start && option.end) {
            fetchData();
        }
    }, [option.start, option.end]);

    return (
        <Card>
            <CardBody className='text-center'>
                <Typography>Types d'appareils utilisés dans les jeux publiés</Typography>
                <div style={{ width: '100%', height: '300px' }}>
                    <AgChartsReact options={chartOptions} />
                </div>
            </CardBody>
        </Card>
    );
}
