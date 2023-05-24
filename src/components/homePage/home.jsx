import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchUserDoc, logOut, auth } from '../../firebase';
import * as Constants from '../../utils/constants';
import FileUpload from './FileUpload';
import FileList from './FileList';

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
    <div>
      Welcome Home {user}

      <FileUpload />

      Here is a dashboard of all your readings

      <FileList />
      <NavLink to="/reading/1">Econ Reading</NavLink>
      <NavLink to="/reading/2">Math Reading</NavLink>
      <NavLink to="/reading/3">History Reading</NavLink>
      <button type="button" onClick={() => dispatch(logOut())}>Logout</button>
    </div>
  );
}
