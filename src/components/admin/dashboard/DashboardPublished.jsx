import React, { useState, useEffect } from 'react';

import { Card, CardBody, Typography } from "@material-tailwind/react";

import { AgChartsReact } from 'ag-charts-react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';



export function DashboardPublished({ option }) {
    const [chartOptions, setChartOptions] = useState({
        data: [],
        series: [
            { type: 'line', xKey: 'month', yKey: 'games', title: 'Formations' },
        ],
        axes: [
            { type: 'category', position: 'bottom' },
            { type: 'number', position: 'left' },
        ],
        legend: { position: 'bottom' },
        tooltip: { enabled: true },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = firebase.firestore();
                const gamesSnapshot = await db.collection('games').get();

                const monthlyGameData = {};

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

                for (const doc of gamesSnapshot.docs) {
                    const gameData = doc.data();
                    if (gameData.date) {
                        addToMonthlyData(gameData.date, monthlyGameData);
                    }
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
                    if (!monthlyGameData[month]) {
                        monthlyGameData[month] = 0;
                    }
                });

                const data = months.map((month) => ({
                    month,
                    games: monthlyGameData[month],
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
                <Typography>Nombre de formations publiées par mois</Typography>
                <div style={{ width: '100%', height: '300px' }}>
                    <AgChartsReact options={chartOptions} />
                </div>
            </CardBody>
        </Card>
    );
}
