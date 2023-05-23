import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchUserDoc, logOut } from '../../firebase';
import * as Constants from '../../utils/constants';
import FileUpload from './FileUpload';
import FileList from './FileList';

export default function Home(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.displayName);

  const makeAPICall = () => {
    axios.get(`${Constants.BASE_URL}/gpt`).then((result) => {
      console.log(result.data.response);
    });
  };

  useEffect(() => {
    navigate('/');
    dispatch(fetchUserDoc());
    makeAPICall();
  }, []);

  return (
    <div>
      Welcome Home

      <FileUpload />

      Here is a dashboard of all your readings

      <FileList />
      <NavLink to="/reading/1">Econ Reading</NavLink>
      <NavLink to="/reading/2">Math Reading</NavLink>
      <NavLink to="/reading/3">History Reading</NavLink>
      <button type="button" onClick={() => dispatch(logOut(navigate))}>Logout</button>
    </div>
  );
}
