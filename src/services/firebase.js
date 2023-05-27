import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, updatePassword } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, getDocs, query, onSnapshot, updateDoc, arrayUnion, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import axios from 'axios';
import { ActionTypes } from '../actions';
import { convertPDFtoText, chunkify } from './processFile';
import { BASE_URL } from '../utils/constants';

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

// USER DOCUMENT ACTIONS
// =========================================================================================================
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
          payload: { email, displayName, age, fieldOfInterest: '' },
        });
      });
  };
}

export function updateUserDoc(fields) {
  return (dispatch) => {
    setDoc(
      doc(db, 'Users', auth.currentUser.uid),
      fields,
      { merge: true },
    )
      .then(() => {
        dispatch({ type: ActionTypes.UPDATE_PROFILE, payload: fields });
      })
      .catch((error) => {
        console.log(error.message);
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

export function uploadProfileImage(file, successCallback, failureCallback) {
  const storageRef = ref(getStorage(), `profilePics/${auth.currentUser.uid}`);
  uploadBytes(storageRef, file)
    .then(() => {
      getDownloadURL(storageRef).then((url) => {
        updateProfile(auth.currentUser, { photoURL: url });
        successCallback(url);
      });
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      failureCallback();
    });
}

// LOGIN SYSTEM ACTIONS
// =========================================================================================================
export function login(email, password, failureToast, fullpageApi) {
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        fullpageApi.silentMoveTo(1);
      })
      .catch((error) => {
        failureToast(error.message);
      });
  };
}

export function signup(email, password, displayName, age, failureToast, fullpageApi) {
  return (dispatch) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        fullpageApi.silentMoveTo(1);
        updateProfile(auth.currentUser, { displayName }).then(() => {
          dispatch(createUserDoc(
            email,
            displayName,
            age,
          ));
        });
      })
      .catch((error) => {
        failureToast(error.message);
      });
  };
}

export function setNewPassword(newPassword, setResetPassword, successToast, failureToast) {
  if (newPassword === '' || newPassword.indexOf(' ') >= 0) {
    failureToast();
    return;
  }
  updatePassword(auth.currentUser, newPassword)
    .then(() => {
      console.log('HERE');
      setResetPassword('');
      successToast();
    })
    .catch((error) => {
      console.log(error);
      failureToast();
    });
}

export function logOut(navigate) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.HIDE_USER });
    auth.signOut();
    navigate('/');
  };
}

// FILE ACTIONS
// =========================================================================================================

// uploads a file to firebase storage, adds a document to firestore, runs pdf to text
export function uploadFile(file, title, color) {
  const storageRef = ref(getStorage(), `${auth.currentUser.uid}/${file.name}`);
  uploadBytes(storageRef, file)
    .then(() => {
      getDownloadURL(storageRef)
        .then(async (url) => {
          console.log(`adding reading doc in firestore (url: ${url})`);

          try {
            // process PDF to text
            const rawContent = await convertPDFtoText(url);
            console.log(rawContent);

            // process text to chunks
            const chunks = chunkify(rawContent);

            await addDoc(collection(db, `Users/${auth.currentUser.uid}/readings`), {
              title,
              color,
              author: '',
              topLevelSummary: '',
              url,
              rawContent,
              chunks,
            });
          } catch (err) {
            console.log(`error: ${err}`);
          }
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
          console.log(el.data());
          files.push({
            id: el.id,
            title: el.data().title,
            color: el.data().color,
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
    try {
      const q = query(doc(db, `Users/${auth.currentUser.uid}/readings`, id));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        dispatch({
          type: ActionTypes.SELECT_FILE,
          payload: { ...querySnapshot.data(), id: querySnapshot.id },
        });
      });
    } catch (error) {
      console.error('Error fetching files from Firestore:', error);
    }
  };
}

// deletes document by id and title
export function deleteFile(id, title) {
  const docRefToDelete = doc(collection(db, `Users/${auth.currentUser.uid}/readings`), id);

  deleteDoc(docRefToDelete)
    .then(() => {
      console.log('Document data deleted successfully from firestore');
      getAllFiles();
    })
    .catch((error) => {
      console.error('Error deleting document:', error);
    });

  const storageRef = ref(getStorage(), `${auth.currentUser.uid}/${title}`);

  // Delete the file
  deleteObject(storageRef).then(() => {
    console.log('Document deleted successfully from storage');
  }).catch((error) => {
    console.error('Error deleting document from storage:', error);
  });
}

// OPENAI SUMMARY PROCESSING
// =========================================================================================================
export async function makeSummaries(fileID, chunkList) {
  const contentArray = chunkList.map((chunk) => chunk.content);
  console.log(contentArray);

  const res = await axios.post(`${BASE_URL}/summaries`, {
    summaryType: 'document',
    content: contentArray,
  });
  const summaryArray = res.data.map((chunk) => chunk[1]);
  console.log(summaryArray);

  // from chatgpt
  const documentRef = doc(db, `Users/${auth.currentUser.uid}/readings`, fileID);
  const updatedChunks = chunkList.map((chunk, index) => {
    // Replace the summary of each chunk with the new summary from newSummaries
    return { ...chunk, summary: summaryArray[index] };
  });
  await updateDoc(documentRef, { chunks: updatedChunks });
}
