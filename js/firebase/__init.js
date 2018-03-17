'use strict';

// firebase stuff. You can find this in the https://console.firebase.google.com page
firebase.initializeApp({
    apiKey: "AIzaSyByLHLc7CLtlsimXHLNWGsbV4eiGuZIE4A",
    authDomain: "contactform-1b262.firebaseapp.com",
    databaseURL: "https://contactform-1b262.firebaseio.com",
    projectId: "contactform-1b262"
});

// reference to an instance of Firebase Firestore
const db = firebase.firestore();

// a reference to the notes collection inside the default firestore database
const notesRef = db.collection('notes');

/**
 * Writes the note to the firestore database creating a document 
 * inside the 'notes' collection
 * @param {object} note object containing the note title, body and the event timestamp
 */
const saveNote = (note) => {

    notesRef.doc().set(note)
        .then(() => {

            // updates the status after the note is created in the firestore
            statusSpan.innerText = 'note created';

            // clear the locally stored note data since 
            // we have saved it to the Firestore
            sessionStorage.clear();
        }).catch((error) => {
            // something went wrong. Make sure that you have set up the permissions 
            // to allow anyone to write to the Firestore
            // READ MORE: https://firebase.google.com/docs/firestore/security/get-started
            statusSpan.innerText = 'oops... something went wrong!';
        });

    // set the status to idle after the note is published since 
    // the app is doing nothing after that
    setTimeout(() => {
        statusSpan.innerText = 'idle...';
    }, 2000);
};
