import React from "react";
import { Typography } from "@material-tailwind/react";



export function MentionLegales () {
    return (
        <div style={{
            paddingLeft:"20%",
            paddingRight:"20%",
            paddingTop:"100px"
        }}>
            <div style={{ textAlign: "center" }}>
                <Typography variant="h2">Mentions Légales</Typography>
            </div>
            <div style={{
                paddingTop:"50px"
            }}>
                <b><p>Droits de propriété intellectuelle</p></b>
                <p>Le présent site est la propriété du High-tech Upbringing Bureau, qui en est l&apos;auteur au sens des
                    articles L.111.1 et suivants du Code de la propriété intellectuelle.</p>
                <p>Les photographies, textes, slogans, dessins, images, séquences animées sonores ou non ainsi que
                    toutes œuvres intégrées dans le site sont la propriété du High-tech Upbringing Bureau ou
                    de tiers ayant autorisé le High-tech Upbringing Bureau à les utiliser.</p>
                <p>La reproduction, sur un support papier ou informatique, du site est autorisée sous réserve qu&apos;elle
                    soit strictement réservée à un usage personnel, excluant tout usage à des fins publicitaires et/ou
                    commerciales et/ou d&apos;informations, et qu&apos;elle soit conforme aux dispositions de l&apos;article L122-5 du
                    Code de la Propriété Intellectuelle.</p>
                <p>À l&apos;exception des dispositions ci-dessus, toute reproduction, représentation, utilisation ou modification,
                    par quelque procédé que ce soit et sur quelque support que ce soit, de tout ou partie du site, de tout
                    ou partie des contenus qui le composent, sans avoir obtenu l&apos;autorisation préalable du High-tech Upbringing
                    Bureau, est strictement interdite et constitue un délit de contrefaçon.
                </p>
            </div>
            <div style={{
                paddingTop:"50px"
            }}>
                <b><p>Politique de protection des données</p></b>
                <p>Nous tenons à préciser que ce site n&apos;utilise aucun dispositif de suivi, y compris les cookies,
                    et ne collecte aucune information personnelle identifiable conformément à la Loi « Informatique et Libertés »
                    n°78-17 du 6 janvier 1978.</p>
            </div>
            <div style={{
                paddingTop:"50px"
            }}>
                <b><p>Liens hypertexte</p></b>
                <p>La mise en place d&apos;un lien hypertexte vers notre site nécessite une autorisation préalable écrite. Faites votre
                    demande à : paris-hub@epitech.digital.</p>
                <p>Le High-tech Upbringing Bureau ne peut en aucun cas être tenu pour responsables de la mise à disposition des
                    sites qui font l&apos;objet d’un lien hypertexte à partir du site XXX et ne peut supporter aucune responsabilité
                    sur le contenu disponible sur ces sites ou à partir de ces sites.</p>
            </div>
            <div style={{
                paddingTop:"50px"
            }}>
                <b><p>High-tech Upbringing Bureau</p></b>
                <p>95 Avenue Parmentier<br />75011, Paris 11</p>
                <br />
                <p>Email : <a href='mailto:paris-hub@epitech.digital'>paris-hub@epitech.digital</a></p>
                <br />
                <p>Directeur de la publication : Corto Colloc<br />Hébergement : Firebase<br />Maintenance : High-tech Upbringing Bureau</p>
            </div>
            <div style={{
                paddingTop:"50px"
            }}>
                <b><p>Attention : La responsabilité du High-tech Upbringing Bureau et de son hébergeur Web, quant à 
                    l’utilisation ou l’interprétation par l’internaute des informations et outils diffusés sur son site, ne
                    pourra en aucun cas être engagée.</p></b>
            </div>
        </div>
    )
}