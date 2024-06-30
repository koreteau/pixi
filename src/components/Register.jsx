import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Card, CardBody, CardFooter, Typography, Input, Button, Switch } from "@material-tailwind/react";
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

import firebase from "firebase/compat/app";

import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";



export function RegisterCard() {
    const [isHovered, setIsHovered] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSeller, setIsSeller] = useState(false);
    const [idNumber, setIdNumber] = useState("");

    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setSelectedImage(file);
        }
    };

    const registerWithEmailAndPasswordHandler = async (event, name, username, birthdate, email, password, isSeller, idNumber) => {
        event.preventDefault();

        try {
            const usernameSnapshot = await firebase.firestore().collection('users').where('username', '==', username).get();
            if (!usernameSnapshot.empty) {
                alert("Username already in use. Please choose another.");
                return;
            }

            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            const birthdateTimestamp = firebase.firestore.Timestamp.fromDate(new Date(birthdate));

            let profilePicture = "";
            if (selectedImage) {
                const storageRef = firebase.storage().ref();
                const fileExtension = selectedImage.name.split('.').pop();
                const userImageRef = storageRef.child(`img/userPicture/${user.uid}.${fileExtension}`);
                await userImageRef.put(selectedImage);

                profilePicture = userImageRef.name;
                const photoURL = await userImageRef.getDownloadURL();
                await user.updateProfile({ photoURL });
            }

            await firebase.firestore().collection('users').doc(user.uid).set({
                fullName: name,
                username,
                birthdate: birthdateTimestamp,
                profilePicture,
                isAdmin: false,
                isSeller,
                isActive: true,
                idNumber: isSeller ? idNumber : null
            });

            alert("Registration successful!");
            navigate('/login');
        } catch (error) {
            console.error("Error during registration:", error);
            alert(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <Typography variant="h3" className="pt-[2.5rem]">Inscrit toi !</Typography>
            <Typography variant="paragraph" className="pt-[1.25rem] pb-[2.5rem] font-semibold">Ravi d'apprendre à te connaître ! Inscris toi pour accéder à ton compte.</Typography>
            <Card className="w-96 my-[3rem]">
                <CardBody className="flex flex-col gap-4">
                    <div className="flex items-center justify-center">
                        <div className="relative mb-4 w-[8rem] h-[8rem] border-2 rounded-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                            {previewUrl && <img src={previewUrl} alt="Aperçu" className="w-full h-48 object-cover" />}
                            <label className="cursor-pointer mt-2 flex items-center justify-center">
                                <input type="file" className="hidden" onChange={handleImageUpload} />
                                {isHovered && <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />}
                            </label>
                        </div>
                    </div>
                    <Input label="Nom complet" size="lg" color="orange" value={name} onChange={(event) => setName(event.target.value)} />
                    <Input label="Identifiant" size="lg" color="orange" value={username} onChange={(event) => setUsername(event.target.value)} />
                    <Input label="Date de naissance" type="date" color="orange" value={birthdate} size="lg" onChange={(e) => setBirthdate(e.target.value)} />
                    <Input label="Email" size="lg" type="email" color="orange" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <Input label="Mot de passe" size="lg" type="password" color="orange" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <div className="flex items-center gap-4">
                        <Switch label="Vendeur" color="orange" checked={isSeller} onChange={() => setIsSeller(!isSeller)} />
                    </div>
                    {isSeller && (
                        <Input label="Numéro d'identification" size="lg" color="orange" value={idNumber} onChange={(event) => setIdNumber(event.target.value)} />
                    )}
                </CardBody>
                <CardFooter className="pt-0">
                    <Button onClick={(event) => { registerWithEmailAndPasswordHandler(event, name, username, birthdate, email, password, isSeller, idNumber) }} className="bg-pixi hover:shadow-none" fullWidth>
                        S'inscrire
                    </Button>
                    <Typography variant="small" className="mt-6 flex justify-center">
                        Déjà un compte ?
                        <Link to='/login'>
                            <Typography
                                as="a"
                                href="/signup"
                                variant="small"
                                color="blue-gray"
                                className="ml-1 font-bold"
                            >
                                Se connecter
                            </Typography>
                        </Link>
                    </Typography>
                </CardFooter>
            </Card>
        </div>
    );
}
