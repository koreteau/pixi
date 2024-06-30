import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Avatar, Button, CardHeader, CardBody, Typography, Spinner } from "@material-tailwind/react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { DashboardPublished } from './dashboard/DashboardPublished';



const TABLE_HEAD = ['Title', 'Description', 'Status', 'Author'];



export function AdminHome() {
    const [userData, setUserData] = useState(null);
    const [profilePictureURL, setProfilePictureURL] = useState("");
    const [approvalGames, setApprovalGames] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProfilePictureURL = async (picturePath) => {
        try {
            const storageRef = firebase.storage().ref();
            const url = await storageRef.child(picturePath).getDownloadURL();
            setProfilePictureURL(url);
        } catch (error) {
            console.error('Error fetching profile picture URL:', error);
        }
    };

    const fetchApprovalGames = async () => {
        try {
            const db = firebase.firestore();
            const gamesRef = db.collection('games');
            const snapshot = await gamesRef.where('status', '==', 'approval').limit(5).get();
            const gamesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApprovalGames(gamesList);

            const userSnapshot = await db.collection('users').get();
            const userData = userSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAuthors(userData);
        } catch (error) {
            console.error('Error fetching approval games:', error);
        } finally {
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
                        }
                    } else {
                        console.error('User not found');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                console.error('No user is currently signed in');
            }
        };

        fetchUserData();
        fetchApprovalGames();
    }, []);

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const defaultStartDate = formatDate(oneYearAgo);
    const defaultEndDate = formatDate(today);

    const defaultDate = { start: defaultStartDate, end: defaultEndDate };

    return (
        <>
            {userData ? (
                <div className="p-5">
                    <div className="flex gap-5 items-center p-5">
                        <Avatar
                            variant="circular"
                            className="h-48 w-48"
                            alt="Profile Picture"
                            src={profilePictureURL || ""}
                        />
                        <div className="">
                            <Typography variant='h5'>Bonjour {userData.fullName}</Typography>
                            <hr className="my-1" />
                            <div className="flex gap-10">
                                <Typography>Statut : {userData.isActive ? "Compte actif" : "Compte désactivé"}</Typography>
                                <Typography>Statut utilisateur : {userData.isAdmin ? "Compte administrateur" : "Compte classique"}</Typography>
                                <Typography>Statut membre : {userData.isSeller ? "Compte vendeur" : "Compte acheteur uniquement"}</Typography>
                            </div>
                        </div>
                    </div>
                    <hr className="my-5" />
                    <div>
                        <Typography variant='h6'>Activité récente :</Typography>
                        <div className="grid grid-cols-1 gap-3 custom-sm custom-md custom-lg custom-xlg">
                            <DashboardPublished option={defaultDate} />
                        </div>
                    </div>
                    <hr className="my-5" />
                    <div>
                        <div className="h-full w-full">
                            <CardHeader floated={false} shadow={false} className="rounded-none">
                                <div className="mb-8 flex items-center justify-between gap-8">
                                    <div>
                                        <Typography variant='h6' className="mt-1 font-normal">
                                        Formations en attente d'approbation :
                                        </Typography>
                                    </div>
                                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                        <Link to='/admin/register/games'>
                                            <Button className="flex items-center gap-3 bg-pixi shadow-none hover:shadow-pixi" size="sm">
                                                Voir toutes les demandes
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="overflow-scroll px-0">
                                {loading ? (
                                    <table className="mt-4 w-full min-w-max table-auto text-left">
                                        <thead>
                                            <tr>
                                                {TABLE_HEAD.map((title) => (
                                                    <th key={title} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal leading-none opacity-70"
                                                        >
                                                            {title}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {TABLE_HEAD.map((title, index) => (
                                                <td key={index} className='p-4'>
                                                    <div className="flex items-center gap-3">
                                                        <Typography as="div" variant="paragraph" className="mb-2 h-2 w-60 rounded-full bg-gray-300">
                                                            &nbsp;
                                                        </Typography>
                                                    </div>
                                                </td>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="mt-4 w-full min-w-max table-auto text-left">
                                        <thead>
                                            <tr>
                                                {TABLE_HEAD.map((title) => (
                                                    <th key={title} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal leading-none opacity-70"
                                                        >
                                                            {title}
                                                        </Typography>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {approvalGames.map(({ id, title, desc, status, author }, index) => {
                                                const isLast = index === approvalGames.length - 1;
                                                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
                                                const authorData = authors.find(user => user.id === author);
                                                return (
                                                    <tr key={id}>
                                                        <td className={classes}>
                                                            <Link to={`/admin/register/games/${id}`}>
                                                                <div className="flex items-center gap-3">
                                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                                        {title}
                                                                    </Typography>
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td className={classes}>
                                                            <div className="flex flex-col">
                                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                                    {desc}
                                                                </Typography>
                                                            </div>
                                                        </td>
                                                        <td className={classes}>
                                                            <div className="flex flex-col">
                                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                                    {status}
                                                                </Typography>
                                                            </div>
                                                        </td>
                                                        <td className={classes}>
                                                            <div className="flex flex-col">
                                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                                    {authorData ? `${authorData.username}` : ""}
                                                                </Typography>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </CardBody>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center min-h-screen'>
                    <Spinner className="h-20 w-20" color="amber" />
                </div>
            )}
        </>
    );
}
