import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, CardBody, CardHeader, CardFooter, Input, Typography, Tabs, TabsHeader, Tab } from '@material-tailwind/react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


const TABLE_HEAD = ['Title', 'Description', 'Status', 'Author'];
const TABS = [
    { label: 'Toutes les formations', value: 'all' },
    { label: "En attente d'approbation", value: 'approval' },
    { label: 'Active', value: 'active' },
    { label: 'Désactivées', value: 'archived' },
];


export function AdminGames() {
    const [games, setGames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage] = useState(20);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userIUD, setUserIUD] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');

    useEffect(() => {
        const db = firebase.firestore();
        const fetchData = async () => {
            try {
                const gamesSnapshot = await db.collection('games').orderBy('title').get();
                const gamesData = gamesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGames(gamesData);

                const userSnapshot = await db.collection('users').get();
                const userData = userSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userData);

                const user = firebase.auth().currentUser;
                setUserIUD(user.uid);

                setLoading(false);
            } catch (error) {
                console.error('Error retrieving data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTabChange = (value) => {
        setSelectedTab(value);
        setCurrentPage(1);
    };

    const filteredGames = games.filter((game) => {
        const normalizedTitle = game.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedSearchTerm = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const statusMatch = selectedTab === 'all' || game.status === selectedTab;
        return normalizedTitle.includes(normalizedSearchTerm) && statusMatch;
    });

    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const paginatedGames = filteredGames.slice((currentPage - 1) * gamesPerPage, currentPage * gamesPerPage);

    return (
        <div className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography color="gray" className="mt-1 font-normal">
                            L'ensemble des formations publiées
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Link to='/register/create/game'>
                            <Button className="flex items-center gap-3 bg-pixi shadow-none hover:shadow-pixi" size="sm">
                                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Publier une formation
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Tabs value={selectedTab} onChange={(e) => handleTabChange(e)} className="w-full md:w-max">
                        <TabsHeader className="flex-nowrap">
                            {TABS.map(({ label, value }) => (
                                <Tab key={value} value={value} onClick={() => handleTabChange(value)} className="text-sm px-4 py-2 whitespace-nowrap">
                                    {label}
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-72">
                        <Input label="Search" color="orange" icon={<MagnifyingGlassIcon className="h-5 w-5" />} onChange={handleSearchInputChange} />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                {loading ? (
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((title) => (
                                    <th key={title} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {title}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_HEAD.map((title, index) => (
                                <td key={index} className='p-4'>
                                    <div className="flex items-center gap-3">
                                        <Typography as="div" variant="paragraph" className="mb-2 h-2 w-60 rounded-full bg-gray-300">
                                            &nbsp;
                                        </Typography>
                                    </div>
                                </td>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((title) => (
                                    <th key={title} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {title}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedGames.map(({ id, title, desc, status, author }, index) => {
                                const isLast = index === paginatedGames.length - 1;
                                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
                                const authorData = users.find(user => user.id === author);
                                return (
                                    <tr key={id}>
                                        <td className={classes}>
                                            <Link to={`/admin/register/games/${id}`}>
                                                <div className="flex items-center gap-3">
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {title}
                                                    </Typography>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {desc}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {status}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {authorData ? `${authorData.username}` : ""}
                                                </Typography>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {currentPage} sur {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button
                        className='bg-pixi shadow-none hover:shadow-pixi'
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </Button>
                    <Button
                        className='bg-pixi shadow-none hover:shadow-pixi'
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Suivant
                    </Button>
                </div>
            </CardFooter>
        </div>
    );
}
