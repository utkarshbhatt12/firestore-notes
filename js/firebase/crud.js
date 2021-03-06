// timeout for the status to update --> 2 seconds
const timeoutDuration = 2000;


/**
 * Writes the note to the firestore database creating a document
 * inside the 'notes' collection.
 *
 * @param {Object} note Object containing the note title, body
 * and the event timestamp.
 */
const saveNote = (note) => {
  notesRef.doc().set(note)
    .then(() => {
      // updates the status after the note is created in the firestore
      statusSpan.innerText = 'note created';

      // clear the locally stored note data since
      // we have saved it to the Firestore
      sessionStorage.clear();
      return;
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
 * Takes in a document ID and deletes it from the firestore.
 *
 * @param {string} id Document's auto-id from Firestore.
 */
const deleteDoc = (id) => {
  statusSpan.innerText = 'deleting...';

  notesRef.doc(id).delete()
    .then(() => {
      statusSpan.innerText = 'deleted...';
      // TODO: reload the notes from firestore
      // after deleting the note
      return;
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
 * Takes in the id of the document and updates it content based on user input.
 *
 * @param {string} id Id Document's auto-id from Firestore.
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
      merge: true,
    }).then(() => {
      // after updating the note is completed, change the status
      statusSpan.innerText = 'note updated';
      return;
    }).catch((error) => {
      console.log(error);
      statusSpan.innerText = 'oops... something went wrong!';
    });

    // after everything is done, simply set the status to idle
    setTimeout(() => {
      statusSpan.innerText = 'idle...';
    }, timeoutDuration);
  }
};


/**
 * Takes in a doc ref and displays a note by reading its title,
 * body and timestap in the viewport.
 *
 * @param {Object} doc Firestore document reference.
 */
const drawNote = (doc) => {
  let title;
  let body;
  let timestamp;
  let id;

  // these nodes are created for each document
  const hr = document.createElement('hr');
  const h2 = document.createElement('h2');
  const h6 = document.createElement('h6');
  const p = document.createElement('p');
  const aDelete = document.createElement('a');
  const aEdit = document.createElement('a');

  // the .(dot) id property gives us the auto-id of the document in context
  id = doc.id;

  // get all three fiels of the note with the .get() accessor method
  title = doc.get('title');
  body = doc.get('body');
  timestamp = doc.get('timestamp');

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

  // finally, we append each element in the div to make them
  // show up in our page
  displayNotesDiv.appendChild(h2);
  displayNotesDiv.appendChild(h6);
  displayNotesDiv.appendChild(p);
  displayNotesDiv.appendChild(aDelete);
  displayNotesDiv.appendChild(aEdit);
  displayNotesDiv.appendChild(hr);
};
