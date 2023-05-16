import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Login(props) {
  return (
    <div>
      Welcome
      <NavLink to="/home">Login</NavLink>
      <NavLink to="/home">Signup</NavLink>
    </div>
  );
}
