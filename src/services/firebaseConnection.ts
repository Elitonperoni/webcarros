import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASEAPIKEY,
  authDomain: process.env.REACT_APP_FIREBASEAUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASEPROJECTID, // "webcarros-28c6a",
  storageBucket: process.env.REACT_APP_FIREBASESTORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASEMESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASEAPPID
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }