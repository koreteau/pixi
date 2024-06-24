import { useEffect, useState } from "react";

import { Link, useParams } from 'react-router-dom';

import { Avatar, Spinner, Typography, Button, Chip, Rating, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';



export function SinglePageLearning() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [author, setAuthor] = useState({});
    const [gameContent, setGameContent] = useState([]);

    const fetchProjectPictureURL = async (pictureName) => {
        try {
            const storageRef = firebase.storage().ref();
            const url = await storageRef.child(`img/gamePicture/${pictureName}`).getDownloadURL();
            return url;
        } catch (error) {
            console.error('Error fetching project picture URL:', error);
            return null;
        }
    };

    const fetchProfilePictureURL = async (pictureName) => {
        try {
            const storageRef = firebase.storage().ref();
            const url = await storageRef.child(`img/userPicture/${pictureName}`).getDownloadURL();
            return url;
        } catch (error) {
            console.error('Error fetching profile picture URL:', error);
            return null;
        }
    };

    const fetchUserNameAndProfilePicture = async (userId) => {
        try {
            const userDoc = await firebase.firestore().collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const profilePictureURL = await fetchProfilePictureURL(userData.profilePicture);
                return {
                    username: userData.username,
                    profilePictureURL
                };
            } else {
                console.error('No such user!');
                return {
                    username: 'Unknown User',
                    profilePictureURL: null
                };
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            return {
                username: 'Unknown User',
                profilePictureURL: null
            };
        }
    };

    const fetchAuthorDetails = async (userId) => {
        try {
            const userDetails = await fetchUserNameAndProfilePicture(userId);
            setAuthor(userDetails);
        } catch (error) {
            console.error('Error fetching author details:', error);
            setAuthor({
                username: 'Unknown User',
                profilePictureURL: null
            });
        }
    };

    const fetchComments = async (gameId) => {
        try {
            const db = firebase.firestore();
            const commentsSnapshot = await db.collection('games').doc(gameId).collection('comments').orderBy('date', 'asc').get();
            const commentsData = await Promise.all(commentsSnapshot.docs.map(async (doc) => {
                const commentData = doc.data();
                const userDetails = await fetchUserNameAndProfilePicture(commentData.author);
                return {
                    id: doc.id,
                    ...commentData,
                    authorName: userDetails.username,
                    authorProfilePictureURL: userDetails.profilePictureURL
                };
            }));
            setComments(commentsData);
        } catch (error) {
            console.error('Error retrieving comments:', error);
        }
    };

    const fetchRating = async (gameId) => {
        try {
            const db = firebase.firestore();
            const ratesSnapshot = await db.collection('games').doc(gameId).collection('rates').get();
            const rates = ratesSnapshot.docs.map(doc => doc.data().rate);
            const averageRating = rates.length ? (rates.reduce((acc, rate) => acc + rate, 0) / rates.length) : 0;
            setRating(averageRating);
        } catch (error) {
            console.error('Error retrieving rating:', error);
        }
    };

    const fetchGameContent = async (gameId) => {
        try {
            const db = firebase.firestore();
            const contentSnapshot = await db.collection('games').doc(gameId).collection('gameContent').orderBy('order', 'asc').get();
            const contentData = contentSnapshot.docs.map(doc => doc.data());
            setGameContent(contentData);
        } catch (error) {
            console.error('Error retrieving game content:', error);
        }
    };

    useEffect(() => {
        const db = firebase.firestore();
        const fetchData = async () => {
            try {
                const gameDoc = await db.collection('games').doc(id).get();
                if (gameDoc.exists) {
                    const gameData = gameDoc.data();
                    const imageURL = await fetchProjectPictureURL(gameData.gamePicture);
                    await fetchAuthorDetails(gameData.author);
                    setGame({
                        id: gameDoc.id,
                        ...gameData,
                        imageURL
                    });
                    await fetchComments(gameDoc.id);
                    await fetchRating(gameDoc.id);
                    await fetchGameContent(gameDoc.id);
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error retrieving game:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const renderStars = (rating) => {
        const validRating = Math.max(0, Math.min(Math.round(rating), 5));
        return (
            <div className="flex gap-2">
                <Typography className="font-medium">{Math.max(0, Math.min(rating, 5))}</Typography>
                <Rating value={validRating} readonly />
            </div>
        );
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('fr-FR', options);
        const timeString = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `le ${dateString} à ${timeString}`;
    };

    const renderGameContent = () => {
        return gameContent.map((content, index) => (
            <div key={index} className="my-4 grid grid-cols-5">
                {index % 2 === 0 ? (
                    <>
                        <div className="p-4">
                            <Typography variant="h5">{content.order}</Typography>
                        </div>
                        <div className="p-4 col-span-4">
                            <Typography variant="body1">{content.title} :</Typography>
                            <Typography variant="body1">{content.content}</Typography>
                            <Typography variant="body1">Durée {content.time} min</Typography>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-4 col-span-4">
                            <Typography variant="body1">{content.title} :</Typography>
                            <Typography variant="body1">{content.content}</Typography>
                            <Typography variant="body1">Durée {content.time} min</Typography>
                        </div>
                        <div className="p-4">
                            <Typography variant="h5">{content.order}</Typography>
                        </div>
                    </>
                )}
            </div>
        ));
    };

    return (
        <>
            {loading ? (
                <div className='flex flex-col items-center justify-center min-h-screen'>
                    <Spinner className="h-20 w-20" color="amber" />
                </div>
            ) : (
                game ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="py-[5rem] sm:max-w-[30rem] md:max-w-[45rem] lg:max-w-[80rem]">
                            <Link to='/catalog'>
                                <Button variant="text" color="amber">
                                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-center pt-[1rem] sm:max-w-[30rem] md:max-w-[40rem] lg:max-w-[80rem]">
                                    <Typography variant="h3">{game.title}</Typography>
                                    <Typography variant="paragraph" className="pt-[1.25rem] font-semibold">{game.desc}</Typography>
                                    <div className="pt-4">{renderStars(rating)}</div>
                                </div>
                                <img src={game.imageURL} className="pt-10 sm:w-[30rem] md:w-[40rem] lg:w-[55rem]" alt={game.title} />
                            </div>

                            <div className="bg-[#f0f0f0] my-[2rem] p-[2rem] flex items-center justify-between">
                                <div>
                                    <div className="flex pb-[1rem]">
                                        {game.tags && game.tags.map((tag, index) => (
                                            <Chip key={index} variant="outlined" value={tag} className="m-1 w-fit" color="amber" />
                                        ))}
                                    </div>
                                    <Avatar
                                        variant="circular"
                                        size="lg"
                                        alt="Profile Picture"
                                        className="p-0.5"
                                        src={author.profilePictureURL || ""}
                                    />
                                    <Link to={`/user/${author.username}`}>
                                        <Typography variant="lead"><strong>{author.username}</strong></Typography>
                                    </Link>
                                </div>
                                <div className="align-right">
                                    <Typography className="font-normal"><strong>{game.price ? game.price + " €" : "Formation Gratuite"}</strong></Typography>
                                    <Button className="bg-pixi shadow-none hover:shadow-pixi">Acheter</Button>
                                </div>
                            </div>
                            <div>
                                <Typography variant="h5">Contenu du Jeu</Typography>
                                {renderGameContent()}
                            </div>
                            <div>
                                <Typography variant="h5">Commentaires</Typography>
                                {comments.length === 0 ? (
                                    <div className="p-2 border-b border-gray-200">
                                        <p>Aucun commentaire pour le moment</p>
                                    </div>
                                ) : (
                                    comments.map(comment => (
                                        <Card key={comment.id} color="transparent" shadow={false} className="w-full">
                                            <CardHeader
                                                color="transparent"
                                                floated={false}
                                                shadow={false}
                                                className="flex items-center gap-4 pt-0 pb-8 w-full"
                                            >
                                                <Avatar
                                                    variant="circular"
                                                    size="lg"
                                                    alt="Profile Picture"
                                                    className="p-0.5"
                                                    src={comment.authorProfilePictureURL || ""}
                                                />
                                                <div className="flex w-full flex-col gap-0.5">
                                                    <div className="flex items-center justify-between">
                                                        <Link to={`/user/${comment.authorName}`}>
                                                            <Typography variant="h5" color="blue-gray">
                                                                {comment.authorName}
                                                            </Typography>
                                                        </Link>
                                                    </div>
                                                    <Typography color="blue-gray">{formatDate(comment.date)}</Typography>
                                                </div>
                                            </CardHeader>
                                            <CardBody className="mb-6 p-0">
                                                <Typography>{comment.content}</Typography>
                                            </CardBody>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Ce jeu n'existe pas</div>
                )
            )}
        </>
    );
}