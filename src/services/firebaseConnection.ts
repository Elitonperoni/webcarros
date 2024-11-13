import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA8H1tkt6BprxbZFTbMMwq0TD5HctHVE_M",
  authDomain: "webcarros-28c6a.firebaseapp.com",
  projectId: "webcarros-28c6a",
  storageBucket: "webcarros-28c6a.firebasestorage.app",
  messagingSenderId: "521705353510",
  appId: "1:521705353510:web:efec201a048bf64e4991e7"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }