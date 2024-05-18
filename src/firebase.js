// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs3WWykhqewoIGEvaQr3FL-GZ6yKmBmzs",
  authDomain: "marketapp-105ff.firebaseapp.com",
  projectId: "marketapp-105ff",
  storageBucket: "marketapp-105ff.appspot.com",
  messagingSenderId: "269390303152",
  appId: "1:269390303152:web:17fb36a632ca5ed2881075",
  measurementId: "G-PXJP1J1QL0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const  db = getFirestore(app);
export const storage = getStorage();
//const analytics = getAnalytics(app);
