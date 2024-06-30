import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Button,
    Typography,
    Input,
    Switch,
    CardHeader,
    CardBody
} from '@material-tailwind/react';
import { ArrowLeftIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

export function AdminSinglePageUser() {
    const { id } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [idNumber, setIdNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePictureFile, setProfilePictureFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isModified, setIsModified] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const firestore = firebase.firestore();
            const storageRef = firebase.storage().ref();

            try {
                const userDoc = await firestore.collection('users').doc(id).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setSelectedUser(userData);
                    setFullName(userData.fullName || '');
                    setUsername(userData.username || '');
                    setBirthdate(userData.birthdate ? userData.birthdate.toDate().toISOString().split('T')[0] : '');
                    setIsActive(userData.isActive || false);
                    setIsAdmin(userData.isAdmin || false);
                    setIsSeller(userData.isSeller || false);
                    setIdNumber(userData.idNumber || '');
                    setProfilePicture(userData.profilePicture ? `img/userPicture/${userData.profilePicture}` : '');

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
                    console.error('Aucun utilisateur trouvé avec l\'identifiant spécifié.');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error);
            }
        };

        fetchData();
    }, [id]);

    const isValidDate = (dateString) => {
        // Simple regex to validate yyyy-MM-dd format
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    };

    const handleSaveUserChanges = async () => {
        if (!isModified) {
            alert('Aucune modification détectée.');
            return;
        }

        const firestore = firebase.firestore();
        const storageRef = firebase.storage().ref();

        let img = selectedUser.profilePicture || '';

        if (profilePictureFile) {
            const imageExtension = profilePictureFile.name.split('.').pop();
            const fileRef = storageRef.child(`img/userPicture/${id}.${imageExtension}`);

            try {
                await fileRef.put(profilePictureFile);
                img = `${id}.${imageExtension}`;
            } catch (error) {
                console.error('Erreur lors du téléchargement de l\'image :', error);
                alert('Erreur lors du téléchargement de l\'image.');
                return;
            }
        }

        if (!isValidDate(birthdate)) {
            alert('La date de naissance n\'est pas dans le format attendu (yyyy-MM-dd).');
            return;
        }

        const updatedData = {
            fullName,
            username,
            birthdate,
            isActive,
            isAdmin,
            isSeller,
            idNumber: isSeller ? idNumber : firebase.firestore.FieldValue.delete(),
            profilePicture: img,
        };

        try {
            await firestore.collection('users').doc(id).update(updatedData);
            setEditMode(false);
            alert('Données utilisateur mises à jour avec succès !');
            navigate('/admin/settings/users');
        } catch (error) {
            alert('Erreur lors de la mise à jour des données utilisateur : ' + error.message);
            console.error('Erreur lors de la mise à jour des données utilisateur :', error);
        }

        setIsModified(false);
    };

    const handleDeleteUser = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            return;
        }

        const firestore = firebase.firestore();
        const storageRef = firebase.storage().ref();

        try {
            await firestore.collection('users').doc(id).delete();
            setEditMode(false);
            alert('Utilisateur supprimé avec succès !');
            navigate('/admin/settings/users');
        } catch (error) {
            alert('Erreur lors de la suppression de l\'utilisateur : ' + error.message);
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePictureFile(file);
            setIsModified(true);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStatusChange = (newStatus) => {
        setIsActive(newStatus === 'active');
        setIsModified(true);
    };

    return (
        <div>
            <div className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 grid items-center justify-between gap-8 sm:grid-cols-1 md:grid-cols-2">
                        <div className='flex items-center'>
                            <Link to='/admin/settings/users'>
                                <Button variant="text" className='hover:bg-none' onClick={() => { setEditMode(false) }}>
                                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color='orange' />
                                </Button>
                            </Link>
                            <Typography color="gray" className="mt-1 font-normal">
                                Utilisateur : {selectedUser ? selectedUser.username : 'Chargement...'}
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
                                <>
                                    <Button className='bg-pixi hover:shadow-none' onClick={() => setEditMode(true)}>
                                        Modifier
                                    </Button>
                                    <Button variant="outlined" color="red" onClick={() => handleDeleteUser()}>
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
                            <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                <div className=' gap-1 w-full'>
                                    <Typography>Nom complet :</Typography>
                                    <Input color="orange" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!editMode} />
                                </div>
                                <div className=' gap-1 w-full'>
                                    <Typography>Nom d'utilisateur :</Typography>
                                    <Input color="orange" value={username} onChange={(e) => setUsername(e.target.value)} disabled={!editMode} />
                                </div>
                            </div>
                            <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                <div className='py-1'>
                                    <div className="flex items-center gap-3 pb-2">
                                        <Typography>Date de naissance :</Typography>
                                        <Input type="date" color="orange" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} disabled={!editMode} />
                                    </div>
                                </div>
                                <div className='py-1'>
                                    <div className="flex items-center gap-3 pb-2">
                                        <Typography>Statut :</Typography>
                                        <Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={!editMode} />
                                    </div>
                                </div>
                            </div>
                            <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                <div className='py-1'>
                                    <div className="flex items-center gap-3 pb-2">
                                        <Typography>Administrateur :</Typography>
                                        <Switch checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} disabled={!editMode} />
                                    </div>
                                </div>
                                <div className='py-1'>
                                    <div className="flex items-center gap-3 pb-2">
                                        <Typography>Vendeur :</Typography>
                                        <Switch checked={isSeller} onChange={(e) => setIsSeller(e.target.checked)} disabled={!editMode} />
                                    </div>
                                </div>
                            </div>
                            {isSeller && (
                                <div className='mt-5'>
                                    <Typography>Numéro d'identification :</Typography>
                                    <Input color="orange" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} disabled={!editMode} />
                                </div>
                            )}
                            <div className='mt-5'>
                                <Typography>Photo de profil :</Typography>
                                <div className="relative mb-4">
                                    {previewUrl && <img src={previewUrl} alt="Aperçu" className="w-full h-48 object-cover" />}
                                    <label className="cursor-pointer flex flex-col items-center mt-2">
                                        <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                                        <input type="file" className="hidden" onChange={handleImageUpload} disabled={!editMode} />
                                        <span className="text-gray-400">Télécharger une image</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Typography className="text-center mt-8">Chargement...</Typography>
                    )}
                </CardBody>
            </div>
        </div>
    );
}
