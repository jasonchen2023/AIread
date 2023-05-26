import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc, getDoc, getFirestore, setDoc, getDocs, query, onSnapshot,
} from 'firebase/firestore';
import {
  getStorage, ref, uploadBytes, getDownloadURL,
} from 'firebase/storage';
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
const storage = getStorage();
export const auth = getAuth(app);

export function createUserDoc(email, displayName, age) {
  return (dispatch) => {
    setDoc(doc(db, 'Users', `${auth.currentUser.uid}`), {
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

export function fetchUserDoc() {
  return (dispatch) => {
    getDoc(doc(db, 'Users', auth.currentUser.uid)).then((docSnap) => {
      dispatch({
        type: ActionTypes.SET_USER,
        payload: docSnap.data(),
      });
    });
  };
}

export function login(email, password, errorCallback, fullpageApi) {
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        fullpageApi.silentMoveTo(1);
      })
      .catch((error) => {
        dispatch(fetchUserDoc());
        errorCallback(error.message);
      });
  };
}

export function signup(email, password, displayName, age, errorCallback, fullpageApi) {
  return (dispatch) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        fullpageApi.silentMoveTo(1);
        updateProfile(auth.currentUser, {
          displayName,
        }).then(() => {
          dispatch(createUserDoc(
            email,
            displayName,
            age,
          ));
        });
      })
      .catch((error) => {
        errorCallback(error.message);
      });
  };
}

export function logOut(navigate) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.HIDE_USER });
    auth.signOut();
  };
}

export function uploadFile(file) {
  const storageRef = ref(getStorage(), `${auth.currentUser.uid}/${file.name}`);

  uploadBytes(storageRef, file)
    .then(() => {
      getDownloadURL(storageRef).then((url) => {
        console.log(`adding reading doc in firestore (url: ${url})`);
        addDoc(collection(db, `Users/${auth.currentUser.uid}/readings`), {
          title: file.name,
          url,
          summaries: {},
        });
      });
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      throw error;
    });
}

// gets all files and listens for changes
export function getAllFiles() {
  return async (dispatch) => {
    try {
      const q = query(collection(db, `Users/${auth.currentUser.uid}/readings`));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const files = [];
        querySnapshot.forEach((el) => {
          files.push({
            id: el.id,
            title: el.data().title,
          });
        });
        dispatch({ type: ActionTypes.FETCH_FILES, payload: { files } });
      });
    } catch (error) {
      console.error('Error fetching files from Firestore:', error);
    }
  };
}

// gets file by id
export function getFile(id) {
  return (dispatch) => {
    getDoc(doc(db, `Users/${auth.currentUser.uid}/readings`, id)).then((docSnap) => {
      dispatch({
        type: ActionTypes.SELECT_FILE,
        payload: { ...docSnap.data(), id: docSnap.id },
      });
    });
  };
}
