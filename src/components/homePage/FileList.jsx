import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteFile } from '../../services/firebase';
import trash from '../../img/trash.png';
import './FileList.scss';

function FileList() {
  const allFiles = useSelector((state) => state.files.allFiles);

  return (
    <div className="file-list">
      <h2 id="readingsHeader">Your Readings</h2>
      <ul>
        {allFiles.map((el) => {
          return (
            <div className="fileRow">
              <div className="card" key={el.id}>
                <NavLink to={`/reading/${el.id}`} rel="noopener noreferrer">
                  <div className="fileTitle">{el.title}</div>
                </NavLink>
              </div>
              <img className="trash" alt="Delete" src={trash} onClick={() => { deleteFile(el.id, el.title); }} />
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default FileList;
