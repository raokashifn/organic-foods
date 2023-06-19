const firebase =require('firebase');
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIuYSGjRWnHoZd3noAEMTr_cBPKYgP5tM",
  authDomain: "webapp-e9ad0.firebaseapp.com",
  projectId: "webapp-e9ad0",
  storageBucket: "webapp-e9ad0.appspot.com",
  messagingSenderId: "673944129236",
  appId: "1:673944129236:web:af8a6ee65eb71013a8f541",
  measurementId: "G-B06NS6MQ5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const FB = firebase.initializeApp(firebaseConfig);

const db=firebase.firestore();
module.exports={firebase,db, FB};