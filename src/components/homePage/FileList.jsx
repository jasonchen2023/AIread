import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFiles } from '../../firebase';
import { selectFile } from '../../actions';
import './FileList.scss';

function FileList() {
  const allFiles = useSelector((state) => state.files.allFiles);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFiles());
  }, []);

  useEffect(() => {
    console.log(allFiles);
  }, [allFiles]);

  return (
    <div className="file-list">
      <h2>File List</h2>
      <ul>
        {Object.keys(allFiles).map((fileId) => {
          const file = allFiles[fileId];
          return (
            <li key={fileId}>
              <NavLink
                to={`/reading/${fileId}`}
                rel="noopener noreferrer"
              >
                {file.name}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FileList;
