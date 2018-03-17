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

// inputs
const noteTitleInput = document.getElementById('note-title-input');
const noteBodyTexArea = document.getElementById('note-body-textarea');

// buttons
const noteSubmitButton = document.getElementById('note-submit-button');
const viewSavedButton = document.getElementById('view-saved-button');
const addNotesButton = document.getElementById('add-notes-button');

// spans
const statusSpan = document.getElementById('status-span');

// divs
const addNotesDiv = document.getElementById('add-notes-div');
const viewNotesDiv = document.getElementById('view-notes-div');

addNotesButton.addEventListener('click', () => {
    addNotesDiv.style.display = 'block';
    addNotesButton.style.display = 'none';
});

viewSavedButton.addEventListener('click', () => {
    // addNotesButton.style.display = 'none';
    viewNotesDiv.style.display = 'block';
    addNotesDiv.style.display = 'none';
    addNotesButton.style.display = 'none';
});


noteTitleInput.addEventListener('focus', () => {
    noteBodyTexArea.style.display = 'block';
});

noteSubmitButton.addEventListener('click', e => {
    e.preventDefault();
    statusSpan.innerText = 'working...';

    const title = noteTitleInput.value.trim();
    const body = noteBodyTexArea.value.trim();

    if (title) {
        const note = {
            title,
            body,
            // maps to firebase's server time
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        sendNote(note);
    } else {
        statusSpan.innerText = 'the title can\'t be empty';
    }
});

window.addEventListener('beforeunload', () => {
    if(noteTitleInput.value.trim()) {
        sessionStorage.setItem('title', noteTitleInput.value.trim());
        sessionStorage.setItem('body', noteBodyTexArea.value.trim());
    }
});

window.addEventListener('load', () => {
    const title = sessionStorage.getItem('title');
    const body = sessionStorage.getItem('body');
    
    // if either title or the body 
    // inputs have some 
    if(title || body) {
        noteTitleInput.value = title;
        noteBodyTexArea.value = body;
    }
});

function sendNote(note) {
    db.collection('notes').doc().set(note)
        .then(() => {
            statusSpan.innerText = 'note created';
        }).catch(error => {
            console.log(error);
            statusSpan.innerText = 'oops... something went wrong';
        });

    setTimeout(() => {
        statusSpan.innerText = 'idle...';
    }, 2000);
}