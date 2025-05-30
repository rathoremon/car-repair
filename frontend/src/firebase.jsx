import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmwC_5eW4DisatNOtyGPVUr91CfpoC-Fs",
  authDomain: "trasure-67348.firebaseapp.com",
  projectId: "trasure-67348",
  storageBucket: "trasure-67348.firebasestorage.app",
  messagingSenderId: "795347936570",
  appId: "1:795347936570:web:ab2621bf5e905db828dc03",
  measurementId: "G-FTYN7XZ3LQ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // <-- add this

export { auth };
export const RecaptchaVerifier = firebaseAuth.RecaptchaVerifier;
