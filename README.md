# FIRESTORE NOTES APP

This is very simple notes app which uses the Firestore database to store notes while looking good.

## TUTORIAL

You can check the explaination of the code at my article on [Firebase Firestore Tutorial: Creating a Simple Notes App](https://bigcodenerd.org/firebase-firestore-notes-app-example/).

## TODO

- ~~Add notes reading functionality~~

- ~~Add edit functionality~~

- Add search functionality

- Clear inputs after pressing SAVE

- Remove note data from sessionStorage after a successful SAVE operation to the Firestore

## REQUIREMENTS

- A Google account for Firebase console.

- A local server. Recomended: `npm install -g live-server`.

## INSTALLATION

- `clone` the repo using `git clone https://github.com/utkarshbhatt12/firestore-notes`.

- `cd` into `firestore-notes`.

- Go to [https://console.firebase.google.com](https://console.firebase.google.com) and create a *new* project with whatever name and the appropriate country. You'll be redirected to the project **Get started here** page.

- Click on **Add Firebase to your web app** and copy the config.

- Open the `/js/firebase/__init.js` in your favorite text editor and add the replace the config keys on the top of the file. The keys look like this:

``` javascript
firebase.initializeApp({
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: ""
});
```

- Now go the console again, and click on **Database** > **GET STARTED**. Select **Cloud Firestore** if (when) given the choice.

- Click on the **RULES** tab, and change the `read, write` rule to allow *always*. The rules should look as follows:

``` javascript
service cloud.firestore {
    match /databases/{database}/documents {
        match /{document=**} {
            // NOTE: don't use something like this prod...
            allow read, write: if true;
        }
    }
}
```

- In the firestore-notes directory, run the live server using `live-server index.html`. The app should start running at `http://127.0.0.1:8080/` on your default browser.

## LICENSE

MIT License

Copyright (c) \[2018\] \[UTKARSH BHATT\]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
