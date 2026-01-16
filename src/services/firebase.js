// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUGg1yyywIbr4tPm1u5jEhjY2ELBJ5FG4",
  authDomain: "bookmyvendor-4176c.firebaseapp.com",
  projectId: "bookmyvendor-4176c",
  storageBucket: "bookmyvendor-4176c.firebasestorage.app",
  messagingSenderId: "795251963660",
  appId: "1:795251963660:web:da311a271e6cf2f5cd3b29",
  measurementId: "G-9XPEXMZ7VM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
