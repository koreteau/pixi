import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Button, Typography, Input, Switch, CardHeader, CardBody, Spinner } from '@material-tailwind/react';
import { ArrowLeftIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';



export function AccountInfos() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [idNumber, setIdNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [modifiedFields, setModifiedFields] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const firestore = firebase.firestore();
            const storageRef = firebase.storage().ref();
            const currentUser = firebase.auth().currentUser;

            try {
                const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setUser(userData);
                    setFullName(userData.fullName || '');
                    setUsername(userData.username || '');
                    setBirthdate(userData.birthdate || '');
                    setIsSeller(userData.isSeller || false);
                    setIdNumber(userData.idNumber || '');
                    setProfilePicture(userData.profilePicture ? `img/userPicture/${userData.profilePicture}` : '');
                    setEmail(currentUser.email);

                    if (userData.profilePicture) {
                        try {
                            const imgRef = storageRef.child(`img/userPicture/${userData.profilePicture}`);
                            const imgUrl = await imgRef.getDownloadURL();
                            setPreviewUrl(imgUrl);
                        } catch (error) {
                            console.error('Erreur lors de la récupération de l\'URL de l\'image de profil :', error);
                        }
                    }
                } else {
                    console.error('Aucun utilisateur trouvé.');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error);
            }
        };

        fetchData();
    }, []);

    const isValidDate = (dateString) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    };

    const handleSaveUserChanges = async () => {
        const currentUser = firebase.auth().currentUser;

        if (Object.keys(modifiedFields).length === 0 && !profilePictureFile && !newPassword) {
            alert('Aucune modification détectée.');
            return;
        }

        if (newPassword && newPassword !== confirmNewPassword) {
            alert('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }

        const firestore = firebase.firestore();
        const storageRef = firebase.storage().ref();

        let img = user.profilePicture || '';

        if (profilePictureFile) {
            const imageExtension = profilePictureFile.name.split('.').pop();
            const fileRef = storageRef.child(`img/userPicture/${currentUser.uid}.${imageExtension}`);

            try {
                await fileRef.put(profilePictureFile);
                img = `${currentUser.uid}.${imageExtension}`;
                modifiedFields.profilePicture = img;
            } catch (error) {
                console.error('Erreur lors du téléchargement de l\'image :', error);
                alert('Erreur lors du téléchargement de l\'image.');
                return;
            }
        }

        if (birthdate && !isValidDate(birthdate)) {
            alert('La date de naissance n\'est pas dans le format attendu (yyyy-MM-dd).');
            return;
        }

        if (isSeller && !idNumber) {
            alert("Le numéro d'identification est requis pour les vendeurs.");
            return;
        }

        try {
            if (email !== currentUser.email) {
                await currentUser.updateEmail(email);
                alert('Email mis à jour avec succès !');
            }

            if (newPassword) {
                await currentUser.updatePassword(newPassword);
                alert('Mot de passe mis à jour avec succès !');
            }

            await firestore.collection('users').doc(currentUser.uid).update(modifiedFields);
            setEditMode(false);
            alert('Données utilisateur mises à jour avec succès !');
            navigate('/account');
        } catch (error) {
            alert('Erreur lors de la mise à jour des données utilisateur : ' + error.message);
            console.error('Erreur lors de la mise à jour des données utilisateur :', error);
        }

        setModifiedFields({});
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePictureFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFieldChange = (setter, field) => (e) => {
        setter(e.target.value);
        setModifiedFields((prev) => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSwitchChange = (setter, field) => (e) => {
        setter(e.target.checked);
        setModifiedFields((prev) => ({
            ...prev,
            [field]: e.target.checked
        }));
    };

    return (
        <div>
            <div className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 grid items-center justify-between gap-8 sm:grid-cols-1 md:grid-cols-2">
                        <div className='flex items-center'>
                            <Typography variant='h6' className="mt-1 font-normal">
                                Mes informations
                            </Typography>
                        </div>
                        <div className="flex shrink-0 gap-2 sm:flex-row md:justify-end">
                            {editMode ? (
                                <>
                                    <Button variant="secondary" color='red' onClick={() => setEditMode(false)}>
                                        Annuler
                                    </Button>
                                    <Button variant="gradient" color="green" onClick={handleSaveUserChanges}>
                                        Sauvegarder
                                    </Button>
                                </>
                            ) : (
                                <Button className='bg-pixi hover:shadow-none' onClick={() => setEditMode(true)}>
                                    Modifier
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {user ? (
                        <div>
                            <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                <div>
                                    <div className='gap-1 w-full'>
                                        <Typography>Nom complet :</Typography>
                                        <Input color="orange" value={fullName} onChange={handleFieldChange(setFullName, 'fullName')} disabled={!editMode} />
                                    </div>
                                    <div className='gap-1 w-full mt-5'>
                                        <Typography>Nom d'utilisateur :</Typography>
                                        <Input color="orange" value={username} onChange={handleFieldChange(setUsername, 'username')} disabled={!editMode} />
                                    </div>
                                    <div className="gap-1 w-full mt-5">
                                        <Typography>Date de naissance :</Typography>
                                        <Input type="date" color="orange" value={birthdate} onChange={handleFieldChange(setBirthdate, 'birthdate')} disabled={!editMode} />
                                    </div>
                                    <div className='py-1 mt-5'>
                                        <div className="flex items-center gap-3 pb-2">
                                            <Typography>Vendeur :</Typography>
                                            <Switch color='orange' checked={isSeller} onChange={handleSwitchChange(setIsSeller, 'isSeller')} disabled={!editMode} />
                                        </div>
                                    </div>
                                    {isSeller && (
                                        <div className='mt-5'>
                                            <Typography>Numéro d'identification :</Typography>
                                            <Input color="orange" value={idNumber} onChange={handleFieldChange(setIdNumber, 'idNumber')} disabled={!editMode} />
                                        </div>
                                    )}
                                    <hr className="my-5" />
                                    <div className='gap-1 w-full mt-5'>
                                        <Typography>Email :</Typography>
                                        <Input type="email" color="orange" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editMode} />
                                    </div>
                                    <div className='gap-1 w-full mt-5'>
                                        <Typography>Mot de passe actuel :</Typography>
                                        <Input type="password" color="orange" value={password} onChange={(e) => setPassword(e.target.value)} disabled={!editMode} />
                                    </div>
                                    <div className='gap-1 w-full mt-5'>
                                        <Typography>Nouveau mot de passe :</Typography>
                                        <Input type="password" color="orange" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={!editMode} />
                                    </div>
                                    <div className='gap-1 w-full mt-5'>
                                        <Typography>Confirmer le nouveau mot de passe :</Typography>
                                        <Input type="password" color="orange" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={!editMode} />
                                    </div>
                                </div>
                                <div className='mt-5'>
                                    <Typography>Photo de profil :</Typography>
                                    <div className="relative mb-4">
                                        {editMode ? (
                                            <label
                                                className={`cursor-pointer flex flex-col items-center justify-center mt-2 h-full bg-cover bg-center bg-no-repeat ${editMode ? 'filter grayscale' : ''}`}
                                                style={{ backgroundImage: `url(${previewUrl})` }}
                                            >
                                                <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                                                <input type="file" className="hidden" onChange={handleImageUpload} disabled={!editMode} />
                                                <span className="text-gray-400">Télécharger une image</span>
                                            </label>
                                        ) : (
                                            previewUrl && <img src={previewUrl} alt="Aperçu" className="w-full object-cover" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center min-h-screen'>
                            <Spinner className="h-20 w-20" color="orange" />
                        </div>
                    )}
                </CardBody>
            </div>
        </div>
    );
}
