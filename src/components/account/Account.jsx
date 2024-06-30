import { useEffect, useState } from "react";

import { Avatar, Tabs, TabsHeader, TabsBody, Tab, TabPanel, Typography, Spinner } from "@material-tailwind/react";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { AccountMyGames } from './AccountMyGames';
import { AccountInfos } from "./AccountInfos";
import { AccountPurchases } from './AccountPurchases'

import blank from '../../assets/blank-profile-picture.webp';



export function Account() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [profilePictureURL, setProfilePictureURL] = useState("");

    const data = [
        {
            label: "Mes informations",
            value: "infos",
            component: <AccountInfos />,
        },
        {
            label: "Mes achats",
            value: "purchases",
            component: <AccountPurchases />,
        },
    ];

    const dataSeller = [
        {
            label: "Mes informations",
            value: "infos",
            component: <AccountInfos />,
        },
        {
            label: "Mes formations",
            value: "games",
            component: <AccountMyGames />,
        },
        {
            label: "Mes achats",
            value: "purchases",
            component: <AccountPurchases />,
        },
    ];

    const fetchProfilePictureURL = async (picturePath) => {
        try {
            const storageRef = firebase.storage().ref();
            const url = await storageRef.child(picturePath).getDownloadURL();
            setProfilePictureURL(url);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile picture URL:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const user = firebase.auth().currentUser;
            if (user) {
                try {
                    const db = firebase.firestore();
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (userDoc.exists) {
                        const data = userDoc.data();
                        setUserData(data);
                        if (data.profilePicture) {
                            fetchProfilePictureURL(`img/userPicture/${data.profilePicture}`);
                        } else {
                            setProfilePictureURL(blank);
                            setLoading(false);
                        }
                    } else {
                        console.error('User not found');
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setLoading(false);
                }
            } else {
                console.error('No user is currently signed in');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            {loading ? (
                <div className='flex flex-col items-center justify-center min-h-screen'>
                    <Spinner className="h-20 w-20" color="orange" />
                </div>
            ) : (
                <div className="p-5">
                    <div className="flex gap-5 items-center p-5">
                        <Avatar
                            variant="circular"
                            className="h-48 w-48"
                            alt="Profile Picture"
                            src={profilePictureURL || blank}
                        />
                        <div className="">
                            <Typography variant='h5'>Bonjour {userData.username}</Typography>
                            <hr className="my-1" />
                            <div className="flex gap-10">
                                <Typography>Statut membre : {userData.isSeller ? "Compte vendeur" : "Compte acheteur uniquement"}</Typography>
                            </div>
                        </div>
                    </div>
                    <hr className="my-5" />
                    <div>
                        {userData.isSeller ? (
                            <Tabs value="infos">
                                <TabsHeader>
                                    {dataSeller.map(({ label, value }) => (
                                        <Tab key={value} value={value}>
                                            {label}
                                        </Tab>
                                    ))}
                                </TabsHeader>
                                <TabsBody>
                                    {dataSeller.map(({ value, component }) => (
                                        <TabPanel key={value} value={value}>
                                            {component}
                                        </TabPanel>
                                    ))}
                                </TabsBody>
                            </Tabs>
                        ) : (
                            <Tabs value="infos">
                                <TabsHeader>
                                    {data.map(({ label, value }) => (
                                        <Tab key={value} value={value}>
                                            {label}
                                        </Tab>
                                    ))}
                                </TabsHeader>
                                <TabsBody>
                                    {data.map(({ value, component }) => (
                                        <TabPanel key={value} value={value}>
                                            {component}
                                        </TabPanel>
                                    ))}
                                </TabsBody>
                            </Tabs>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
