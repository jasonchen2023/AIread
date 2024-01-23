/* eslint-disable no-unused-vars */
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, updatePassword } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, query, onSnapshot, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import axios from 'axios';
import { getAnalytics } from 'firebase/analytics';
import { ActionTypes } from '../actions';
import { convertPDFtoText, chunkifyByParagraph } from './TextProcess';
import { ANOTHER_CONSTANT, BASE_URL, wordLimit } from '../utils/constants';

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
// export function uploadFile(file, title, color, failureToast) {
export function uploadFile(file, title, failureToast, color = null, token = null) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const storageRef = ref(getStorage(), auth.currentUser ? `Users/${auth.currentUser.uid}/${file.name}` : `demo/${file.name}`);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);
      console.log(`adding reading doc in firestore (url: ${url})`);

      // const rawContent = await convertPDFtoText(url);

      const res = await axios.post(`${ANOTHER_CONSTANT}/text-extract`, { fileUrl: url }, { headers: { Authorization: token } });
      const rawContent = res.data;

      console.log(rawContent);

      const wordList = rawContent.split(' ');
      if (wordList.length > wordLimit) {
        throw new Error(`Max word limit of ${wordLimit} exceeded. Please upload a smaller file.`);
      }

      // process text to chunks
      const chunks = chunkifyByParagraph(rawContent);

      const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
      const docRef = await addDoc(collection(db, docPath), {
        title,
        color,
        author: '',
        topLevelSummary: '',
        url,
        rawContent,
        chunks,
      });

      const fileId = docRef.id;
      resolve({ fileId, rawContent });
    } catch (error) {
      console.error('Error uploading file:', error);
      failureToast(error.message);
      reject(error);
    }
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
      const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
      // const q = query(doc(db, `Users/${auth.currentUser.uid}/readings`, id));
      const q = query(doc(db, docPath, id));
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

  const storageRef = ref(getStorage(), `Users/${auth.currentUser.uid}/${title}`);

  // Delete the file
  deleteObject(storageRef).then(() => {
    console.log('Document deleted successfully from storage');
  }).catch((error) => {
    console.error('Error deleting document from storage:', error);
  });
}

export function pushUserNote(readingId, note, chunkNum, successCallback, errorCallback) {
  const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
  const noteRef = doc(collection(db, docPath), `${readingId}`);
  return runTransaction(db, (t) => {
    return t.get(noteRef).then((readingDoc) => {
      if (!readingDoc.exists) return;
      const chunkInfo = readingDoc.get('chunks');
      chunkInfo[chunkNum].userNotes = note;
      t.set(noteRef, { chunks: chunkInfo }, { merge: true });
    })
      .then(() => successCallback());
  }).catch(() => {
    errorCallback();
  });
}

export async function saveUserNote(readingId, note, successCallback, errorCallback) {
  try {
    const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
    const documentRef = doc(db, docPath, readingId);
    await updateDoc(documentRef, { notes: note });

    successCallback();
  } catch (error) {
    errorCallback(error);
  }
}

export function getUserNoteNew(readingId, errorCallback) {
  const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
  const noteRef = doc(collection(db, docPath), `${readingId}`);
  return getDoc(noteRef)
    .then((readingDoc) => {
      if (readingDoc.exists()) {
        const userNotes = readingDoc.data().notes;
        console.log('userNotes:', userNotes);
        return userNotes;
      } else {
        return Promise.reject(new Error('Document does not exist.'));
      }
    })
    .catch((error) => {
      errorCallback();
      return Promise.reject(error);
    });
}

export function getUserNote(readingId, chunkNum, errorCallback) {
  const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
  const noteRef = doc(collection(db, docPath), `${readingId}`);
  return getDoc(noteRef)
    .then((readingDoc) => {
      if (readingDoc.exists()) {
        const chunkInfo = readingDoc.data().chunks;
        console.log('chunkinfo:', chunkInfo);
        return chunkInfo[chunkNum].userNotes;
      } else {
        return Promise.reject(new Error('Document does not exist.'));
      }
    })
    .catch((error) => {
      errorCallback();
      return Promise.reject(error);
    });
}

export function removeUserNote(readingId, userNoteIndex, chunkNum, successCallback, errorCallback) {
  const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
  const noteRef = doc(collection(db, docPath), `${readingId}`);
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
export async function makeSummaries(fileID, chunkList, token = null, customPrompt = null) {
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
  const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
  const documentRef = doc(db, docPath, fileID);
  const updatedChunks = chunkList.map((chunk, index) => {
    // Replace the summary of each chunk with the new summary from newSummaries
    return { ...chunk, summary: summaryArray[index] };
  });
  await updateDoc(documentRef, { chunks: updatedChunks });
}

async function getSummary(chunkList, prompt, maxTokens, promptType) {
  const res = await axios.post(`${ANOTHER_CONSTANT}/summaries`, {
    summaryType: 'document',
    content: chunkList,
    prompt,
    maxTokens,
    promptType,
  });
  return res.data;
}

export async function uploadDocumentSummary(fileID, content) {
  const chunkList = chunkifyByParagraph(content, 3000);
  const contentArray = chunkList.map((chunk) => chunk.content);

  const maxTokenPerChunk = 1000 / chunkList.length;

  const prompt = 'Please summarize and preserve as much text as possible. This will be passed in as document context to help answer user questions';
  const promptType = 'chat-context';
  const summaryList = await getSummary(contentArray, prompt, maxTokenPerChunk, promptType);

  const summary = summaryList.map((chunk) => chunk[1]).join('');

  const docPath = auth.currentUser ? `Users/${auth.currentUser.uid}/readings` : 'demo';
  const documentRef = doc(db, docPath, fileID);
  await updateDoc(documentRef, { summary });
}
