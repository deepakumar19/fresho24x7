// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAb2JRkJBFc99eG6vH58wn6SPyCerX0Os",
  authDomain: "fresho24x7.firebaseapp.com",
  projectId: "fresho24x7",
  storageBucket: "fresho24x7.firebasestorage.app",
  messagingSenderId: "835068926901",
  appId: "1:835068926901:web:ea04f89790f2f6b266d7fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);