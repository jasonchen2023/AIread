import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { deleteFile } from '../../services/firebase';
import trash from '../../img/trash.png';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './FileList.scss';

function FileList() {
  const allFiles = useSelector((state) => state.files.allFiles);
  const [filterText, setFilterText] = useState('');

  const launchModal = (id, title) => {
    confirmAlert({
      // eslint-disable-next-line react/no-unstable-nested-components
      customUI: ({ onClose }) => {
        return (
          <div className="alert">
            <div className="alert-title">Confirm deletion of {title}?</div>
            <div className="confirm-delete-buttons">
              <button type="button"
                onClick={() => {
                  deleteFile(id, title);
                  onClose();
                }}
                className="alert-delete-btn"
              >
                Delete
              </button>
              <button type="button" onClick={onClose} className="alert-btn-no">No</button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <div className="file-list">
      <div id="headerRowContainer">
        <h2 id="readingsHeader">Your Readings</h2>
        <input value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="search..." />
      </div>
      <ul>
        {allFiles.filter((file) => file.title.toLowerCase().includes(filterText.toLowerCase())).map((el, index) => {
          return (
            <div className="fileRow" key={el.id}>
              <div id="readingSwatch" style={{ backgroundColor: el.color }} />
              <div className="cardy">
                <div className="fileTitle">
                  <NavLink to={`/reading/${el.id}`} rel="noopener noreferrer">
                    {el.title}
                  </NavLink>
                  {/* <img className="trash" alt="Delete" src={trash} onClick={() => { deleteFile(el.id, el.title); }} /> */}
                  <img className="trash" alt="Delete" src={trash} onClick={() => launchModal(el.id, el.title)} />
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
