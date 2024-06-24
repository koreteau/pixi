import { Link } from "react-router-dom";

import { Button } from "@material-tailwind/react";


export function NotFound() {
    return (
        <div className="text-center" style={{ paddingTop: "40px" }}>
            <h1>404 - Page Not Found</h1>
            <Link to="/">
                <Button className="bg-pixi shadow-none hover:shadow-pixi" ripple="light">
                    Retour à l'accueil
                </Button>
            </Link>
        </div>
    )
}
