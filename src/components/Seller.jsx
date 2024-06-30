import React from "react";

import { Link } from "react-router-dom";

import { Typography, Button } from "@material-tailwind/react";

import happyPixi from '../assets/pixi-happy.png'



export function Seller() {
    return (
        <>
            <div className="flex flex-col items-center justify-center py-[5rem]">
                <img src={happyPixi} className="pt-10 w-[10rem]" />
                <div className="text-center pt-[2.5rem] sm:max-w-[30rem] md:max-w-[40rem] lg:max-w-[70rem]">
                    <Typography variant="h3">VOUS ETES UN CRÉATEUR DE JEUX ?</Typography>
                    <Typography className="pt-[1.25rem] font-semibold">Si vous êtes un créateur de jeux vidéo éducatifs en quête d'une plateforme dynamique pour partager et vendre vos créations, notre plateforme communautaire est l'endroit idéal pour vous. Nous offrons un espace où vous pouvez non seulement commercialiser vos jeux, mais aussi interagir avec une communauté passionnée de joueurs et d'éducateurs.</Typography>
                    <div className="pt-[3.5rem] flex items-center justify-center gap-2">
                        <Link to='/catalog/new'>
                            <Button className="bg-pixi hover:shadow-pixi">Je veux partager mes jeux</Button>
                        </Link>
                        <Link to='/login'>
                            <Button variant="text" className="text-black hover:shadow-pixi">Je fais déjà partie de la communauté</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-pixi text-white">
                <div className="text-center pt-[3.5rem] sm:max-w-[30rem] md:max-w-[40rem] lg:max-w-[70rem]">
                    <Typography variant="h3">Créé, partage, améliore</Typography>
                    <Typography variant="small" className="pt-[2.25rem] font-semibold">Vous pouvez commencer par concrétiser vos idées en utilisant nos outils conviviaux et nos ressources pour le développement de jeux. Ensuite, une fois vos jeux prêts, vous pouvez les partager avec une communauté engagée d'éducateurs et de joueurs qui apprécieront vos efforts et vous fourniront des retours précieux. Enfin, grâce à ce feedback, vous pourrez améliorer continuellement vos jeux, en les adaptant aux besoins et aux préférences des utilisateurs. </Typography>
                </div>
                <did className="grid grid-cols-3 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-[3rem]">
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383z"></path>
                        </svg>
                        <Typography variant="h4">Créer ton jeux vidéo</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.646 6.24v.07H5.375v-.064c0-1.213.879-2.402 2.637-2.402 1.582 0 2.613.949 2.613 2.215 0 1.002-.6 1.667-1.287 2.43l-.096.107-1.974 2.22v.077h3.498V12H5.422v-.832l2.97-3.293c.434-.475.903-1.008.903-1.705 0-.744-.557-1.236-1.313-1.236-.843 0-1.336.615-1.336 1.306Z"></path>
                        </svg>
                        <Typography variant="h4">Poste le et donne un prix</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M7.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318Z"></path>
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8"></path>
                        </svg>
                        <Typography variant="h4">Les gamers installe ton jeux</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M7.519 5.057c.22-.352.439-.703.657-1.055h1.933v5.332h1.008v1.107H10.11V12H8.85v-1.559H4.978V9.322c.77-1.427 1.656-2.847 2.542-4.265ZM6.225 9.281v.053H8.85V5.063h-.065c-.867 1.33-1.787 2.806-2.56 4.218Z"></path>
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8"></path>
                        </svg>
                        <Typography variant="h4">Chaque gamer te donnes un feedback</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m15 0A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-8.006 4.158c-1.57 0-2.654-.902-2.719-2.115h1.237c.14.72.832 1.031 1.529 1.031.791 0 1.57-.597 1.57-1.681 0-.967-.732-1.57-1.582-1.57-.767 0-1.242.45-1.435.808H5.445L5.791 4h4.705v1.103H6.875l-.193 2.343h.064c.17-.258.715-.68 1.611-.68 1.383 0 2.561.944 2.561 2.585 0 1.687-1.184 2.806-2.924 2.806Z"></path>
                        </svg>
                        <Typography variant="h4">Améliore ton jeux</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.21 3.855c1.612 0 2.515.99 2.573 1.899H9.494c-.1-.358-.51-.815-1.312-.815-1.078 0-1.817 1.09-1.805 3.036h.082c.229-.545.855-1.155 1.98-1.155 1.254 0 2.508.88 2.508 2.555 0 1.77-1.218 2.783-2.847 2.783-.932 0-1.84-.328-2.409-1.254-.369-.603-.597-1.459-.597-2.642 0-3.012 1.248-4.407 3.117-4.407Zm-.099 4.008c-.92 0-1.564.65-1.564 1.576 0 1.032.703 1.635 1.558 1.635.868 0 1.553-.533 1.553-1.629 0-1.06-.744-1.582-1.547-1.582"></path>
                        </svg>
                        <Typography variant="h4">Recommence</Typography>
                    </div>
                </did>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 py-[3rem] max-w-[100rem] justify-center">
                <div className="flex items-center p-[5rem]">
                    <div>
                        <Typography variant="h3">TU PRÉFÈRE JOUER AUX JEUX ?</Typography>
                        <Typography variant="small" className="pt-[1.25rem] font-semibold">Chaque jeu correspond à une catégorie spécifique d'apprentissage et est rigoureusement vérifié et validé avant sa publication. Notre équipe s'assure que chaque expérience offre un contenu éducatif de qualité, conçu pour stimuler l'apprentissage et l'engagement des joueurs.</Typography>
                        <div className="pt-[1.25rem]">
                            <Link to='/catalog'>
                                <Button className="bg-pixi hover:shadow-pixi">Découvrir le catalogue</Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <img src={happyPixi} className="pt-10 w-[25rem] " />
                </div>
            </div>
        </>
    )
}