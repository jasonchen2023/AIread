import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFiles } from '../../firebase';
import { selectFile } from '../../actions';
import './FileList.scss';

function FileList() {
  const allFiles = useSelector((state) => state.files.allFiles);

  return (
    <div className="file-list">
      <h2 id="readingsHeader">Your Readings</h2>
      <ul>
        {allFiles.map((el) => {
          return (
            <div className="card" key={el.id}>
              <NavLink to={`/reading/${el.id}`} rel="noopener noreferrer">
                <div className="fileTitle">{el.title}</div>
              </NavLink>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default FileList;
