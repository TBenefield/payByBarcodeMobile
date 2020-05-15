// database/firebaseDb.js

import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBBKkJNtl_S1-pPbuW_mdMWnhPRbjf_ICs",
    authDomain: "barcode-test-682fc.firebaseapp.com",
    databaseURL: "https://barcode-test-682fc.firebaseio.com/",
    projectId: "barcode-test-682fc",
    storageBucket: "barcode-test-682fc.appspot.com",
    messagingSenderId: "695189332163",
    appId: "1:695189332163:web:c6eed7b47add98ac31c276"
};

if(!firebase.apps.length)
    firebase.initializeApp(firebaseConfig);

export default firebase;