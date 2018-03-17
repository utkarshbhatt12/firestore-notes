// inputs
const noteTitleInput = document.getElementById('note-title-input');
const noteBodyTexArea = document.getElementById('note-body-textarea');


// buttons
const noteSaveButton = document.getElementById('note-save-button');
const noteViewButton = document.getElementById('note-view-button');


// spans
const statusSpan = document.getElementById('status-span');


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
        }

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

    // if either title or the body 
    // inputs have some 
    if (title || body) {
        noteTitleInput.value = title;
        noteBodyTexArea.value = body;
    }
});
