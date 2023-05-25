import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchUserDoc, logOut, auth } from '../../firebase';
import * as Constants from '../../utils/constants';
import FileUpload from './FileUpload';
import FileList from './FileList';
import styles from './styles.module.scss';

export default function Home(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.displayName);

  const makeAPICall = async () => {
    const token = await auth.currentUser.getIdToken();
    axios.get(`${Constants.BASE_URL}/gpt`, { headers: { Authorization: token } }).then((result) => {
      console.log(result.data.response);
    });
  };

  useEffect(() => {
    dispatch(fetchUserDoc());
    makeAPICall();
  }, []);

  return (
    <div id={styles.homeContainer}>
      <div id={styles.header}>
        <div>AIread</div>
        <div>Profile</div>
      </div>
      <div id={styles.welcome}>
        Welcome Home {user}
      </div>
      <div id={styles.fileUpload}>
        <FileUpload />
      </div>

      <div id={styles.fileList}>
        Here is a dashboard of all your readings
        <FileList />
      </div>

      <NavLink to="/reading/1">Econ Reading</NavLink>
      <NavLink to="/reading/2">Math Reading</NavLink>
      <NavLink to="/reading/3">History Reading</NavLink>
      <button type="button" onClick={() => dispatch(logOut())}>Logout</button>
    </div>
  );
}
