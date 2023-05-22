import React from 'react';
import { NavLink } from 'react-router-dom';
import FileUpload from './FileUpload';

export default function Home(props) {
  return (
    <div>
      Welcome Home
      Here is a dashboard of all your readings
      <FileUpload />
      <NavLink to="/home/reading/1">Econ Reading</NavLink>
      <NavLink to="/home/reading/2">Math Reading</NavLink>
      <NavLink to="/home/reading/3">History Reading</NavLink>
    </div>
  );
}
