import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchUserDoc, logOut } from '../firebase';
import * as Constants from '../utils/constants';

export default function Home(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      Here is a dashboard of all your readings
      <NavLink to="/reading/1">Econ Reading</NavLink>
      <NavLink to="/reading/2">Math Reading</NavLink>
      <NavLink to="/reading/3">History Reading</NavLink>
      <button type="button" onClick={() => dispatch(logOut(navigate))}>Logout</button>
    </div>
  );
}
