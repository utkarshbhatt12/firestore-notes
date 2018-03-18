// inputs
const noteTitleInput = document.getElementById('note-title-input');
const noteBodyTexArea = document.getElementById('note-body-textarea');


// buttons
const noteSaveButton = document.getElementById('note-save-button');
const noteViewButton = document.getElementById('note-view-button');


// spans
const statusSpan = document.getElementById('status-span');


// divs
const inputDiv = document.getElementById('input-div');
const displayNotesDiv = document.getElementById('display-notes-div');


/**
 * Creates the input fields in the viewport for updating
 * the note using the id of the document
 * @param {string} id id Document's auto-id from Firestore
 * @param {string} title title of the note
 * @param {string} body body of the note
 */
const editDoc = (id, title, body) => {

    // remove all notes from viewport
    displayNotesDiv.innerHTML = '';

    const inputTitle = document.createElement('input');
    inputTitle.setAttribute('placeholder', 'title here');
    inputTitle.setAttribute('id', 'new-input-title');
    inputTitle.value = title;

    const textareaBody = document.createElement('textarea');
    textareaBody.setAttribute('placeholder', 'body here');
    textareaBody.setAttribute('id', 'new-body-textarea');
    textareaBody.innerText = body;

    const updateButton = document.createElement('button');
    updateButton.setAttribute('class', 'button button-outline');
    updateButton.innerHTML = 'UPDATE';
    updateButton.setAttribute('onclick', `updateNote("${id}")`);

    displayNotesDiv.appendChild(inputTitle);
    displayNotesDiv.appendChild(textareaBody);
    displayNotesDiv.appendChild(updateButton);
}



noteViewButton.addEventListener('click', () => {

    statusSpan.innerText = 'getting docs from Firestore...';

    // hide the fields
    inputDiv.style.display = 'none';

    let p;

    notesRef.get()
        .then((snapShot) => {

            // gets the number of notes being displayed when the user clicks 
            // the view notes button.
            // displayNotesDiv.getElementsByTagName('*').length gets the 
            // number of children nodes in the 'displayNotesDiv'
            // we subtract 2 from it because of the top 'hr' and the bottom 'p' elements
            // then we divide it by 5 because the number of elements being created to display
            // a single note is 5. The result is the number of notes that we have in display
            let numberOfNotes = (displayNotesDiv.getElementsByTagName('*').length - 2) / 5;

            // if the list of notes is already populated, first remove them from the viewport
            // then reconstruct the notes again by reading them from the firestore
            if (numberOfNotes > 1) {
                displayNotesDiv.innerHTML = '';

                // want to keep the first element of the notes list 
                // to be the hr element
                // this is to keep some spacing between the VIEW NOTES button
                // and the actual notes
                displayNotesDiv.appendChild(document.createElement('hr'));
            }


            // if there are no notes in the db saved,
            // show the EMPTY string instead of END.
            if (snapShot.size === 0) {

                p = document.createElement('p');
                p.innerText = '************ EMPTY ************';
                p.style.fontWeight = '800';
                displayNotesDiv.appendChild(p);

                statusSpan.innerText = 'idle...';
            } else {
                snapShot.forEach((doc) => {
                    drawNote(doc); // from crud.js
                });
            }
        }).then(() => {

            // don't display the ************* END ************* string
            // if there are no notes to display since we are already showing
            // '************ EMPTY ************ string in the app
            if (displayNotesDiv.getElementsByTagName('*').length > 2) {

                p = document.createElement('p');
                p.innerText = '************* END *************';
                p.style.fontWeight = '800';
                displayNotesDiv.appendChild(p);

                statusSpan.innerText = 'idle...';
            }
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

    // won't store notes without a title
    if (title && title.length > 0) {

        const note = {
            title,
            body,
            timestamp: new Date(), // client's time
        };

        // writes to the firestore using the data from the 'note' object
        saveNote(note); // from crud.js

    } else {
        // title can't be empty.
        statusSpan.innerText = 'the title can\'t be empty';
    }

    // stop page from reloading on submit
    evt.preventDefault();
});


// save input values inside the sessionStorage of the browser
window.addEventListener('beforeunload', () => {

    // only save if the title field is populated
    if (noteTitleInput.value) {
        sessionStorage.setItem('title', noteTitleInput.value.trim());
        sessionStorage.setItem('body', noteBodyTexArea.value.trim());
    }
});


// read the values from sessionStorage and populate the input fields appropriately
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
