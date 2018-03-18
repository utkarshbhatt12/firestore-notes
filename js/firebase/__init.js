'use strict';

// firebase stuff. You can find this in the https://console.firebase.google.com/<project-name> page
firebase.initializeApp({
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: ""
});

// reference to an instance of Firebase Firestore
const db = firebase.firestore();


// a reference to the notes collection inside the default firestore database
// this is the collection where each note will be stored as a unique document
const notesRef = db.collection('notes');
