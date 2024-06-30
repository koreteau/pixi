import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, CardFooter, Typography, Input } from "@material-tailwind/react";
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

export function AccountPurchases() {
    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPurchases, setFilteredPurchases] = useState([]);

    const fetchGamePictureURL = async (pictureName) => {
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
        const fetchUserData = async () => {
            const user = firebase.auth().currentUser;
            if (user) {
                try {
                    const db = firebase.firestore();
                    const storage = firebase.storage();
                    const purchasesSnapshot = await db.collection('users').doc(user.uid).collection('purchases').orderBy('date', 'asc').get();
                    const purchasesData = await Promise.all(purchasesSnapshot.docs.map(async (doc) => {
                        const purchaseData = doc.data();
                        const gameDoc = await db.collection('games').doc(purchaseData.game).get();
                        const gameData = gameDoc.data();

                        if (!gameData.game) {
                            console.warn(`No path defined for game ${gameData.title}`);
                            return null;
                        }

                        const fileRef = storage.ref().child(gameData.game);
                        const fileUrl = await fileRef.getDownloadURL();
                        const imageURL = await fetchGamePictureURL(gameData.gamePicture);

                        return {
                            id: doc.id,
                            ...purchaseData,
                            gameTitle: gameData.title,
                            gameImageUrl: imageURL,
                            gameFileUrl: fileUrl,
                        };
                    }));

                    const validPurchases = purchasesData.filter(purchase => purchase !== null);
                    setPurchases(validPurchases);
                    setFilteredPurchases(validPurchases);
                    setLoading(false);
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

    const handleSearchInputChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = purchases.filter(purchase =>
            purchase.gameTitle.toLowerCase().includes(term)
        );
        setFilteredPurchases(filtered);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='px-5 pt-5'>
            <div className="flex flex-col items-center justify-center">
                <Typography>Mes achats</Typography>
                <Input
                    color="orange"
                    type="text"
                    className="w-[48] bg-white"
                    containerProps={{ className: "min-w-0" }}
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Rechercher par titre"
                />
            </div>
            <div className="grid grid-cols-1 custom-sm custom-sm-max-w custom-md custom-md-max-w custom-lg custom-lg-max-w gap-4 mt-4 w-full">
                {filteredPurchases.map((purchase) => (
                    <Card key={purchase.id} className="max-w-[24rem] overflow-hidden">
                        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 rounded-none">
                            <img src={purchase.gameImageUrl} alt="project illustration" className="w-full" />
                        </CardHeader>
                        <CardBody>
                            <Typography variant="h4" color="blue-gray">
                                {purchase.gameTitle}
                            </Typography>
                            <Typography color="gray" className="mt-3 font-semibold">
                                Acheté le {purchase.date.toDate().toLocaleDateString()}
                            </Typography>
                        </CardBody>
                        <CardFooter className="flex items-center justify-between">
                            <Link to={`/catalog/${purchase.game}`}>
                                <Button className="bg-pixi shadow-none hover:shadow-pixi">Voir cette formation</Button>
                            </Link>
                            <ArrowDownTrayIcon
                                className="h-8 hover:bg-gray-200"
                                onClick={() => window.open(purchase.gameFileUrl, '_blank')}
                            />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
