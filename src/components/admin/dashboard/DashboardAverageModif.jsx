import React, { useState, useEffect } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { AgChartsReact } from 'ag-charts-react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

export function DashboardAverageModif({ option }) {
    const [chartOptions, setChartOptions] = useState({
        data: [],
        series: [
            {
                type: 'bar',
                xKey: 'month',
                yKey: 'projects',
                label: {
                    formatter: ({ value }) => String(value),
                },
                tooltip: {
                    renderer: ({ datum, xKey, yKey }) => {
                        return { title: String(datum[xKey]), content: String(datum[yKey]) };
                    },
                },
            },
            {
                type: 'bar',
                xKey: 'month',
                yKey: 'actualités',
                label: {
                    formatter: ({ value }) => String(value),
                },
                tooltip: {
                    renderer: ({ datum, xKey, yKey }) => {
                        return { title: String(datum[xKey]), content: String(datum[yKey]) };
                    },
                },
            },
        ],
        axes: [
            {
                type: 'category',
                position: 'bottom',
                label: {
                    formatter: ({ value }) => String(value),
                },
            },
            {
                type: 'number',
                position: 'left',
                label: {
                    formatter: ({ value }) => String(value),
                },
            },
        ],
        legend: { position: 'bottom' },
        tooltip: { enabled: true },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = firebase.firestore();
                const newsSnapshot = await db.collection('news').get();
                const projectSnapshot = await db.collection('projects').get();

                const monthlyProjectData = {};
                const monthlyNewsData = {};

                const addToMonthlyData = (timestamp, dataObj) => {
                    const milliseconds = timestamp.toMillis();
                    const date = new Date(milliseconds);
                    if (!isNaN(date.getTime())) {
                        const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
                        if (!dataObj[month]) {
                            dataObj[month] = 0;
                        }
                        dataObj[month]++;
                    }
                };

                for (const doc of newsSnapshot.docs) {
                    const historySnapshot = await doc.ref.collection("history").where("type", "==", "update").get();
                    historySnapshot.forEach((modificationDoc) => {
                        const modificationData = modificationDoc.data();
                        if (modificationData.date) {
                            addToMonthlyData(modificationData.date, monthlyNewsData);
                        }
                    });
                }

                for (const doc of projectSnapshot.docs) {
                    const historySnapshot = await doc.ref.collection("history").where("type", "==", "update").get();
                    historySnapshot.forEach((modificationDoc) => {
                        const modificationData = modificationDoc.data();
                        if (modificationData.date) {
                            addToMonthlyData(modificationData.date, monthlyProjectData);
                        }
                    });
                }

                const startDate = new Date(option.start);
                const endDate = new Date(option.end);
                endDate.setMonth(endDate.getMonth() + 1);

                const months = [];
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    const month = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                    months.push(month);
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }

                months.forEach((month) => {
                    if (!monthlyProjectData[month]) {
                        monthlyProjectData[month] = 0;
                    }
                    if (!monthlyNewsData[month]) {
                        monthlyNewsData[month] = 0;
                    }
                });

                const data = months.map((month) => ({
                    month,
                    projects: monthlyProjectData[month],
                    actualités: monthlyNewsData[month],
                }));

                data.sort((a, b) => {
                    const [aMonth, aYear] = a.month.split('/');
                    const [bMonth, bYear] = b.month.split('/');
                    return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
                });

                setChartOptions((prevOptions) => ({
                    ...prevOptions,
                    data: data,
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
                <Typography>Nombre de modifications de projets/actualités par mois</Typography>
                <div style={{ width: '100%', height: '300px' }}>
                    <AgChartsReact options={chartOptions} />
                </div>
            </CardBody>
        </Card>
    );
}
