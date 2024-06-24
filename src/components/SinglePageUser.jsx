import React, { useState, useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';

import { Card, Button, Typography, CardHeader, CardBody, Input, Timeline, TimelineItem, TimelineConnector, TimelineIcon, TimelineHeader, Spinner, Switch } from '@material-tailwind/react';
import { ArrowLeftIcon, TrashIcon, ArrowPathIcon, PlusIcon, ArrowDownTrayIcon, UserIcon } from '@heroicons/react/24/outline';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';



export function UserPage() {
    const { username } = useParams();

    /*
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (userUID) {
                    const db = firebase.firestore();
                    const userDoc = await db.collection('users').doc(userUID).get();
                    if (userDoc.exists) {
                        setUser(userDoc.data());
                    } else {
                        console.error('User not found');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!userUID) {
            fetchUserUID();
        } else {
            fetchUserData();
        }
    }, [userUID]);
    */


    return(
        <>Bonjour {username}</>
    )
}