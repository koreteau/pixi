import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Typography, Select, Option } from "@material-tailwind/react";
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

export function Catalog() {
    const [games, setGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [filterTag, setFilterTag] = useState("");
    const [filterDevice, setFilterDevice] = useState("");
    const [tags, setTags] = useState([]);
    const [devices, setDevices] = useState([]);

    const fetchProjectPictureURL = async (pictureName) => {
        try {
            const storageRef = firebase.storage().ref();
            const url = await storageRef.child(`img/gamePicture/${pictureName}`).getDownloadURL();
            return url;
        } catch (error) {
            console.error('Error fetching profile picture URL:', error);
            return null;
        }
    };

    useEffect(() => {
        const db = firebase.firestore();
        const fetchData = async () => {
            try {
                const gamesSnapshot = await db.collection('games').where('status', '==', 'active').get();
                const gamesData = await Promise.all(gamesSnapshot.docs.map(async (doc) => {
                    const gameData = doc.data();
                    const imageURL = await fetchProjectPictureURL(gameData.gamePicture);
                    return {
                        id: doc.id,
                        ...gameData,
                        imageURL
                    };
                }));
                setGames(gamesData);
                const tagsSet = new Set();
                const devicesSet = new Set();
                gamesData.forEach(game => {
                    if (game.tags) {
                        game.tags.forEach(tag => tagsSet.add(tag));
                    }
                    if (game.devices) {
                        game.devices.forEach(device => devicesSet.add(device));
                    }
                });
                setTags(Array.from(tagsSet));
                setDevices(Array.from(devicesSet));
            } catch (error) {
                console.error('Error retrieving games:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let results = games;
        if (searchTerm.trim() !== "") {
            const normalizedSearchTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            results = results.filter((game) => {
                const normalizedTitle = game.title ? game.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
                return normalizedTitle.includes(normalizedSearchTerm);
            });
        }
        if (filterTag !== "") {
            results = results.filter((game) => game.tags && game.tags.includes(filterTag));
        }
        if (filterDevice !== "") {
            results = results.filter((game) => game.devices && game.devices.includes(filterDevice));
        }
        setSearchResults(results);
    }, [searchTerm, filterTag, filterDevice, games]);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (value) => {
        setFilterTag(value);
    };

    const handleDeviceFilterChange = (value) => {
        setFilterDevice(value);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <Typography variant="h3" className="pt-[3rem] ">Le catalogue des formations</Typography>
            <Typography variant="paragraph" className="pt-[0.5rem] font-semibold">Les développeurs ont consacré un temps précieux à la création de ces jeux vidéo éducatifs. Découvrez toutes les formations disponibles ci-dessous.</Typography>
            <div className="grid grid-cols-1 custom-sm custom-sm-max-w custom-md custom-md-max-w custom-lg custom-lg-max-w gap-4 mt-4 w-full lg:max-w-[48rem] m-[2.5rem]">
                <Input
                    color="orange"
                    type="text"
                    className="w-full bg-white"
                    containerProps={{ className: "min-w-0" }}
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Rechercher par titre"
                />
                <div className="max-w-5">
                    <Select
                        color="orange"
                        value={filterTag}
                        onChange={(e) => handleFilterChange(e)}
                        className="w-full bg-white"
                    >
                        <Option value="">Toutes les catégories</Option>
                        {tags.map((tag, index) => (
                            <Option key={index} value={tag}>{tag}</Option>
                        ))}
                    </Select>
                </div>
                <div className="max-w-5">
                    <Select
                        color="orange"
                        value={filterDevice}
                        onChange={(e) => handleDeviceFilterChange(e)}
                        className="w-full bg-white"
                    >
                        <Option value="">Tous les appareils</Option>
                        {devices.map((device, index) => (
                            <Option key={index} value={device}>{device}</Option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 custom-sm custom-sm-max-w custom-md custom-md-max-w custom-lg custom-lg-max-w gap-4 mt-4 w-full ">
                {searchResults.map((game) => (
                    <Card key={game.id} className="max-w-[24rem] overflow-hidden">
                        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 rounded-none">
                            <img src={game.imageURL} alt="project illustration" className="w-full" />
                        </CardHeader>
                        <CardBody>
                            <Typography variant="h4" color="blue-gray">
                                {game.title}
                            </Typography>
                            <Typography color="gray" className="mt-3 font-semibold">
                                {game.desc}
                            </Typography>
                        </CardBody>
                        <CardFooter className="flex items-center justify-between">
                            <Link to={`/catalog/${game.id}`}>
                                <Button className="bg-pixi shadow-none hover:shadow-pixi">Voir cette formation</Button>
                            </Link>
                            <Typography className="font-normal">{game.price ? game.price + " €" : "Formation Gratuite"}</Typography>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
