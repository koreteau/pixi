import React, { useState, useEffect } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button, Typography, CardHeader, CardBody, Input, Switch, Menu, MenuHandler, MenuList, MenuItem, Chip } from '@material-tailwind/react';
import { ArrowLeftIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';



export function AdminSinglePageGame() {
    const { id } = useParams();
    const [selectedGame, setSelectedGame] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [tags, setTags] = useState([]);
    const [price, setPrice] = useState('');
    const [licence, setLicence] = useState('');
    const [isLicenceEnabled, setIsLicenceEnabled] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedGameFile, setSelectedGameFile] = useState(null);
    const [selectedGameFileName, setSelectedGameFileName] = useState('');
    const [gameSteps, setGameSteps] = useState([]);
    const [newStepTitle, setNewStepTitle] = useState('');
    const [newStepContent, setNewStepContent] = useState('');
    const [newStepTime, setNewStepTime] = useState('');
    const [devices, setDevices] = useState([]);
    const [status, setStatus] = useState('');
    const [availableDevices, setAvailableDevices] = useState(['PC', 'Mac', 'Android', 'IOS']);
    const [availableTags, setAvailableTags] = useState(['RSE', 'Marketing', 'Code', 'Électronique', 'Mathématiques', 'Sport', 'Histoire']);
    const [statusOptions] = useState(['approval', 'active', 'archived']);
    const navigate = useNavigate();

    useEffect(() => {
        const firestore = firebase.firestore();
        const fetchData = async () => {
            try {
                const gameDoc = await firestore.collection('games').doc(id).get();
                if (gameDoc.exists) {
                    const gameData = gameDoc.data();
                    setSelectedGame(gameData);
                    setTitle(gameData.title);
                    setDesc(gameData.desc);
                    setTags(gameData.tags || []);
                    setPrice(gameData.price || '');
                    setLicence(gameData.licence || '');
                    setDevices(gameData.devices || []);
                    setStatus(gameData.status || '');
                    setPreviewUrl(gameData.gamePicture ? `path/to/image/${gameData.gamePicture}` : '');
                    setSelectedGameFileName(gameData.game ? gameData.game.split('/').pop() : '');
                    const gameStepsSnapshot = await firestore.collection('games').doc(id).collection('gameContent').orderBy('order').get();
                    const steps = gameStepsSnapshot.docs.map(doc => doc.data());
                    setGameSteps(steps);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setSelectedImage(file);
        }
    };

    const handleGameFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedGameFile(file);
            setSelectedGameFileName(file.name);
        }
    };

    const addStep = () => {
        const order = gameSteps.length + 1;
        setGameSteps([...gameSteps, { title: newStepTitle, content: newStepContent, time: newStepTime, order }]);
        setNewStepTitle('');
        setNewStepContent('');
        setNewStepTime('');
    };

    const removeStep = (index) => {
        const updatedSteps = gameSteps.filter((step, i) => i !== index).map((step, i) => ({
            ...step,
            order: i + 1
        }));
        setGameSteps(updatedSteps);
    };

    const handleAddDevice = (device) => {
        if (editMode && !devices.includes(device)) {
            setDevices([...devices, device]);
        }
    };

    const handleRemoveDevice = (device) => {
        if (editMode) {
            setDevices(devices.filter(d => d !== device));
        }
    };

    const handleAddTag = (tag) => {
        if (editMode && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        if (editMode) {
            setTags(tags.filter(t => t !== tag));
        }
    };

    const handleSaveGameChanges = async () => {
        const db = firebase.firestore();
        const storageRef = firebase.storage().ref();

        let img = selectedGame.gamePicture || '';
        if (selectedImage) {
            const imageExtension = selectedImage.name.split('.').pop();
            const fileRef = storageRef.child(`img/gamePicture/${id}.${imageExtension}`);
            await fileRef.put(selectedImage);
            img = `${id}.${imageExtension}`;
        }

        let gameFileUrl = selectedGame.game || '';
        if (selectedGameFile) {
            const gameFileExtension = selectedGameFile.name.split('.').pop();
            const fileRef = storageRef.child(`games/${id}.${gameFileExtension}`);
            await fileRef.put(selectedGameFile);
            gameFileUrl = `games/${id}.${gameFileExtension}`;
        }

        const updatedData = {
            title,
            desc,
            tags,
            price: price ? Number(price) : 0,
            gamePicture: img,
            game: gameFileUrl,
            devices,
            status
        };

        if (!isLicenceEnabled) {
            updatedData.licence = licence;
        }

        db.collection('games').doc(id).update(updatedData)
            .then(() => {
                setEditMode(false);
                alert('Mise à jour des données avec succès !');
                navigate('/admin/register/games');
            })
            .catch((error) => {
                console.log('Erreur lors de l\'enregistrement des modifications:', error);
            });

        const gameContentRef = db.collection('games').doc(id).collection('gameContent');
        const batch = db.batch();
        gameSteps.forEach((step, index) => {
            const stepRef = gameContentRef.doc(step.id || gameContentRef.doc().id);
            batch.set(stepRef, { ...step, order: index + 1 });
        });
        await batch.commit();
    };

    const handleDeleteGame = (gameId) => {
        const db = firebase.firestore();
        const updatedData = {
            active: false
        };

        db.collection('games').doc(gameId).update(updatedData)
            .then(() => {
                setEditMode(false);
                alert('Suppression avec succès !');
                navigate('/register/news');
            })
            .catch((error) => {
                alert('Erreur lors de la suppression :', error);
            });
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
    };

    return (
        <div>
            <div className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 grid items-center justify-between gap-8 sm:grid-cols-1 md:grid-cols-2">
                        <div className='flex items-center'>
                            <Link to='/admin/register/games'>
                                <Button variant="text" className='hover:bg-none' onClick={() => { setEditMode(false) }}>
                                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color='orange' />
                                </Button>
                            </Link>
                            <Typography color="gray" className="mt-1 font-normal">
                                Jeu : {selectedGame ? selectedGame.title : 'Chargement...'}
                            </Typography>
                        </div>
                        <div className="flex shrink-0 gap-2 sm:flex-row md:justify-end">
                            {editMode ? (
                                <>
                                    <Button variant="secondary" color='red' onClick={() => setEditMode(false)}>
                                        Annuler
                                    </Button>
                                    <Button variant="gradient" color="green" onClick={handleSaveGameChanges}>
                                        Enregistrer
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className='bg-pixi hover:shadow-none' onClick={() => setEditMode(true)}>
                                        Modifier
                                    </Button>
                                    <Button variant="outlined" color="red" onClick={() => handleDeleteGame(id)}>
                                        <TrashIcon strokeWidth={2} className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    {selectedGame ? (
                        <div>
                            <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                <div className=' gap-1 w-full'>
                                    <Typography>Titre :</Typography>
                                    <Input color="orange" value={title} onChange={(e) => setTitle(e.target.value)} disabled={!editMode} />
                                </div>
                                <div className=' gap-1 w-full'>
                                    <Typography>Courte description :</Typography>
                                    <Input color="orange" value={desc} onChange={(e) => setDesc(e.target.value)} disabled={!editMode} />
                                </div>
                            </div>
                            <div className='gap-5 mt-5 grid sm:grid-cols-1 md:grid-cols-2'>
                                <div className='py-1'>
                                    <div className="flex items-center gap-3 pb-2">
                                        <Typography>Tags :</Typography>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {tags.map((tag) => (
                                                <Chip key={tag} value={tag} onClose={editMode ? () => handleRemoveTag(tag) : null} variant="outlined" color='amber'>
                                                    {tag}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>
                                    {editMode && (
                                        <Menu>
                                            <MenuHandler>
                                                <Button className="bg-pixi hover:shadow-none">Sélectionner des tags</Button>
                                            </MenuHandler>
                                            <MenuList>
                                                {availableTags.map((tag) => (
                                                    <MenuItem key={tag} onClick={() => handleAddTag(tag)}>
                                                        {tag}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    )}
                                </div>
                                <div className='py-1'>
                                    <div className="flex items-center gap-3 pb-2">
                                        <Typography>Appareils compatibles :</Typography>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {devices.map((device) => (
                                                <Chip key={device} value={device} onClose={editMode ? () => handleRemoveDevice(device) : null} variant="outlined" color='amber'>
                                                    {device}
                                                </Chip>
                                            ))}
                                        </div>
                                    </div>
                                    {editMode && (
                                        <Menu>
                                            <MenuHandler>
                                                <Button className="bg-pixi hover:shadow-none">Sélectionner des appareils</Button>
                                            </MenuHandler>
                                            <MenuList>
                                                {availableDevices.map((device) => (
                                                    <MenuItem key={device} onClick={() => handleAddDevice(device)}>
                                                        {device}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    )}
                                </div>
                            </div>
                            <div className='mt-5'>
                                <Input label="Prix" color="orange" value={price} size="lg" onChange={(e) => setPrice(e.target.value)} disabled={!editMode} />
                            </div>
                            <div className='mt-5'>
                                <Switch label="Licence" color="orange" checked={isLicenceEnabled} onChange={(e) => setIsLicenceEnabled(e.target.checked)} disabled={!editMode} />
                                {isLicenceEnabled && <Input label="Licence" color="orange" value={licence} size="lg" onChange={(e) => setLicence(e.target.value)} disabled={!editMode} />}
                            </div>
                            <div className='gap-5 mt-5'>
                                <Typography>Status :</Typography>
                                {editMode ? (
                                    <Menu>
                                        <MenuHandler>
                                            <Button className="bg-pixi hover:shadow-none">{status || 'Sélectionner le status'}</Button>
                                        </MenuHandler>
                                        <MenuList>
                                            {statusOptions.map((option) => (
                                                <MenuItem key={option} onClick={() => handleStatusChange(option)}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </Menu>
                                ) : (
                                    <Input value={status} disabled />
                                )}
                            </div>
                            <div className='mt-5'>
                                <Typography>Image :</Typography>
                                <div className="relative mb-4">
                                    {previewUrl && <img src={previewUrl} alt="Aperçu" className="w-full h-48 object-cover" />}
                                    <label className="cursor-pointer flex flex-col items-center mt-2">
                                        <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                                        <input type="file" className="hidden" onChange={handleImageUpload} disabled={!editMode} />
                                        <span className="text-gray-400">Télécharger une image</span>
                                    </label>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <Typography>Fichier du jeu :</Typography>
                                <div className="relative mb-4">
                                    <label className="cursor-pointer flex flex-col items-center mt-2">
                                        <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                                        <input type="file" className="hidden" onChange={handleGameFileUpload} disabled={!editMode} />
                                        <span className="text-gray-400">Télécharger le fichier du jeu</span>
                                    </label>
                                    {selectedGameFileName && <Typography className="mt-2">Fichier sélectionné: {selectedGameFileName}</Typography>}
                                </div>
                            </div>
                            <div className='mt-5'>
                                <Typography variant="h6">Étapes du jeu :</Typography>
                                {gameSteps.map((step, index) => (
                                    <div key={index} className="flex flex-col gap-2">
                                        <Typography>Étape {index + 1}</Typography>
                                        <Typography>Titre: {step.title}</Typography>
                                        <Typography>Contenu: {step.content}</Typography>
                                        <Typography>Temps: {step.time} minutes</Typography>
                                        {editMode && (
                                            <Button variant="outlined" color="red" onClick={() => removeStep(index)}>
                                                <TrashIcon strokeWidth={2} className="h-4 w-4" /> Supprimer
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {editMode && (
                                    <div className="flex flex-col gap-2">
                                        <Input label="Titre de l'étape" color="orange" value={newStepTitle} size="lg" onChange={(e) => setNewStepTitle(e.target.value)} />
                                        <Input label="Contenu de l'étape" color="orange" value={newStepContent} size="lg" onChange={(e) => setNewStepContent(e.target.value)} />
                                        <Input label="Temps (en minutes)" color="orange" value={newStepTime} size="lg" onChange={(e) => setNewStepTime(e.target.value)} />
                                        <Button className="bg-pixi hover:shadow-none" onClick={addStep}>Ajouter l'étape</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Typography>Chargement...</Typography>
                    )}
                </CardBody>
            </div>
        </div>
    );
}