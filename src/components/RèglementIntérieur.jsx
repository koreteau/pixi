import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


export function ReglementIntérieur() {
    const [Pdf, setPdfUrl] = useState([]);

    useEffect(() => {
        const docs = firebase.storage();
        const pdfRef = docs.ref().child("docs/reglement-interieur.pdf");

        pdfRef.getDownloadURL().then((url) => {
            setPdfUrl(url);
        });
    }, []);

    return (
        <div style={{
            paddingLeft: "20%",
            paddingRight: "20%",
            paddingTop: "100px"
        }}>
            <div style={{ textAlign: "center" }}>
                <Typography variant="h2">Règlement Intérieur</Typography>
            </div>
            <div style={{
                paddingTop: "50px"
            }}>
                <Typography variant="p">Le présent règlement est arrété par le Conseil d'Administration du H.U.B le 10 novembre 2023</Typography>
            </div>
            <div style={{
                paddingTop: "50px"
            }}>
                <a href={Pdf}>Règlement Intérieur.pdf</a>
            </div>
        </div>
    );
}