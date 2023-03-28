import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const config = {
    "apiKey": "AIzaSyC6qyjkCbs5FhmRE9e7weIbpkKgmg85KHI",
    "authDomain": "colors-df7a2.firebaseapp.com",
    "projectId": "colors-df7a2",
    "storageBucket": "colors-df7a2.appspot.com",
    "messagingSenderId": "301107348682",
    "appId": "1:301107348682:web:da1887fe58a89d07902033",
    "databaseURL": "gs://colors-df7a2.appspot.com/"
};

const firebase = initializeApp(config);
const auth = getAuth(firebase);
const db = getFirestore(firebase);
const storage = getStorage();

export { firebase, auth, db, storage };
