import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile,
} from 'firebase/auth';
import {
  doc, getDoc, getFirestore, setDoc,
} from 'firebase/firestore';
import {
  getStorage, ref, uploadBytes, getDownloadURL, listAll,
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

  return uploadBytes(storageRef, file)
    .then(() => {
      console.log('Waiting for download URL');
      return getDownloadURL(storageRef); // Return the promise here
    })
    .then((downloadURL) => {
      console.log('File uploaded successfully. Download URL:', downloadURL);
      return downloadURL;
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      throw error;
    });
}

// written with help of ChatGPT
export function getAllFiles() {
  return async (dispatch) => {
    try {
      const storageRef = ref(storage, `${auth.currentUser.uid}`);
      const items = await listAll(storageRef);

      const files = await Promise.all(
        items.items.map(async (item) => {
          const fileURL = await getDownloadURL(item);
          const url = new URL(fileURL);
          const searchParams = new URLSearchParams(url.search);
          const fileId = searchParams.get('token');
          return { name: item.name, url: fileURL, id: fileId };
        }),
      );

      const filesMap = {};
      files.forEach((file) => {
        filesMap[file.id] = { name: file.name, url: file.url };
      });

      dispatch({ type: ActionTypes.FETCH_FILES, payload: { files: filesMap } });
    } catch (error) {
      console.error('Error fetching files from Firebase Storage:', error);
      throw error;
    }
  };
}

// export async function getAllFiles() {
//   try {
//     const storageRef = ref(storage, `${auth.currentUser.uid}`);
//     const items = await listAll(storageRef);

//     const files = await Promise.all(
//       items.items.map(async (item) => {
//         const fileURL = await getDownloadURL(item);
//         return { name: item.name, url: fileURL };
//       }),
//     );

//     return files;
//   } catch (error) {
//     console.error('Error fetching files from Firebase Storage:', error);
//     throw error;
//   }
// }
