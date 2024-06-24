import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { Button, CardBody, CardHeader, CardFooter, Input, Typography } from '@material-tailwind/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


const TABLE_HEAD = ['ID', 'Nom', 'Prénom', 'Actif'];


export function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const db = firebase.firestore();
        const fetchData = async () => {
            try {
                const userSnapshot = await db.collection('users').get();
                const userData = await Promise.all(
                    userSnapshot.docs.map(async (doc) => {
                        const userItem = doc.data();
                        const historyDoc = await db.collection('users').doc(doc.id).collection('history').where('type', '==', 'creation').limit(1).get();
                        const creationDate = historyDoc.docs[0]?.data().date;
                        const creationAuthor = historyDoc.docs[0]?.data().author;
                        return {
                            id: doc.id,
                            ...userItem,
                            eventDate: creationDate,
                            authorId: creationAuthor,
                        };
                    })
                );
                setUsers(userData);
                setLoading(false);
            } catch (error) {
                console.error('Error retrieving data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter((user) => {
        const normalizedLastName = user.lastName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedFirstName = user.firstName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedSearchTerm = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedLastName.includes(normalizedSearchTerm) || normalizedFirstName.includes(normalizedSearchTerm);
    });

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <div className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography color="gray" className="mt-1 font-normal">
                            L'ensemble des utilisateurs
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="w-full md:w-72">
                        <Input label="Rechercher" icon={<MagnifyingGlassIcon className="h-5 w-5" />} onChange={handleSearchInputChange} />
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
                            <td className='p-4'>
                                <div className="flex items-center gap-3">
                                    <Typography as="div" variant="paragraph" className="mb-2 h-2 w-60 rounded-full bg-gray-300">
                                        &nbsp;
                                    </Typography>
                                </div>
                            </td>
                            <td className='p-4'>
                                <div className="flex items-center gap-3">
                                    <Typography as="div" variant="paragraph" className="mb-2 h-2 w-60 rounded-full bg-gray-300">
                                        &nbsp;
                                    </Typography>
                                </div>
                            </td>
                            <td className='p-4'>
                                <div className="flex items-center gap-3">
                                    <Typography as="div" variant="paragraph" className="mb-2 h-2 w-60 rounded-full bg-gray-300">
                                        &nbsp;
                                    </Typography>
                                </div>
                            </td>
                            <td className='p-4'>
                                <div className="flex items-center gap-3">
                                    <Typography as="div" variant="paragraph" className="mb-2 h-2 w-60 rounded-full bg-gray-300">
                                        &nbsp;
                                    </Typography>
                                </div>
                            </td>
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
                            {paginatedUsers.map(({ id, lastName, firstName, active }, index) => {
                                const isLast = index === paginatedUsers.length - 1;
                                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
                                return (
                                    <tr key={id}>
                                        <td className={classes}>
                                            <Link to={`/settings/users/${id}`}>
                                                <div className="flex items-center gap-3">
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {id}
                                                    </Typography>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {lastName}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {firstName}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {active ? 'Oui' : 'Non'}
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
                        variant="outlined"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </Button>
                    <Button
                        variant="outlined"
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