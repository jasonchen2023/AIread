/* eslint-disable no-unused-vars */
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, updatePassword } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, query, onSnapshot, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import axios from 'axios';
import { getAnalytics } from 'firebase/analytics';
import { ActionTypes } from '../actions';
import { convertPDFtoText, chunkify } from './processFile';
import { ANOTHER_CONSTANT, BASE_URL } from '../utils/constants';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAl9i0xE27g1w6QzB09KlnSMuO-_6ysQcM',
  authDomain: 'airead-b7e21.firebaseapp.com',
  projectId: 'airead-b7e21',
  storageBucket: 'airead-b7e21.appspot.com',
  messagingSenderId: '869737867265',
  appId: '1:869737867265:web:54c167f7980ace68d7b800',
  measurementId: 'G-9NC2J1E8X3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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

export function pushUserNote(readingId, note, chunkNum, successCallback, errorCallback) {
  const noteRef = doc(collection(db, `Users/${auth.currentUser.uid}/readings`), `${readingId}`);
  return runTransaction(db, (t) => {
    return t.get(noteRef).then((readingDoc) => {
      if (!readingDoc.exists) return;
      const chunkInfo = readingDoc.get('chunks');
      if (chunkInfo[chunkNum].userNotes) {
        chunkInfo[chunkNum].userNotes.push(note);
      } else {
        chunkInfo[chunkNum].userNotes = [note];
      }
      t.set(noteRef, { chunks: chunkInfo }, { merge: true });
    })
      .then(() => successCallback());
  }).catch(() => {
    errorCallback();
  });
}

export function removeUserNote(readingId, userNoteIndex, chunkNum, successCallback, errorCallback) {
  const noteRef = doc(collection(db, `Users/${auth.currentUser.uid}/readings`), `${readingId}`);
  return runTransaction(db, (t) => {
    return t.get(noteRef).then((readingDoc) => {
      if (!readingDoc.exists) return;
      const chunkInfo = readingDoc.get('chunks');
      const newArray = chunkInfo[chunkNum].userNotes.filter((value, index) => index !== userNoteIndex);
      chunkInfo[chunkNum].userNotes = newArray;
      t.set(noteRef, { chunks: chunkInfo }, { merge: true });
    })
      .then(() => successCallback());
  }).catch(() => {
    errorCallback();
  });
}

// OPENAI SUMMARY PROCESSING
// =========================================================================================================
export async function makeSummaries(fileID, chunkList, token, customPrompt = null) {
  const contentArray = chunkList.map((chunk) => chunk.content);
  console.log(contentArray);

  const res = await axios.post(`${ANOTHER_CONSTANT}/summaries`, {
    summaryType: 'document',
    content: contentArray,
    prompt: customPrompt,
  }, { headers: { Authorization: token } });
  const summaryArray = res.data.map((chunk) => chunk[1]);
  console.log(`array: ${summaryArray}`);

  // from chatgpt
  const documentRef = doc(db, `Users/${auth.currentUser.uid}/readings`, fileID);
  const updatedChunks = chunkList.map((chunk, index) => {
    // Replace the summary of each chunk with the new summary from newSummaries
    return { ...chunk, summary: summaryArray[index] };
  });
  await updateDoc(documentRef, { chunks: updatedChunks });
}
