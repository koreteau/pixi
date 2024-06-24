import React from "react";

import { Link, useNavigate } from "react-router-dom";

import { Card, CardHeader, CardBody, CardFooter, Typography, Input, Button } from "@material-tailwind/react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import logo from '../assets/logo.png'



export function LoginCard() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate()

    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((useCredential) => {
                alert("Connexion réussie");
                navigate('/account')
            })
            .catch((error) => {
                console.log(error);
                alert(error.message);
            });
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <Typography variant="h3" className="pt-[2.5rem]">Connecte toi !</Typography>
            <Typography variant="paragraph" className="pt-[1.25rem] pb-[2.5rem] font-semibold">Ravi de te revoir ! Connecte toi pour accéder à ton compte.</Typography>
            <Card className="w-96 my-[3rem]">
                <CardBody className="flex flex-col gap-4">
                    <img src={logo} />
                    <Input label="Email" size="lg" type="email" color="lightBlue" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <Input label="Mot de passe" size="lg" type="password" color="lightBlue" value={password} onChange={(event) => setPassword(event.target.value)} />
                </CardBody>
                <CardFooter className="pt-0">
                    <Button onClick={(event) => { signInWithEmailAndPasswordHandler(event, email, password) }} className="bg-pixi hover:shadow-none" fullWidth>
                        Se Connecter
                    </Button>
                    <Typography variant="small" className="mt-6 flex justify-center">
                        Pas de compte ?
                        <Link to='/register'>
                            <Typography
                                as="a"
                                href="/signup"
                                variant="small"
                                color="blue-gray"
                                className="ml-1 font-bold"
                            >
                                Contacter l&apos;administrateur
                            </Typography>
                        </Link>
                    </Typography>
                </CardFooter>
            </Card>
        </div>
    );
}