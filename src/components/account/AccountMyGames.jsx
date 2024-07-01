import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, CardBody, CardHeader, CardFooter, Input, Typography, Tabs, TabsHeader, Tab, Chip, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { MagnifyingGlassIcon, PlusIcon, ArrowUpTrayIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const TABLE_HEAD = ['Titre', 'Description', 'Statut', 'Date', 'Actions'];
const TABS = [
    { label: 'Toutes les formations', value: 'all' },
    { label: "En attente d'approbation", value: 'approval' },
    { label: 'Actives', value: 'active' },
    { label: 'Désactivées', value: 'archived' },
];

export function AccountMyGames() {
    const [games, setGames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage] = useState(20);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userUID, setUserUID] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');
    const [expandedGameId, setExpandedGameId] = useState(null);
    const [editingGameId, setEditingGameId] = useState(null);
    const [editedGame, setEditedGame] = useState({});
    const [availableDevices] = useState(['PC', 'Mac', 'Android', 'IOS']);
    const [availableTags] = useState(['RSE', 'Marketing', 'Code', 'Électronique', 'Mathématiques', 'Sport', 'Histoire']);
    const [statusOptions] = useState(['approval', 'active', 'archived']);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedGameFile, setSelectedGameFile] = useState(null);
    const [selectedGameFileName, setSelectedGameFileName] = useState('');
    const [newStepTitle, setNewStepTitle] = useState('');
    const [newStepContent, setNewStepContent] = useState('');
    const [newStepTime, setNewStepTime] = useState('');

    useEffect(() => {
        const db = firebase.firestore();
        const fetchData = async () => {
            try {
                const user = firebase.auth().currentUser;
                setUserUID(user.uid);

                const gamesSnapshot = await db.collection('games').where('author', '==', user.uid).get();
                const gamesData = await Promise.all(gamesSnapshot.docs.map(async (doc) => {
                    const gameData = doc.data();
                    const gameContentSnapshot = await db.collection('games').doc(doc.id).collection('gameContent').orderBy('order').get();
                    const gameContentData = gameContentSnapshot.docs.map((stepDoc) => stepDoc.data());
                    return {
                        id: doc.id,
                        ...gameData,
                        date: gameData.date.toDate().toLocaleDateString(),
                        gameContent: gameContentData
                    };
                }));
                setGames(gamesData);

                const userSnapshot = await db.collection('users').get();
                const userData = userSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userData);

                setLoading(false);
            } catch (error) {
                console.error('Error retrieving data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTabChange = (value) => {
        setSelectedTab(value);
        setCurrentPage(1);
    };

    const filteredGames = games.filter((game) => {
        const normalizedTitle = game.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedSearchTerm = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const statusMatch = selectedTab === 'all' || game.status === selectedTab;
        return normalizedTitle.includes(normalizedSearchTerm) && statusMatch;
    });

    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleExpandClick = async (id) => {
        if (expandedGameId === id) {
            setExpandedGameId(null);
            return;
        }

        const selectedGame = games.find(game => game.id === id);
        if (selectedGame && selectedGame.gamePicture) {
            const storageRef = firebase.storage().ref();
            try {
                const imgUrl = await storageRef.child(`img/gamePicture/${selectedGame.gamePicture}`).getDownloadURL();
                setPreviewUrl(imgUrl);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'URL de l\'image du jeu :', error);
            }
        }
        setExpandedGameId(id);
    };

    const handleEditClick = (game) => {
        if (editingGameId === game.id) {
            setEditingGameId(null);
        } else {
            setEditingGameId(game.id);
            setEditedGame(game);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedGame({ ...editedGame, [name]: value });
    };

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

    const handleSaveClick = async (id) => {
        const db = firebase.firestore();
        const storageRef = firebase.storage().ref();

        let img = editedGame.gamePicture || '';
        if (selectedImage) {
            const imageExtension = selectedImage.name.split('.').pop();
            const fileRef = storageRef.child(`img/gamePicture/${id}.${imageExtension}`);
            await fileRef.put(selectedImage);
            img = `${id}.${imageExtension}`;
        }

        let gameFileUrl = editedGame.game || '';
        if (selectedGameFile) {
            const gameFileExtension = selectedGameFile.name.split('.').pop();
            const fileRef = storageRef.child(`games/${id}.${gameFileExtension}`);
            await fileRef.put(selectedGameFile);
            gameFileUrl = `games/${id}.${gameFileExtension}`;
        }

        const updatedData = {
            ...editedGame,
            gamePicture: img,
            game: gameFileUrl,
            status: 'approval'
        };

        delete updatedData.date;

        db.collection('games').doc(id).update(updatedData)
            .then(() => {
                setGames(games.map((game) => (game.id === id ? { ...game, ...updatedData } : game)));

                // Update game content steps
                const batch = db.batch();
                editedGame.gameContent.forEach((step, index) => {
                    const stepRef = db.collection('games').doc(id).collection('gameContent').doc((index + 1).toString());
                    batch.set(stepRef, {
                        order: index + 1,
                        title: step.title,
                        content: step.content,
                        time: step.time
                    });
                });

                batch.commit().then(() => {
                    setEditingGameId(null);
                    alert('Votre modification a bien été prise en compte.');
                }).catch((error) => {
                    console.error('Error updating game content:', error);
                });
            })
            .catch((error) => {
                console.error('Error updating game:', error);
            });
    };

    const handleDeleteClick = (id) => {
        const db = firebase.firestore();
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
            db.collection('games').doc(id).delete()
                .then(() => {
                    setGames(games.filter((game) => game.id !== id));
                })
                .catch((error) => {
                    console.error('Error deleting game:', error);
                });
        }
    };

    const handleAddDevice = (device) => {
        if (!editedGame.devices.includes(device)) {
            setEditedGame({ ...editedGame, devices: [...editedGame.devices, device] });
        }
    };

    const handleRemoveDevice = (device) => {
        setEditedGame({ ...editedGame, devices: editedGame.devices.filter(d => d !== device) });
    };

    const handleAddTag = (tag) => {
        if (!editedGame.tags.includes(tag)) {
            setEditedGame({ ...editedGame, tags: [...editedGame.tags, tag] });
        }
    };

    const handleRemoveTag = (tag) => {
        setEditedGame({ ...editedGame, tags: editedGame.tags.filter(t => t !== tag) });
    };

    const addStep = () => {
        const order = (editedGame.gameContent ? editedGame.gameContent.length : 0) + 1;
        const newStep = { title: newStepTitle, content: newStepContent, time: newStepTime, order, isModified: true };
        setEditedGame({ ...editedGame, gameContent: [...(editedGame.gameContent || []), newStep] });
        setNewStepTitle('');
        setNewStepContent('');
        setNewStepTime('');
    };

    const removeStep = (index) => {
        const updatedSteps = (editedGame.gameContent || []).filter((step, i) => i !== index).map((step, i) => ({
            ...step,
            order: i + 1
        }));
        setEditedGame({ ...editedGame, gameContent: updatedSteps });
    };

    const handleStepTitleChange = (index, value) => {
        const updatedSteps = [...(editedGame.gameContent || [])];
        updatedSteps[index].title = value;
        updatedSteps[index].isModified = true;
        setEditedGame({ ...editedGame, gameContent: updatedSteps });
    };

    const handleStepContentChange = (index, value) => {
        const updatedSteps = [...(editedGame.gameContent || [])];
        updatedSteps[index].content = value;
        updatedSteps[index].isModified = true;
        setEditedGame({ ...editedGame, gameContent: updatedSteps });
    };

    const handleStepTimeChange = (index, value) => {
        const updatedSteps = [...(editedGame.gameContent || [])];
        updatedSteps[index].time = value;
        updatedSteps[index].isModified = true;
        setEditedGame({ ...editedGame, gameContent: updatedSteps });
    };

    const paginatedGames = filteredGames.slice((currentPage - 1) * gamesPerPage, currentPage * gamesPerPage);

    return (
        <div className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography color="gray" className="mt-1 font-normal">
                            Mes formations publiées
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Link to='/catalog/new'>
                            <Button className="flex items-center gap-3 bg-pixi shadow-none hover:shadow-pixi" size="sm">
                                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Publier une formation
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value={selectedTab} onChange={(e) => handleTabChange(e)} className="w-full md:w-max">
                        <TabsHeader className="flex-nowrap">
                            {TABS.map(({ label, value }) => (
                                <Tab key={value} value={value} onClick={() => handleTabChange(value)} className="text-sm px-4 py-2 whitespace-nowrap">
                                    {label}
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-72">
                        <Input label="Search" color="orange" icon={<MagnifyingGlassIcon className="h-5 w-5" />} onChange={handleSearchInputChange} />
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
                            {paginatedGames.map((game, index) => {
                                const { id, title, desc, status, date, tags, price, licence, devices, gameContent } = game;
                                const isLast = index === paginatedGames.length - 1;
                                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
                                const isExpanded = expandedGameId === id;
                                const isEditing = editingGameId === id;

                                return (
                                    <React.Fragment key={id}>
                                        <tr>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {title}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {desc}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {status}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {date}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                {isExpanded ? (
                                                    <div className='flex gap-2'>
                                                        <Button className='bg-pixi hover:shadow-pixi' onClick={() => handleEditClick(game)}><PencilIcon className="h-4 w-4" /></Button>
                                                        <Button color='red' variant='outlined' onClick={() => handleDeleteClick(id)}><TrashIcon className="h-4 w-4" /></Button>
                                                    </div>
                                                ) : (
                                                    <Button className='bg-pixi' onClick={() => handleExpandClick(id)}><MagnifyingGlassIcon className="h-4 w-4" /></Button>
                                                )}
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr>
                                                <td colSpan={5} className="p-4">
                                                    <div className="flex flex-col gap-4">
                                                        <Input
                                                            label="Titre"
                                                            value={isEditing ? editedGame.title : game.title}
                                                            name="title"
                                                            color="orange"
                                                            disabled={!isEditing}
                                                            onChange={handleInputChange}
                                                        />
                                                        <Input
                                                            label="Description"
                                                            value={isEditing ? editedGame.desc : game.desc}
                                                            name="desc"
                                                            color="orange"
                                                            disabled={!isEditing}
                                                            onChange={handleInputChange}
                                                        />
                                                        <div className="flex flex-col gap-2">
                                                            <Typography>Tags :</Typography>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(isEditing ? editedGame.tags : tags || []).map((tag, i) => (
                                                                    <Chip
                                                                        key={i}
                                                                        value={tag}
                                                                        variant="outlined"
                                                                        color='amber'
                                                                        onClose={isEditing ? () => handleRemoveTag(tag) : undefined}
                                                                    >
                                                                        {tag}
                                                                    </Chip>
                                                                ))}
                                                                {isEditing && (
                                                                    <Menu>
                                                                        <MenuHandler>
                                                                            <Button className="bg-pixi hover:shadow-none">Ajouter tag</Button>
                                                                        </MenuHandler>
                                                                        <MenuList>
                                                                            {availableTags.map((tag, i) => (
                                                                                <MenuItem key={i} onClick={() => handleAddTag(tag)}>
                                                                                    {tag}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </MenuList>
                                                                    </Menu>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Typography>Appareils compatibles :</Typography>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(isEditing ? editedGame.devices : devices || []).map((device, i) => (
                                                                    <Chip
                                                                        key={i}
                                                                        value={device}
                                                                        variant="outlined"
                                                                        color='amber'
                                                                        onClose={isEditing ? () => handleRemoveDevice(device) : undefined}
                                                                    >
                                                                        {device}
                                                                    </Chip>
                                                                ))}
                                                                {isEditing && (
                                                                    <Menu>
                                                                        <MenuHandler>
                                                                            <Button className="bg-pixi hover:shadow-none">Ajouter appareil</Button>
                                                                        </MenuHandler>
                                                                        <MenuList>
                                                                            {availableDevices.map((device, i) => (
                                                                                <MenuItem key={i} onClick={() => handleAddDevice(device)}>
                                                                                    {device}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </MenuList>
                                                                    </Menu>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Input
                                                            label="Prix"
                                                            value={isEditing ? editedGame.price : game.price}
                                                            name="price"
                                                            color="orange"
                                                            disabled={!isEditing}
                                                            onChange={handleInputChange}
                                                        />
                                                        <Input
                                                            label="Licence"
                                                            value={isEditing ? editedGame.licence : game.licence}
                                                            name="licence"
                                                            color="orange"
                                                            disabled={!isEditing}
                                                            onChange={handleInputChange}
                                                        />
                                                        <div className="flex flex-col gap-2">
                                                            <Typography>Image :</Typography>
                                                            <label
                                                                className={`cursor-pointer flex flex-col items-center justify-center mt-2 h-full bg-cover bg-center bg-no-repeat filter ${!isEditing && 'grayscale'}`}
                                                                style={{ backgroundImage: `url(${previewUrl})` }}
                                                            >
                                                                <ArrowUpTrayIcon className="h-10 w-10 text-white" />
                                                                <input type="file" className="hidden" disabled={!isEditing} onChange={handleImageUpload} />
                                                                <span className="text-white">Télécharger une image</span>
                                                            </label>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Typography>Fichier du jeu :</Typography>
                                                            <label className="cursor-pointer flex flex-col items-center">
                                                                <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                                                                <input type="file" className="hidden" disabled={!isEditing} onChange={handleGameFileUpload} />
                                                                <span className="text-gray-400">Télécharger le fichier du jeu</span>
                                                            </label>
                                                            {selectedGameFileName && <Typography>Fichier sélectionné: {selectedGameFileName}</Typography>}
                                                            {game.game && <Typography>Fichier du jeu: {game.game.split('/').pop()}</Typography>}
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <Typography variant="h6">Étapes du jeu :</Typography>
                                                            {(isEditing ? editedGame.gameContent : gameContent || []).map((step, i) => (
                                                                <div key={i} className="flex flex-col gap-2">
                                                                    <Input
                                                                        label="Titre de l'étape"
                                                                        color="orange"
                                                                        value={isEditing ? step.title : step.title}
                                                                        disabled={!isEditing}
                                                                        onChange={(e) => handleStepTitleChange(i, e.target.value)}
                                                                    />
                                                                    <Input
                                                                        label="Contenu de l'étape"
                                                                        color="orange"
                                                                        value={isEditing ? step.content : step.content}
                                                                        disabled={!isEditing}
                                                                        onChange={(e) => handleStepContentChange(i, e.target.value)}
                                                                    />
                                                                    <Input
                                                                        label="Temps (en minutes)"
                                                                        color="orange"
                                                                        value={isEditing ? step.time : step.time}
                                                                        disabled={!isEditing}
                                                                        onChange={(e) => handleStepTimeChange(i, e.target.value)}
                                                                    />
                                                                    {isEditing && (
                                                                        <Button variant="text" color="red" onClick={() => removeStep(i)}>Supprimer l'étape</Button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {isEditing && (
                                                                <div className="flex flex-col gap-2">
                                                                    <Typography variant="h6">Ajouter une étape :</Typography>
                                                                    <Input
                                                                        label="Titre de l'étape"
                                                                        color="orange"
                                                                        value={newStepTitle}
                                                                        onChange={(e) => setNewStepTitle(e.target.value)}
                                                                    />
                                                                    <Input
                                                                        label="Contenu de l'étape"
                                                                        color="orange"
                                                                        value={newStepContent}
                                                                        onChange={(e) => setNewStepContent(e.target.value)}
                                                                    />
                                                                    <Input
                                                                        label="Temps (en minutes)"
                                                                        color="orange"
                                                                        value={newStepTime}
                                                                        onChange={(e) => setNewStepTime(e.target.value)}
                                                                    />
                                                                    <Button variant="outlined" color="orange" onClick={addStep}>Ajouter l'étape</Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {isEditing && (
                                                            <Button variant="gradient" color="green" onClick={() => handleSaveClick(id)}>Enregistrer</Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {currentPage} sur {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button
                        className='bg-pixi shadow-none hover:shadow-pixi'
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </Button>
                    <Button
                        className='bg-pixi shadow-none hover:shadow-pixi'
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Suivant
                    </Button>
                </div>
            </CardFooter>
        </div>
    );
}