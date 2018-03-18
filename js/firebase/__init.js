'use strict';

// firebase stuff. You can find this in the https://console.firebase.google.com/<project-name> page
firebase.initializeApp({
    apiKey: "AIzaSyByLHLc7CLtlsimXHLNWGsbV4eiGuZIE4A",
    authDomain: "contactform-1b262.firebaseapp.com",
    databaseURL: "https://contactform-1b262.firebaseio.com",
    projectId: "contactform-1b262"
});

// reference to an instance of Firebase Firestore
const db = firebase.firestore();


// a reference to the notes collection inside the default firestore database
// this is the collection where each note will be stored as a unique document
const notesRef = db.collection('notes');

const timeoutDuration = 2000;


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
    }, timeoutDuration);
};


/**
 * Takes in a document ID and deletes it from the friestore
 * @param {string} id Document's auto-id from Firestore
 */
const deleteDoc = (id) => {
    statusSpan.innerText = 'deleting...';

    notesRef.doc(id).delete()
        .then(() => {
            statusSpan.innerText = 'deleted...';

            //TODO: reload the notes from firestore
            // after deleting the note
        }).catch((error) => {
            console.log(error);
            statusSpan.innerText = 'oops... something went wrong!';
        });

    setTimeout(() => {
        statusSpan.innerText = 'idle...';
    }, timeoutDuration);

    // stops the jumping of the page to top on clicking
    return false;
};


/**
 * 
 * @param {string} id id Document's auto-id from Firestore
 */
const updateNote = (id) => {

    // get values from the new input fields
    const newInputTitle = document.getElementById('new-input-title').value;
    const newTextAreaBody = document.getElementById('new-body-textarea').value;

    // input title shouldn't be empty
    if (newInputTitle && newInputTitle.length > 0) {
        statusSpan.innerText = 'updating the note';

        // set() method takes in the object containing the 
        // key value pair to be updated
        notesRef.doc(id).set({
            title: newInputTitle,
            body: newTextAreaBody,
            updateTimestamp: new Date(),
        }, {
            // setting merge to true instructs Firestore to add the new values to
            // the document and not fully replace its fields
            merge: true
        }).then(() => {
            // after updating the note is completed, change the status
            statusSpan.innerText = 'note updated';
        }).catch((error) => {
            console.log(error);
            statusSpan.innerText = 'oops... something went wrong!';
        });

        // after everything is done, simply set the status to idle
        setTimeout(() => {
            statusSpan.innerText = 'idle...';
        }, timeoutDuration);

    }
}


/**
 * Takes in a doc ref and displays a note by reading its title, 
 * body and timestap in the viewport
 * @param {object} doc firestore document reference
 */
const drawNote = (doc) => {

    let title, body, timestamp, id, data, hr, h2, h6, p, aDelete, aEdit;

    // these nodes are created for each document
    hr = document.createElement('hr');
    h2 = document.createElement('h2');
    h6 = document.createElement('h6');
    p = document.createElement('p');
    aDelete = document.createElement('a');
    aEdit = document.createElement('a');

    // data() method contains the document data
    data = doc.data();
    // the .(dot) id property gives us the auto-id of the document in context
    id = doc.id;

    // we can access each property with their appropirate name with the
    // . (dot) operator
    title = data.title;
    body = data.body;
    timestamp = data.timestamp;

    // setting the text of the nodes from the Firestore data
    h2.innerText = title;
    h6.innerText = timestamp;
    p.innerText = body;

    // adding a delete method to the notes
    aDelete.innerText = 'delete';
    aDelete.href = '#';
    aDelete.setAttribute('onclick', `deleteDoc("${id}")`);

    aEdit.innerText = ' | edit';
    aEdit.href = '#';
    aEdit.setAttribute('onclick', `editDoc("${id}", "${title}", "${body}")`);

    // console.log(`editDoc("${id}")`);

    // finally, we append each element in the div to make them
    // show up in our page
    displayNotesDiv.appendChild(h2)
    displayNotesDiv.appendChild(h6);
    displayNotesDiv.appendChild(p);
    displayNotesDiv.appendChild(aDelete);
    displayNotesDiv.appendChild(aEdit);
    displayNotesDiv.appendChild(hr);
};
