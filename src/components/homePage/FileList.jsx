import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteFile } from '../../services/firebase';
import trash from '../../img/trash.png';
import './FileList.scss';

function FileList() {
  const allFiles = useSelector((state) => state.files.allFiles);
  const [filterText, setFilterText] = useState('');

  return (
    <div className="file-list">
      <div id="headerRowContainer">
        <h2 id="readingsHeader">Your Readings</h2>
        <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="search..." />
      </div>
      <ul>
        {allFiles.filter((file) => file.title.toLowerCase().includes(filterText.toLowerCase())).map((el, index) => {
          return (
            <div className="fileRow">
              <div id="readingSwatch" style={{ backgroundColor: el.color }} />
              <div className="cardy" key={el.id}>
                <div className="fileTitle">
                  <NavLink to={`/reading/${el.id}`} rel="noopener noreferrer">
                    {el.title}
                  </NavLink>
                  <img className="trash" alt="Delete" src={trash} onClick={() => { deleteFile(el.id, el.title); }} />
                </div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default FileList;
