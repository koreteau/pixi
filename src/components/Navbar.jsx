import React, { useEffect, useState } from "react";

import { Link, useNavigate } from 'react-router-dom';

import { Avatar, Collapse, Typography, Button, IconButton, List, ListItem, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, Cog6ToothIcon, LifebuoyIcon, PowerIcon } from "@heroicons/react/24/solid";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import logo from '../assets/logo.png';

const profileMenuItems = [
    {
        label: "Mon compte",
        link: "/account",
        icon: UserCircleIcon,
    },
    {
        label: "Centre d'aide",
        icon: LifebuoyIcon,
    },
    {
        label: "Se déconnecter",
        icon: PowerIcon,
    },
];

function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userUID, setUserUID] = useState(null);
    const [profilePictureURL, setProfilePictureURL] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = async () => {
        try {
            await firebase.auth().signOut();
            alert('Vous êtes déconnecté');
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const fetchUserUID = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserUID(user.uid);
        } else {
            console.error('No user is currently signed in');
        }
    };

    const fetchProfilePictureURL = async (picturePath) => {
        try {
            const storageRef = firebase.storage().ref();
            const url = await storageRef.child(picturePath).getDownloadURL();
            setProfilePictureURL(url);
        } catch (error) {
            console.error('Error fetching profile picture URL:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (userUID) {
                    const db = firebase.firestore();
                    const userDoc = await db.collection('users').doc(userUID).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData.profilePicture) {
                            fetchProfilePictureURL(`img/userPicture/${userData.profilePicture}`);
                        }
                        if (userData.isAdmin) {
                            setIsAdmin(true);
                        }
                    } else {
                        console.error('User not found');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (!userUID) {
            fetchUserUID();
        } else {
            fetchUserData();
        }
    }, [userUID]);

    return (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
                >
                    <Avatar
                        variant="circular"
                        size="sm"
                        alt="Profile Picture"
                        className="border border-gray-900 p-0.5"
                        src={profilePictureURL || ""}
                    />
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
                {isAdmin && (
                    <Link to="/admin">
                        <MenuItem
                            onClick={closeMenu}
                            className="flex items-center gap-2 rounded hover:bg-blue-500/10 focus:bg-blue-500/10 active:bg-blue-500/10"
                        >
                            <Cog6ToothIcon className="h-4 w-4" strokeWidth={2} />
                            <Typography
                                as="span"
                                variant="small"
                                className="font-normal"
                            >
                                Panneau Administrateur
                            </Typography>
                        </MenuItem>
                    </Link>
                )}
                <hr />
                {profileMenuItems.map(({ label, icon, link }, key) => {
                    const isLastItem = key === profileMenuItems.length - 1;
                    const onClick = isLastItem ? handleLogout : closeMenu;

                    return (
                        <Link to={link} key={label}>
                            <MenuItem
                                onClick={onClick}
                                className={`flex items-center gap-2 rounded ${isLastItem
                                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                                    : ""}`}
                            >
                                {React.createElement(icon, {
                                    className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                                    strokeWidth: 2,
                                })}
                                <Typography
                                    as="span"
                                    variant="small"
                                    className="font-normal"
                                    color={isLastItem ? "red" : "inherit"}
                                >
                                    {label}
                                </Typography>
                            </MenuItem>
                        </Link>
                    );
                })}

            </MenuList>
        </Menu>
    );
}

function NavList() {
    return (
        <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
            <Link to="/catalog">
                <ListItem className="flex items-center gap-2 py-2 pr-4">
                    <Typography
                        variant="small"
                        color="black"
                        className="font-medium"
                    >
                        Catalogue des formations
                    </Typography>
                </ListItem>
            </Link>
            <Link to="/seller">
                <ListItem className="flex items-center gap-2 py-2 pr-4">
                    <Typography
                        variant="small"
                        color="black"
                        className="font-medium"
                    >
                        Devenir vendeur
                    </Typography>
                </ListItem>
            </Link>
        </List>
    );
}

export function NavbarWithMegaMenu() {
    const [openNav, setOpenNav] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = firebase.auth();

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    return (
        <div className="mx-auto py-2 px-10 max-w-[80rem]">
            <div className="flex items-center justify-between text-pixi">
                <Link to='/'>
                    <img src={logo} className="h-10" />
                </Link>
                <div className="hidden lg:block">
                    <NavList />
                </div>
                {user ? (
                    <div className="hidden lg:flex">
                        <ProfileMenu />
                    </div>
                ) : (
                    <div className="hidden gap-2 lg:flex">
                        <Link to='/login'>
                            <Button variant="text" size="sm" className="text-pixi">
                                Connexion
                            </Button>
                        </Link>
                        <Link to='/register'>
                            <Button size="sm" className="bg-pixi hover:shadow-none">
                                Inscription
                            </Button>
                        </Link>
                    </div>
                )}
                <IconButton
                    variant="text"
                    color="blue-gray"
                    className="lg:hidden"
                    onClick={() => setOpenNav(!openNav)}
                >
                    {openNav ? (
                        <XMarkIcon className="h-6 w-6" strokeWidth={2} />
                    ) : (
                        <Bars3Icon className="h-6 w-6" strokeWidth={2} />
                    )}
                </IconButton>
            </div>
            <Collapse open={openNav}>
                <NavList />
                {user ? (
                    <div className="lg:flex">
                        <ProfileMenu />
                    </div>
                ) : (
                    <div className="gap-2 lg:flex">
                        <Link to='/login'>
                            <Button variant="text" size="sm" color="blue-gray">
                                Log In
                            </Button>
                        </Link>
                        <Link to='/register'>
                            <Button size="sm" className="bg-pixi hover:shadow-none">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                )}
            </Collapse>
        </div >
    );
}
