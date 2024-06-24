import React from "react";

import { Link } from "react-router-dom";

import { Card, Typography, List, ListItem, ListItemPrefix, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { Cog6ToothIcon,PresentationChartBarIcon, ChevronDownIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";

import logo from '../../assets/logo.png'



export function SidebarWithLogo() {
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    return (
        <Card className="fixed h-[calc(100vh)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <Link to='/admin'>
                <div className="flex flex-col items-center justify-center gap-4 p-4">
                    <img src={logo} alt="brand" className="h-12" />
                </div>
            </Link>
            <List>
                <Link to="/admin/dashboard">
                    <ListItem>
                        <ListItemPrefix>
                            <PresentationChartBarIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Dashboard
                    </ListItem>
                </Link>
                <Accordion
                    open={open === 2}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem className="p-0" selected={open === 2}>
                        <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                            <ListItemPrefix>
                                <TableCellsIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal">
                                Registre
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                        <List className="p-0">
                            <Link to="/admin/register/games">
                                <ListItem>
                                    <ListItemPrefix>
                                    </ListItemPrefix>
                                    Formations
                                </ListItem>
                            </Link>
                        </List>
                    </AccordionBody>
                </Accordion>
                <Accordion
                    open={open === 1}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem className="p-0" selected={open === 1}>
                        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                            <ListItemPrefix>
                                <Cog6ToothIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal">
                                Paramètres
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                        <List className="p-0">
                            <Link to="/admin/settings/conf">
                                <ListItem>
                                    <ListItemPrefix>
                                    </ListItemPrefix>
                                    Configuration
                                </ListItem>
                            </Link>
                            <Link to="/admin/settings/users">
                                <ListItem>
                                    <ListItemPrefix>
                                    </ListItemPrefix>
                                    Utilisateurs
                                </ListItem>
                            </Link>
                        </List>
                    </AccordionBody>
                </Accordion>
                <Link to="/">
                    <ListItem className="text-red-500 hover:text-red-500">
                        <ListItemPrefix>
                            <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-500 " />
                        </ListItemPrefix>
                        Sortir
                    </ListItem>
                </Link>
            </List>
        </Card>
    );
}
