import React, { useEffect, useState } from "react";

import { Spinner } from "@material-tailwind/react";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';



export function Account() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userUID, setUserUID] = useState(null);

    const fetchUserUID = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserUID(user.uid);
        } else {
            console.error('No user is currently signed in');
            setLoading(false);
        }
    };

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

    return (
        <div>
            {loading ? (
                <div className='flex flex-col items-center justify-center min-h-screen'>
                    <Spinner className="h-20 w-20" />
                </div>
            ) : (
                <div>Bonjour {user.username}</div>
            )}
        </div>
    );
}
