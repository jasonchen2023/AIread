import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  fetchUserDoc, logOut, auth, getAllFiles,
} from '../../firebase';
import * as Constants from '../../utils/constants';
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
        Welcome Home {user}
      </div>
      <div id={styles.fileUpload}>
        <FileUpload />
      </div>

      <div id={styles.fileList}>
        <FileList />
      </div>

      <NavLink to="/reading/1">Econ Reading</NavLink>
      <NavLink to="/reading/2">Math Reading</NavLink>
      <NavLink to="/reading/3">History Reading</NavLink>
    </div>
  );
}
