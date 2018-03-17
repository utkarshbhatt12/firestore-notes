// inputs
const noteTitleInput = document.getElementById('note-title-input');
const noteBodyTexArea = document.getElementById('note-body-textarea');


// buttons
const noteSaveButton = document.getElementById('note-save-button');
const noteViewButton = document.getElementById('note-view-button');


// spans
const statusSpan = document.getElementById('status-span');


// divs
const container = document.querySelector('.container');
const displayNotesDiv = document.getElementById('display-notes-div');


noteViewButton.addEventListener('click', () => {

    statusSpan.innerText = 'getting docs from Firestore...';

    // hide the fields
    container.style.display = 'none';


    let title, body, timestamp, data, hr, h2, h6, p;

    notesRef.get()
        .then((snapShot) => {
            snapShot.forEach((doc) => {

                // these nodes are created for each document
                hr = document.createElement('hr');
                h2 = document.createElement('h2');
                h6 = document.createElement('h6');
                p = document.createElement('p');

                // data() method contains the document data
                data = doc.data();

                // we can access each property with their appropirate name with the
                // . (dot) operator
                title = data.title;
                body = data.body;
                timestamp = data.timestamp;

                // setting the text of the nodes from the Firestore data
                h2.innerText = title;
                h6.innerText = timestamp;
                p.innerText = body;

                // finally, we append each element in the div to make them
                // show up in our page
                displayNotesDiv.appendChild(h2)
                displayNotesDiv.appendChild(h6);
                displayNotesDiv.appendChild(p);
                displayNotesDiv.appendChild(hr);
            });
        }).then(() => {
            p = document.createElement('p');
            p.innerText = '********* END *********';
            displayNotesDiv.appendChild(p);

            statusSpan.innerText = 'idle...';

        }).catch((error) => {
            // something went wrong. Make sure that you have set up the permissions 
            // to allow anyone to write to the Firestore
            // READ MORE: https://firebase.google.com/docs/firestore/security/get-started
            statusSpan.innerText = 'oops... something went wrong!';
            console.log(error);
        });
});


// execution starts here when user clicks the 'save' button
noteSaveButton.addEventListener('click', (evt) => {
    statusSpan.innerText = 'working...';

    // get values from text fields
    const title = noteTitleInput.value.trim();
    const body = noteBodyTexArea.value.trim();

    // if title isn't empty
    if (title && title.length > 0) {

        const note = {
            title,
            body,
            // client's time
            timestamp: new Date(),
        };

        // writes to the firestore using the data from the 'note' object
        sendNote(note); // fron __init.js

    } else {
        // title can't be empty.
        statusSpan.innerText = 'the title can\'t be empty';
    }

    evt.preventDefault();
});

window.addEventListener('beforeunload', () => {
    if (noteTitleInput.value) {
        sessionStorage.setItem('title', noteTitleInput.value.trim());
        sessionStorage.setItem('body', noteBodyTexArea.value.trim());
    }
});

window.addEventListener('load', () => {
    const title = sessionStorage.getItem('title');
    const body = sessionStorage.getItem('body');

    // if either title or the body is saved in locally,
    // put them in the input fields
    if (title || body) {
        noteTitleInput.value = title;
        noteBodyTexArea.value = body;
    }
});
