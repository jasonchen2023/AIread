import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDoc, getAllFiles } from '../../services/firebase';
import FileUpload from './FileUpload';
import FileList from './FileList';
import styles from './styles.module.scss';
import Nav from '../nav/nav';

export default function Home(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.displayName);

  useEffect(() => {
    dispatch(fetchUserDoc());
    dispatch(getAllFiles());
  }, []);

  return (
    <div id={styles.homeContainer}>
      <Nav />
      <div id={styles.welcome}>
        Welcome, {user} 👋
      </div>
      <div id={styles.fileUpload}>
        <FileUpload />
      </div>
      <div id={styles.fileList}>
        <FileList />
      </div>
    </div>
  );
}
