import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { ThemeProvider } from "@material-tailwind/react";


import firebase from 'firebase/compat/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB75X9jHzVEhgXjjwMmAbxsePvS7Nj4lwI",
  authDomain: "pixi-e10e8.firebaseapp.com",
  projectId: "pixi-e10e8",
  storageBucket: "pixi-e10e8.appspot.com",
  messagingSenderId: "904786726063",
  appId: "1:904786726063:web:d95501060e60aa9652185a",
  measurementId: "G-877940Z0DV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
