// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-mk2NzoWi1z_Mbabqx17hW-aOHY33dvQ",
    authDomain: "react-code-sandbox.firebaseapp.com",
    projectId: "react-code-sandbox",
    storageBucket: "react-code-sandbox.appspot.com",
    messagingSenderId: "12432964471",
    appId: "1:12432964471:web:7ed1df1e467155e1217f72",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Firestore
export const db = app.firestore();

// Storage
export const storage = app.storage();
