import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFile } from '@fortawesome/free-solid-svg-icons';
import { CirclePicker } from 'react-color';
import styles from './fileUploadModal.module.scss';

function FileUploadModal({ selectedFile, processFileUpload, processFileCancel }) {
  if (selectedFile === null) {
    return null;
  }

  const [title, setTitle] = useState(selectedFile.name);
  const [color, setColor] = useState('#F44336');

  return (
    <div className={styles.modal}>
      <div className={styles.modalBody}>
        <div id={styles.fileNameHeader}>
          <FontAwesomeIcon icon={faFile} color="gray" />
          {selectedFile.name}
          <FontAwesomeIcon icon={faCheck} color="green" />
        </div>
        <div>
          <h2>Title</h2>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <h2>Color</h2>
          <CirclePicker color={color} onChangeComplete={(newColor) => setColor(newColor.hex)} width="100%" />
        </div>
        <div id={styles.cancelUploadBar}>
          <button type="button" id={styles.cancelButton} onClick={() => processFileCancel()}>Cancel</button>
          <button type="button" id={styles.uploadButton} onClick={() => processFileUpload(selectedFile, title, color)}>Upload</button>
        </div>
      </div>
    </div>

  );
}

export default FileUploadModal;
