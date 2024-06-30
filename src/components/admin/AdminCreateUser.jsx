import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, CardHeader, CardBody, CardFooter, Input, Switch, Typography } from '@material-tailwind/react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

export function AdminCreateUser() {
    const [isHovered, setIsHovered] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [idNumber, setIdNumber] = useState('');
    const [isActive, setIsActive] = useState(true);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setSelectedImage(file);
        }
    };

    const handleSubmit = async () => {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            const birthdateTimestamp = firebase.firestore.Timestamp.fromDate(new Date(birthdate));

            let profilePicture = '';
            if (selectedImage) {
                const storageRef = firebase.storage().ref();
                const fileExtension = selectedImage.name.split('.').pop();
                const userImageRef = storageRef.child(`img/userPicture/${user.uid}.${fileExtension}`);
                await userImageRef.put(selectedImage);

                profilePicture = await userImageRef.getDownloadURL();
            }

            // Enregistrement des informations supplémentaires dans Firestore
            await firebase.firestore().collection('users').doc(user.uid).set({
                fullName: name,
                username,
                birthdate: birthdateTimestamp,
                email,
                profilePicture,
                isAdmin,
                isSeller,
                idNumber: isSeller ? idNumber : null,
                isActive // Ajout de isActive dans le document Firestore
            });

            alert('User created successfully!');
            // Redirection ou navigation vers une autre page si nécessaire
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user. Please try again.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <CardHeader floated={false} shadow={false} className="rounded-none flex flex-col items-center justify-center py-[2rem]">
                <Typography variant="h4">
                    Create New User
                </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
                <div className="flex items-center justify-center">
                    <div className="relative mb-4 w-[8rem] h-[8rem] border-2 rounded-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                        {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />}
                        <label className="cursor-pointer mt-2 flex items-center justify-center">
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                            {isHovered && <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />}
                        </label>
                    </div>
                </div>
                <Input label="Nom complet" size="lg" color="pixi" value={name} onChange={(event) => setName(event.target.value)} />
                <Input label="Identifiant" size="lg" color="pixi" value={username} onChange={(event) => setUsername(event.target.value)} />
                <Input label="Date de naissance" type="date" value={birthdate} size="lg" onChange={(e) => setBirthdate(e.target.value)} />
                <Input label="Email" size="lg" type="email" color="lightBlue" value={email} onChange={(event) => setEmail(event.target.value)} />
                <Input label="Mot de passe" size="lg" type="password" color="lightBlue" value={password} onChange={(event) => setPassword(event.target.value)} />
                <Switch label="Administrateur" checked={isAdmin} onChange={(event) => setIsAdmin(event.target.checked)} />
                <div className="flex items-center gap-4">
                    <Switch label="Vendeur" checked={isSeller} onChange={() => setIsSeller(!isSeller)} />
                    <Switch label="Actif" checked={isActive} onChange={() => setIsActive(!isActive)} /> {/* Switch pour isActive */}
                </div>
                {isSeller && (
                    <Input label="Numéro d'identification" size="lg" color="lightBlue" value={idNumber} onChange={(event) => setIdNumber(event.target.value)} />
                )}
            </CardBody>
            <CardFooter className='flex gap-2'>
                <Link to='/admin/settings/users/'>
                    <Button variant="outlined" color="red">
                        <span>Annuler</span>
                    </Button>
                </Link>
                <Button variant="gradient" color="green" onClick={handleSubmit}>
                    <span>Créer l'utilisateur</span>
                </Button>
            </CardFooter>
        </div>
    );
}
