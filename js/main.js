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

const deleteDoc = (id) => {
    notesRef.doc(id).delete()
        .then(() => {
            console.log('doc', id, 'deleted');
        }).catch((error) => {
            console.log(error);
        });

    // stops the jumping of the page to top on clicking
    return false;
};

/**
 * Takes in a doc ref and displays a note by reading its title, 
 * body and timestap in the viewport
 * @param {object} doc firestore document reference
 */
const drawNote = (doc) => {

    let title, body, timestamp, id, data, hr, h2, h6, p, a;

    // these nodes are created for each document
    hr = document.createElement('hr');
    h2 = document.createElement('h2');
    h6 = document.createElement('h6');
    p = document.createElement('p');
    a = document.createElement('a');

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
    a.innerText = 'delete';
    a.href = '';
    a.onclick = `deleteDoc(${id})`;

    // finally, we append each element in the div to make them
    // show up in our page
    displayNotesDiv.appendChild(h2)
    displayNotesDiv.appendChild(h6);
    displayNotesDiv.appendChild(p);
    displayNotesDiv.appendChild(a);
    displayNotesDiv.appendChild(hr);
};

noteViewButton.addEventListener('click', () => {

    statusSpan.innerText = 'getting docs from Firestore...';

    // hide the fields
    container.style.display = 'none';


    let title, body, timestamp, id, data, hr, h2, h6, p, a;

    notesRef.get()
        .then((snapShot) => {

            // gets the number of notes being displayed when the user clicks 
            // the view notes button.
            // displayNotesDiv.getElementsByTagName('*').length gets the 
            // number of child elements in the 'displayNotesDiv'
            // we subtract 2 from it because of the top 'hr' and the bottom 'p' element
            // then we divide it by 5 because the number of elements being created to display
            // a single note is 5. The result is the number of notes that we have in display
            let numberOfNotes = (displayNotesDiv.getElementsByTagName('*').length - 2) / 5;

            // if the list of notes is already populated, first remove them from the viewport
            // then reconstruct the notes again by reading them from the firestore
            if (numberOfNotes > 1) {
                displayNotesDiv.innerHTML = '';
            }


            if (snapShot.size === 0) {

                p = document.createElement('p');
                p.innerText = '************ EMPTY ************';
                p.style.fontWeight = '800';
                displayNotesDiv.appendChild(p);

                statusSpan.innerText = 'idle...';
            } else {
                snapShot.forEach((doc) => {
                    drawNote(doc);
                });
            }
        }).then(() => {

            // don't display the ************* END ************* string
            // if there are no notes to display since we are already showing
            // '************ EMPTY ************ string in the app
            if (displayNotesDiv.getElementsByTagName('*').length !== 2) {
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
        saveNote(note); // from __init.js

    } else {
        // title can't be empty.
        statusSpan.innerText = 'the title can\'t be empty';
    }

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
