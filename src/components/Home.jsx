import React from "react";

import { Link } from "react-router-dom";

import { Typography, Button } from "@material-tailwind/react";

import slide from '../assets/slide.png'
import happyPixi from '../assets/pixi-happy.png'
import gemPixi from '../assets/pixi-gem.png'

import './styles.css';



export function Home() {
    return (
        <>
            <div className="flex flex-col items-center justify-center py-[5rem]">
                <div className="text-center pt-[2.5rem] sm:max-w-[30rem] md:max-w-[40rem] lg:max-w-[70rem]">
                <Typography variant="h3"  >LA PREMIÈRE PLATEFORME COMMUNAUTAIRE<br />DE SERIOUS GAMES</Typography>

                    <Typography  variant="paragraph" className="pt-[3.25rem] font-semibold">Nous offrons un espace dynamique où les créateurs de contenu peuvent partager leurs jeux novateurs<br /> et instructifs avec une communauté engagée. Que vous soyez un développeur talentueux ou un joueur curieux,<br /> rejoignez-nous pour découvrir, créer et apprendre ensemble sur notre plateforme interactive.</Typography>
                    <div className="pt-[3.5rem] items-center justify-center gap-2">
                        <Link to='/register'>
                            <Button className="bg-pixi hover:shadow-pixi my-1">Je fonce m'inscrire</Button>
                        </Link>
                        <Link to='/login'>
                            <Button variant="text" className="text-black hover:shadow-pixi my-1">Je fais déjà partie de la communauté</Button>
                        </Link>
                    </div>
                </div>
                <img src={slide} className="pt-20 w-[2rem]" />
            </div>
            <div className="flex flex-col items-center justify-center bg-pixi text-white">
                <div className="text-center pt-[2.5rem] sm:max-w-[30rem] md:max-w-[40rem] lg:max-w-[70rem]">
                    <Typography variant="h3">Sortir de l'apprentissage classique grâce à la communauté</Typography>
                    <Typography variant="small" className="pt-[2.25rem] font-semibold">Que vous soyez un étudiant cherchant à élargir vos horizons ou un professionnel désireux de rester à la pointe de votre domaine, notre communauté vous offre un espace pour explorer, grandir et transformer l'apprentissage en une expérience enrichissante et collaborative.</Typography>
                </div>
                <did className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-5 pt-[3.25rem]" >
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M9.283 4.002V12H7.971V5.338h-.065L6.072 6.656V5.385l1.899-1.383z"></path>
                        </svg>
                        <Typography variant="h4">Choisis ta formation</Typography>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.646 6.24v.07H5.375v-.064c0-1.213.879-2.402 2.637-2.402 1.582 0 2.613.949 2.613 2.215 0 1.002-.6 1.667-1.287 2.43l-.096.107-1.974 2.22v.077h3.498V12H5.422v-.832l2.97-3.293c.434-.475.903-1.008.903-1.705 0-.744-.557-1.236-1.313-1.236-.843 0-1.336.615-1.336 1.306Z"></path>
                        </svg>
                        <Typography variant="h4">Installe ta formation</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M7.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318Z"></path>
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8"></path>
                        </svg>
                        <Typography variant="h4">Lance le jeu vidéo</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M7.519 5.057c.22-.352.439-.703.657-1.055h1.933v5.332h1.008v1.107H10.11V12H8.85v-1.559H4.978V9.322c.77-1.427 1.656-2.847 2.542-4.265ZM6.225 9.281v.053H8.85V5.063h-.065c-.867 1.33-1.787 2.806-2.56 4.218Z"></path>
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8"></path>
                        </svg>
                        <Typography variant="h4">Poursuit les différentes<br /> quêtes</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8m15 0A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-8.006 4.158c-1.57 0-2.654-.902-2.719-2.115h1.237c.14.72.832 1.031 1.529 1.031.791 0 1.57-.597 1.57-1.681 0-.967-.732-1.57-1.582-1.57-.767 0-1.242.45-1.435.808H5.445L5.791 4h4.705v1.103H6.875l-.193 2.343h.064c.17-.258.715-.68 1.611-.68 1.383 0 2.561.944 2.561 2.585 0 1.687-1.184 2.806-2.924 2.806Z"></path>
                        </svg>
                        <Typography variant="h4">Fini tout les niveaux</Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-1-circle">
                            <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.21 3.855c1.612 0 2.515.99 2.573 1.899H9.494c-.1-.358-.51-.815-1.312-.815-1.078 0-1.817 1.09-1.805 3.036h.082c.229-.545.855-1.155 1.98-1.155 1.254 0 2.508.88 2.508 2.555 0 1.77-1.218 2.783-2.847 2.783-.932 0-1.84-.328-2.409-1.254-.369-.603-.597-1.459-.597-2.642 0-3.012 1.248-4.407 3.117-4.407Zm-.099 4.008c-.92 0-1.564.65-1.564 1.576 0 1.032.703 1.635 1.558 1.635.868 0 1.553-.533 1.553-1.629 0-1.06-.744-1.582-1.547-1.582"></path>
                        </svg>
                        <Typography variant="h4">Fini tout les niveaux</Typography>
                    </div>
                </did>
            </div>
            <div>
                <div className="grid grid-cols-2 gap-4 custom-sm custom-md py-[3rem] max-w-[100rem] justify-center">
                    <div className="flex items-center p-[5rem]">
                        <div>
                            <Typography variant="h3">DES SERIOUS GAMES CRÉÉS PAR DES PASSIONNÉS, POUR CEUX QUI ONT SOIF D'APPRENDRE</Typography>
                            <Typography variant="small" className="pt-[1.25rem] font-semibold">Chaque jeu correspond à une catégorie spécifique d'apprentissage et est rigoureusement vérifié et validé avant sa publication. Notre équipe s'assure que chaque expérience offre un contenu éducatif de qualité, conçu pour stimuler l'apprentissage et l'engagement des joueurs.</Typography>
                            <div className="pt-[1.25rem]">
                                <Link to='/catalog'>
                                    <Button className="bg-pixi hover:shadow-pixi">Découvrir le catalogue</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <img src={happyPixi} className="pt-10 w-[20rem] " />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 custom-sm custom-md py-[3rem]">
                    <div className="flex items-center justify-center">
                        <img src={gemPixi} className="pt-10 w-[20rem] " />
                    </div>
                    <div className="flex items-center p-[5rem]">
                        <div>
                            <Typography variant="h3">CRÉATEUR DE JEUX ?</Typography>
                            <Typography variant="small" className="pt-[1.25rem] font-semibold">Sur notre plateforme, vous avez l'opportunité de devenir le créateur de votre propre serious game. Définissez le prix de votre création et bénéficiez d'un contrôle total sur votre œuvre. Mais ce n'est pas tout : écoutez attentivement les retours de vos joueurs et utilisez ces précieuses informations pour affiner et améliorer votre jeu, offrant ainsi une expérience encore plus captivante et enrichissante.</Typography>
                            <div className="pt-[1.25rem]">
                                <Link to='/catalog'>
                                    <Button className="bg-pixi hover:shadow-pixi">Devenir vendeur</Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-pixi text-white">
                <div className="text-center pt-[2.5rem] sm:max-w-[30rem] md:max-w-[40rem] lg:max-w-[70rem]">
                    <Typography variant="h3">Les avis de nos gamers</Typography>
                </div>
                <did className="grid grid-cols-3 gap-4 custom-sm custom-md custom-lg py-[3rem]">
                    <div className="text-center gap-2">
                        <Typography className="font-semibold italic">"Une expérience vraiment unique! J'ai adoré la possibilité de créer mon propre serious game et de le partager avec d'autres passionnés. Les retours des joueurs m'ont aidé à affiner mon jeu pour offrir une expérience encore meilleure. Merci à cette plateforme pour cette opportunité incroyable!"</Typography>
                        <Typography className="font-semibold">Sarah123</Typography>
                    </div>
                    <div className="text-center gap-2">
                        <Typography className="font-semibold italic">"En tant que joueur, j'apprécie vraiment la diversité des jeux disponibles sur cette plateforme. Chaque jeu est soigneusement conçu pour offrir une expérience éducative immersive. J'ai également été impressionné par la réactivité des créateurs aux retours des joueurs. C'est un excellent moyen d'apprendre de manière ludique!"</Typography>
                        <Typography className="font-semibold">GamerPro99</Typography>
                    </div>
                    <div className="text-center gap-2">
                        <Typography className="font-semibold italic">"J'ai toujours été passionné par l'idée de créer mes propres jeux, et cette plateforme m'a offert cette opportunité. La possibilité de fixer mon propre prix et de modifier mon jeu en fonction des retours des joueurs est tout simplement géniale. Je recommande vivement cette plateforme à tous ceux qui partagent ma passion pour les jeux éducatifs!"</Typography>
                        <Typography className="font-semibold">GameDev</Typography>
                    </div>
                </did>
            </div>
        </>
    );
}
