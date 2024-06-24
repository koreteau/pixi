import React, { useState, useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';

import { Card, Button, Typography, CardHeader, CardBody, Input, Timeline, TimelineItem, TimelineConnector, TimelineIcon, TimelineHeader, Spinner, Switch } from '@material-tailwind/react';
import { ArrowLeftIcon, TrashIcon, ArrowPathIcon, PlusIcon, ArrowDownTrayIcon, UserIcon } from '@heroicons/react/24/outline';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';



export function UserPage() {
    const { id } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedLastName, setEditedLastName] = useState('');
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedActive, setEditedActive] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);
    const [activityItems, setActivityItems] = useState([]);
    const [userIUD, setUserIUD] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const firestore = firebase.firestore();
        const fetchData = async () => {
            try {
                const userDoc = await firestore.collection('users').doc(id).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setSelectedUser(userData);
                    setEditedLastName(userData.lastName);
                    setEditedFirstName(userData.firstName);
                    setEditedActive(userData.active);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const firestore = firebase.firestore();
        const fetchHistory = async () => {
            try {
                const historySnapshot = await firestore.collection('users').doc(id).collection('history').orderBy('date', 'desc').get();
                const historyData = historySnapshot.docs.map(doc => doc.data());
                setHistoryItems(historyData);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };
        fetchHistory();

        const fetchActivity = async () => {
            try {
                const activitySnapshot = await firestore.collection('users').doc(id).collection('activity').get();
                const activityPromises = activitySnapshot.docs.map(async doc => {
                    const activityData = doc.data();
                    const activityRefPath = activityData.doc;
                    if (activityRefPath) {
                        const activityDoc = await firestore.doc(activityRefPath).get();
                        const activityDetails = activityDoc.data();
                        const pathSegments = activityRefPath.split('/');
                        const docType = pathSegments[0];
                        const docId = pathSegments[1];
                        const docSnapshot = await firestore.collection(docType).doc(docId).get();
                        const docNameData = docSnapshot.data().title;
                        const docLinkData = docType + '/' + docId
                        return { ...activityData, details: activityDetails, docType, docName: docNameData, link: docLinkData };
                    }
                    return activityData;
                });
                const activityData = await Promise.all(activityPromises);
                activityData.sort((a, b) => {
                    const dateA = a.details?.date?.toDate() || new Date(0);
                    const dateB = b.details?.date?.toDate() || new Date(0);
                    return dateB - dateA;
                });
                setActivityItems(activityData);
            } catch (error) {
                console.log('Error fetching activity:', error);
            }
        };
        fetchActivity();
    }, [id]);

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserIUD(user.uid);
        }
    }, []);

    const handleLastNameChange = (e) => setEditedLastName(e.target.value);
    const handleFirstNameChange = (e) => setEditedFirstName(e.target.value);
    const handleActiveChange = (e) => setEditedActive(e.target.checked);

    const handleSaveChanges = () => {
        const db = firebase.firestore();
        const updatedData = {
            lastName: editedLastName,
            firstName: editedFirstName,
            active: editedActive,
        };

        db.collection('users').doc(id).update(updatedData)
            .then(() => {
                setEditMode(false);
                alert('Mise à jour des données avec succès !');
                const historyRef = db.collection('users').doc(id).collection('history').doc();
                const historyData = {
                    author: userIUD,
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    type: 'accountUpdate'
                };
                historyRef.set(historyData).then(() => {
                    console.log('Historique mis à jour avec succès !');
                }).catch((error) => {
                    console.error('Erreur lors de la mise à jour de l\'historique:', error);
                });
            })
            .catch((error) => {
                console.log('Erreur lors de l\'enregistrement des modifications:', error);
            });
    };

    const handleDeleteUser = (userId) => {
        const db = firebase.firestore();
        const updatedData = {
            active: false
        };

        db.collection('users').doc(userId).update(updatedData)
            .then(() => {
                setEditMode(false);
                alert('Suppression avec succès !');
                const historyRef = db.collection('users').doc(userId).collection('history').doc();
                const historyData = {
                    author: userIUD,
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    type: 'accountDelete'
                };
                historyRef.set(historyData).then(() => {
                    console.log('Historique mis à jour avec succès !');
                }).catch((error) => {
                    console.error('Erreur lors de la suppression :', error);
                });
            })
            .catch((error) => {
                alert('Erreur lors de la suppression :', error);
            });
    };

    const getAccountEventTypeLabel = (type) => {
        switch (type) {
            case 'accountUpdate':
                return 'Mise à jour du compte';
            case 'accountCreation':
                return 'Création du compte';
            case 'accountDelete':
                return 'Suppression du compte';
            case 'accountRecovery':
                return 'Compte remis en ligne';
            default:
                return '';
        }
    };

    const getAccountEventIconColor = (type) => {
        switch (type) {
            case 'accountUpdate':
                return '';
            case 'accountCreation':
                return 'green';
            case 'accountDelete':
                return 'red';
            case 'accountRecovery':
                return 'orange';
            default:
                return '';
        }
    };

    const getAccountEventIcon = (type) => {
        switch (type) {
            case 'accountUpdate':
                return <ArrowPathIcon className="h-5 w-5" />;
            case 'accountCreation':
                return <UserIcon className="h-5 w-5" />;
            case 'accountDelete':
                return <TrashIcon className="h-5 w-5" />;
            case 'accountRecovery':
                return <ArrowDownTrayIcon className="h-5 w-5" />;
            default:
                return null;
        }
    };


    const getEventTypeLabel = (type) => {
        switch (type) {
            case 'update':
                return 'Mise à jour de :';
            case 'creation':
                return 'Création de :';
            case 'delete':
                return 'Suppression de :';
            case 'recovery':
                return 'Remise en ligne de :';
            default:
                return 'vide';
        }
    };

    const getEventIconColor = (type) => {
        switch (type) {
            case 'update':
                return '';
            case 'creation':
                return 'green';
            case 'delete':
                return 'red';
            case 'recovery':
                return 'orange';
            default:
                return '';
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'update':
                return <ArrowPathIcon className="h-5 w-5" />;
            case 'creation':
                return <PlusIcon className="h-5 w-5" />;
            case 'delete':
                return <TrashIcon className="h-5 w-5" />;
            case 'recovery':
                return <ArrowDownTrayIcon className="h-5 w-5" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <Spinner className="h-20 w-20" />
            </div>
        );
    }

    return (
        <div>
            <Card className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 grid items-center justify-between gap-8 sm:grid-cols-1 md:grid-cols-2">
                        <div className='flex'>
                            <Link to='/settings/users'>
                                <Button variant="text" onClick={() => { setEditMode(false) }}>
                                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Typography color="gray" className="mt-1 font-normal">
                                Utilisateur : {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Chargement...'}
                            </Typography>
                        </div>
                        <div className="flex shrink-0 gap-2 sm:flex-row md:justify-end">
                            {editMode ? (
                                <>
                                    <Button variant="secondary" color='red' onClick={() => setEditMode(false)}>
                                        Annuler
                                    </Button>
                                    <Button variant="success" onClick={handleSaveChanges}>
                                        Enregistrer
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="primary" onClick={() => setEditMode(true)}>
                                        Modifier
                                    </Button>
                                    <Button variant="outlined" color="red" onClick={() => handleDeleteUser(id)}>
                                        <TrashIcon strokeWidth={2} className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {selectedUser ? (
                        <div>
                            <div>
                                <Typography>ID :</Typography>
                                <Input value={id} disabled />
                            </div>
                            <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                <div className='gap-1 w-full'>
                                    <Typography>Nom :</Typography>
                                    <Input value={editedLastName} onChange={handleLastNameChange} disabled={!editMode} />
                                </div>
                                <div className='gap-1 w-full'>
                                    <Typography>Prénom :</Typography>
                                    <Input value={editedFirstName} onChange={handleFirstNameChange} disabled={!editMode} />
                                </div>
                            </div>
                            <div className='gap-5 mt-5 flex'>
                                <Typography>Actif :</Typography>
                                <Switch type="checkbox" checked={editedActive} onChange={handleActiveChange} disabled={!editMode} />
                            </div>
                        </div>
                    ) : (
                        <Typography>Chargement...</Typography>
                    )}
                    <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                        <div className='gap-1 w-full'>
                            <Typography>Historique :</Typography>
                            <div className="w-full pl-5 pr-0 pt-10">
                                <Timeline>
                                    {historyItems.map((item, index) => (
                                        <TimelineItem key={index} className="h-28">
                                            {index !== historyItems.length - 1 && <TimelineConnector className="!w-[78px]" />}
                                            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                                                <TimelineIcon className="p-3" variant="ghost" color={getAccountEventIconColor(item.type)}>
                                                    {getAccountEventIcon(item.type)}
                                                </TimelineIcon>
                                                <div className="flex flex-col gap-1">
                                                    <Typography variant="h6" color="blue-gray">
                                                        {getAccountEventTypeLabel(item.type)}
                                                    </Typography>
                                                    <Typography variant="small" color="gray" className="font-normal">
                                                        Le {item.date && item.date.toDate ? new Date(item.date.toDate()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} à {item.date && item.date.toDate ? new Date(item.date.toDate()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''} par {item ? `${item.author}` : ''}
                                                    </Typography>
                                                </div>
                                            </TimelineHeader>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            </div>
                        </div>
                        <div className='gap-1 w-full'>
                            <Typography>Activité de l'utilisateur :</Typography>
                            <div className="w-full pl-5 pr-5 pt-10">
                                <Timeline>
                                    {activityItems.map((item, index) => (
                                        <TimelineItem key={index} className="h-28">
                                            {index !== activityItems.length - 1 && <TimelineConnector className="!w-[78px]" />}
                                            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                                                <TimelineIcon className="p-3" variant="ghost" color={getEventIconColor(item.details.type)}>
                                                    {getEventIcon(item.details.type)}
                                                </TimelineIcon>
                                                <div className="flex flex-col gap-1">
                                                    <Typography variant="h6" color="blue-gray">
                                                        {getEventTypeLabel(item.details.type) + ' '}
                                                        <Link to={'/register/' + item.link} className='text-[]'>
                                                            {item.docName}
                                                        </Link>
                                                    </Typography>
                                                    <Typography variant="small" color="gray" className="font-normal">
                                                        Le {item.details && item.details.date && item.details.date.toDate ? new Date(item.details.date.toDate()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} à {item.details && item.details.date && item.details.date.toDate ? new Date(item.details.date.toDate()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </Typography>
                                                </div>
                                            </TimelineHeader>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
