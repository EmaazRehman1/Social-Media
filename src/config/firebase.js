// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpo1IXkXkgDwRfQ-tWKEvHsfw-4-NtFbk",
  authDomain: "socialmedia-12631.firebaseapp.com",
  projectId: "socialmedia-12631",
  storageBucket: "socialmedia-12631.firebasestorage.app",
  messagingSenderId: "91072262932",
  appId: "1:91072262932:web:f33c30fd222801dbcd8801",
  measurementId: "G-NG4YV6QG3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth= getAuth(app);
export const provider= new GoogleAuthProvider();
export const db=getFirestore(app);
export default app;