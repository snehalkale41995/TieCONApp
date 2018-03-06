import * as firebase from 'firebase';
import 'firebase/firestore';

firebase.initializeApp({
    apiKey: 'AIzaSyDM4bfZawYFEvNsYlNyNZLEfTPSPsbtUkQ',
    authDomain: 'tiecon-b3493.firebaseapp.com',
    databaseURL: 'https://tiecon-b3493.firebaseio.com',
    projectId: 'tiecon-b3493',
    storageBucket: 'tiecon-b3493.appspot.com',
    messagingSenderId: '489302991624'
});

export default firebase;