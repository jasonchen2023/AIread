import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFiles } from '../../firebase';
import { selectFile } from '../../actions';

function FileList() {
  const allFiles = useSelector((state) => state.files.allFiles);

  return (
    <div className="file-list">
      <h2>File List</h2>
      <ul>
        {allFiles.map((el) => {
          return (
            <li key={el.id}>
              <NavLink
                to={`/reading/${el.id}`}
                rel="noopener noreferrer"
              >
                {el.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FileList;
