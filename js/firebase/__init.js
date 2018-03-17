'use strict';
// Firebase stuff. You can find this on
// console.firebase.com
firebase.initializeApp({
    apiKey: "AIzaSyByLHLc7CLtlsimXHLNWGsbV4eiGuZIE4A",
    authDomain: "contactform-1b262.firebaseapp.com",
    databaseURL: "https://contactform-1b262.firebaseio.com",
    projectId: "contactform-1b262"
});

// reference to an instance of Firebase Firestore
const db = firebase.firestore();
