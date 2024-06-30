import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';

import { Button } from '@material-tailwind/react';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";


import { NavbarWithMegaMenu } from './components/Navbar';
import { LoginCard } from './components/Login';
import { Account } from "./components/account/Account";
import { Home } from './components/Home';
import { UserPage } from './components/SinglePageUser';
import { NotFound } from './components/404';
import { RegisterCard } from './components/Register';
import { Footer } from './components/Footer';
import { Catalog } from './components/Catalog';
import { SinglePageLearning } from './components/SinglePageGame';
import { Seller } from './components/Seller';
import { CreateGame } from './components/CreateGame';
import { Approval } from './components/Approval';

import { Dashboard } from './components/admin/dashboard/Dashboard';
import { SidebarWithLogo } from './components/admin/SideBar';
import { DefaultDrawerSidebar } from './components/admin/DrawerSideBar';
import { AdminHome } from './components/admin/AdminHome'
import { AdminGames } from './components/admin/AdminGames';
import { AdminSinglePageGame } from './components/admin/AdminSinglePageGame';
import { AdminSinglePageUser } from './components/admin/AdminSinglePageUser';
import { AdminCreateGame } from './components/admin/AdminCreateGame';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminCreateUser } from './components/admin/AdminCreateUser';



function PageTitle({ title }) {
  useEffect(() => {
    document.title = 'PIXI - ' + title;
  }, [title]);

  return null;
}

async function checkIfAdmin(userId) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    return userData.isAdmin === true;
  } else {
    console.log("No such document!");
    return false;
  }
}

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowWidth;
}

function AppContent({ user, admin }) {
  const windowWidth = useWindowWidth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <NavbarWithMegaMenu />}
      <Routes>
        <Route path="/" element={<><PageTitle title="Accueil" /><Home /></>} />
        <Route path="/login" element={<><PageTitle title="Se connecter" /><LoginCard /></>} />
        <Route path="/register" element={<><PageTitle title="Se connecter" /><RegisterCard /></>} />
        <Route path="/account" element={user ? <><PageTitle title="Mon compte" /><Account /></> : <><PageTitle title="Se connecter" /><LoginCard /></>} />
        <Route path="/catalog/new" element={user ? <><PageTitle title="Catalogue de formations" /><CreateGame /></> : <><PageTitle title="Se connecter" /><LoginCard /></>} />
        <Route path="/approval" element={<><PageTitle title="Demande reçue" /><Approval /></>} />
        <Route path="/catalog" element={<><PageTitle title="Catalogue de formations" /><Catalog /></>} />
        <Route path="/catalog/:id" element={<><PageTitle title="Formation" /><SinglePageLearning /></>} />
        <Route path="/user/:username" element={<><PageTitle title="Utilisateur" /><UserPage /></>} />
        <Route path="/seller" element={<><PageTitle title="Devenir vendeur" /><Seller /></>} />
        <Route path="*" element={<><PageTitle title="Page non trouvée" /><NotFound /></>} />

        {admin && (
          <>
            <Route path="/admin" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Accueil" />
                  <AdminHome />
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
            <Route path="/admin/dashboard" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Dashboard" />
                  <Dashboard />
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
            <Route path="/admin/register/games" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Formations" />
                  <AdminGames />
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
            <Route path="/admin/register/games/:id" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Formations" />
                  <AdminSinglePageGame />
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
            <Route path="/admin/register/games/new" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Formations" />
                  <AdminCreateGame />
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
            <Route path="/admin/settings/users" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Utilisateurs" />
                  <AdminUsers />
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
            <Route path="/admin/settings/users/:id" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Utilisateurs" />
                  <AdminSinglePageUser />
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
            <Route path="/admin/settings/users/new" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Utilisateurs" />
                  <AdminCreateUser />
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
            <Route path="/admin/*" element={
              <div style={{ display: 'flex' }}>
                {windowWidth > 1000 && <SidebarWithLogo />}
                <div className={`w-full ${windowWidth > 1000 ? 'pl-[20rem]' : ''}`}>
                  <PageTitle title="Admin - Page non trouvée" />
                  <div className="text-center" style={{ paddingTop: "40px" }}>
                    <h1>404 - Page non trouvée</h1>
                    <Link to="/admin">
                      <Button className="bg-pixi shadow-none hover:shadow-pixi" ripple="light">
                        Retour à l'accueil
                      </Button>
                    </Link>
                  </div>
                </div>
                {windowWidth <= 1000 && <DefaultDrawerSidebar />}
              </div>
            } />
          </>
        )}
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async authUser => {
      if (authUser) {
        setUser(authUser);
        const adminStatus = await checkIfAdmin(authUser.uid);
        setAdmin(adminStatus);
      } else {
        setUser(null);
        setAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <AppContent user={user} admin={admin} />
    </Router>
  );
}
