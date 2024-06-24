import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { Button, CardHeader, CardBody, CardFooter, Input, Typography, Switch, Menu, MenuHandler, MenuList, MenuItem, Chip } from '@material-tailwind/react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';



export function CreateGame() {
    const [userUid, setUserUid] = useState('');
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
    const [availableDevices, setAvailableDevices] = useState(['PC', 'Mac', 'Android', 'IOS']);
    const [availableTags, setAvailableTags] = useState(['RSE', 'Marketing', 'Code', 'Électronique', 'Mathématiques', 'Sport', 'Histoire']);
    const navigate = useNavigate();

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) setUserUid(user.uid);
    }, []);

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

    const getFileExtension = (fileName) => {
        return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
    };

    const handleAddDevice = (device) => {
        if (!devices.includes(device)) {
            setDevices([...devices, device]);
        }
    };

    const handleRemoveDevice = (device) => {
        setDevices(devices.filter(d => d !== device));
    };

    const handleAddTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleSubmit = async () => {
        const db = firebase.firestore();
        const storageRef = firebase.storage().ref();

        const gameDocRef = db.collection('games').doc();
        const gameId = gameDocRef.id;

        let img = '';
        if (selectedImage) {
            const imageExtension = getFileExtension(selectedImage.name);
            const fileRef = storageRef.child(`img/gamePicture/${gameId}.${imageExtension}`);
            await fileRef.put(selectedImage);
            img = `${gameId}.${imageExtension}`;
        }

        let gameFileUrl = '';
        if (selectedGameFile) {
            const gameFileExtension = getFileExtension(selectedGameFile.name);
            const fileRef = storageRef.child(`games/${gameId}.${gameFileExtension}`);
            await fileRef.put(selectedGameFile);
            gameFileUrl = `games/${gameId}.${gameFileExtension}`;
        }

        const newGame = {
            title,
            desc,
            gamePicture: img,
            author: userUid,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
            tags,
            price: price ? Number(price) : 0,
            game: gameFileUrl,
            status: "approval",
            devices
        };

        if (!isLicenceEnabled) {
            newGame.licence = licence;
        }

        await gameDocRef.set(newGame);

        const gameContentRef = gameDocRef.collection('gameContent');
        gameSteps.forEach((step) => {
            gameContentRef.doc().set({
                title: step.title,
                content: step.content,
                time: Number(step.time),
                order: step.order
            });
        });

        alert('Nouveau formation crée avec succès !');
        navigate('/approval');
    };


    return (
        <div className="max-w-5xl mx-auto">
            <CardHeader floated={false} shadow={false} className="rounded-none flex flex-col items-center justify-center py-[2rem]">
                <Typography variant="h4">
                    Push ta formation à la communauté
                </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
                <Input label="Titre du jeu" color="orange" value={title} size="lg" onChange={(e) => setTitle(e.target.value)} />
                <Input label="Description" color="orange" value={desc} size="lg" onChange={(e) => setDesc(e.target.value)} />
                <div className="grid lg:grid-cols-2">
                    <div className='py-1'>
                        <div className="flex items-center gap-3 pb-2">
                            <Typography>Tags :</Typography>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <Chip key={tag} value={tag} onClose={() => handleRemoveTag(tag)} variant="outlined" color='amber'>
                                        {tag}
                                    </Chip>
                                ))}
                            </div>
                        </div>
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

                    </div>
                    <div className='py-1'>
                        <div className="flex items-center gap-3 pb-2">
                            <Typography>Appareils compatibles :</Typography>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {devices.map((device) => (
                                    <Chip key={device} value={device} onClose={() => handleRemoveDevice(device)} variant="outlined" color='amber'>
                                        {device}
                                    </Chip>
                                ))}
                            </div>
                        </div>
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

                    </div>
                </div>
                <Input label="Prix" color="orange" value={price} size="lg" onChange={(e) => setPrice(e.target.value)} />
                <Switch label="Licence" color="orange" checked={isLicenceEnabled} onChange={(e) => setIsLicenceEnabled(e.target.checked)} />
                {isLicenceEnabled && <Input label="Licence" color="orange" value={licence} size="lg" onChange={(e) => setLicence(e.target.value)} />}
                <Typography>Image :</Typography>
                <div className="relative mb-4">
                    {previewUrl && <img src={previewUrl} alt="Aperçu" className="w-full h-48 object-cover" />}
                    <label className="cursor-pointer flex flex-col items-center mt-2">
                        <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                        <input type="file" className="hidden" onChange={handleImageUpload} />
                        <span className="text-gray-400">Télécharger une image</span>
                    </label>
                </div>
                <Typography>Fichier du jeu :</Typography>
                <div className="relative mb-4">
                    <label className="cursor-pointer flex flex-col items-center mt-2">
                        <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                        <input type="file" className="hidden" onChange={handleGameFileUpload} />
                        <span className="text-gray-400">Télécharger le fichier du jeu</span>
                    </label>
                    {selectedGameFileName && <Typography className="mt-2">Fichier sélectionné: {selectedGameFileName}</Typography>}
                </div>
                <Typography variant="h6">Étapes du jeu :</Typography>
                {gameSteps.map((step, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <Typography>Étape {index + 1}</Typography>
                        <Typography>Titre: {step.title}</Typography>
                        <Typography>Contenu: {step.content}</Typography>
                        <Typography>Temps: {step.time} minutes</Typography>
                    </div>
                ))}
                <div className="flex flex-col gap-2">
                    <Input label="Titre de l'étape"color="orange" value={newStepTitle} size="lg" onChange={(e) => setNewStepTitle(e.target.value)} />
                    <Input label="Contenu de l'étape" color="orange" value={newStepContent} size="lg" onChange={(e) => setNewStepContent(e.target.value)} />
                    <Input label="Temps (en minutes)" color="orange" value={newStepTime} size="lg" onChange={(e) => setNewStepTime(e.target.value)} />
                    <Button className="bg-pixi hover:shadow-none" onClick={addStep}>Ajouter l'étape</Button>
                </div>
            </CardBody>
            <CardFooter className='flex gap-2'>
                <Link to='/'>
                    <Button variant="outlined" color="red">
                        <span>Annuler</span>
                    </Button>
                </Link>
                <Button variant="gradient" color="green" onClick={handleSubmit}>
                    <span>Publier</span>
                </Button>
            </CardFooter>
        </div>
    );
}
