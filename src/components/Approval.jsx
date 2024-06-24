import React from 'react';

import { Link } from 'react-router-dom';

import { Button, Typography } from '@material-tailwind/react';



export function Approval () {
    return (
        <div className="flex flex-col items-center justify-center py-[5rem]">
                <div className="text-center pt-[2.5rem] sm:max-w-[30rem] md:max-w-[40rem] lg:max-w-[70rem]">
                    <Typography variant="h3">La demande de push de ton  jeux à bien été prise en compte </Typography>
                    <Typography variant="paragraph" className="pt-[1.25rem] font-semibold">ta formation seras disponible à tout les gameurs une fois la vérification terminer</Typography>
                    <div className="pt-[2.5rem] flex items-center justify-center gap-2">
                        <Link to='/account'>
                            <Button className="bg-pixi hover:shadow-pixi">Continuer</Button>
                        </Link>
                    </div>
                </div>
            </div>
    )
}