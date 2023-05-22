import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile,
} from 'firebase/auth';
import {
  doc, getDoc, getFirestore, setDoc,
} from 'firebase/firestore';
import { ActionTypes } from './actions';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBjQFRMKpSsfef5jb89PjIe7yDDCXEp31s',
  authDomain: 'airead.firebaseapp.com',
  projectId: 'airead',
  storageBucket: 'airead.appspot.com',
  messagingSenderId: '1064959847191',
  appId: '1:1064959847191:web:0b6e632e679ebd9af46552',
  measurementId: 'G-SNL9THW1S2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export function createUserDoc(uid, email, displayName, age) {
  return (dispatch) => {
    setDoc(doc(db, 'Users', `${uid}`), {
      email,
      displayName,
      age,
    })
      .then(() => {
        dispatch({
          type: ActionTypes.SET_USER,
          payload: { email, displayName, age },
        });
      });
  };
}

export function fetchUserDoc(uid) {
  return (dispatch) => {
    getDoc(doc(db, 'Users', uid)).then((docSnap) => {
      dispatch({
        type: ActionTypes.SET_USER,
        payload: docSnap.data(),
      });
    });
  };
}

export function login(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      fetchUserDoc(userCredential.user.uid);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function signup(email, password, displayName, age) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(auth.currentUser, {
        displayName,
      }).then(() => {
        createUserDoc(
          auth.currentUser.uid,
          email,
          displayName,
          age,
        );
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
