// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBojuBQJu_0gJuNTe4wLW39ePGpbMmX6yY",
  authDomain: "tantra-booking-f1114.firebaseapp.com",
  projectId: "tantra-booking-f1114",
  storageBucket: "tantra-booking-f1114.appspot.com",
  messagingSenderId: "757233169355",
  appId: "1:757233169355:web:3907348d0e8960f1753c4e",
  measurementId: "G-NBD7WT8LSC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported() ? getAnalytics(app) : undefined;

const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
