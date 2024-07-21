import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "wedding-planner-9952c.firebaseapp.com",
  projectId: "wedding-planner-9952c",
  storageBucket: "wedding-planner-9952c.appspot.com",
  messagingSenderId: "308513330887",
  appId: "1:308513330887:web:d20bd21bd4b74a231ad0e2",
  measurementId: "G-GTPD3RT4ZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, storage };
