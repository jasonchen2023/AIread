import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Nav(props) {
  return (
    <nav>
      <ul>
        <li><NavLink to="/home">Home</NavLink></li>
        <li><NavLink to="/home/reading/1">Econ Reading</NavLink></li>
        <li><NavLink to="/">Logout</NavLink></li>
      </ul>
    </nav>
  );
}
