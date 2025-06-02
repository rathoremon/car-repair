// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmwC_5eW4DisatNOtyGPVUr91CfpoC-Fs",
  authDomain: "trasure-67348.firebaseapp.com",
  projectId: "trasure-67348",
  storageBucket: "trasure-67348.appspot.com",
  messagingSenderId: "795347936570",
  appId: "1:795347936570:web:ab2621bf5e905db828dc03",
  measurementId: "G-FTYN7XZ3LQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
