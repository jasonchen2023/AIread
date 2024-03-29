// adapted from https://codepen.io/codemzy/pen/YzELgbb, https://codepen.io/aquilesb/pen/LKLqZW , and chatGPT

import React, { useRef, useState } from 'react';
import './FileUpload.scss';
import { toast } from 'react-toastify';
import ConvertApi from 'convertapi-js';
import { uploadFile, auth } from '../../services/firebase';
import FileUploadModal from './fileUploadModal';
import { saveTextForChat } from '../../services/TextProcess';

function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file.type !== 'application/pdf') {
      console.error(file.name, 'is not a pdf file.');
      // eslint-disable-next-line
      toast('Please select a PDF file!')
    } else {
      setSelectedFile(file);
    }
  };

  const handleDropFile = (e) => {
    const file = e.dataTransfer.files[0];
    if (file.type !== 'application/pdf') {
      console.error(file.name, 'is not a pdf file.');
      // eslint-disable-next-line
      toast('Please select a PDF file!')
    } else {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleDropFile(e);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const failureToast = (err) => {
    toast(err);
  };

  const processFileUpload = async (newFile, title, color) => {
    const token = await auth.currentUser.getIdToken();
    const file = newFile;
    if (file === null) {
      // eslint-disable-next-line
      toast('No File Selected');
    } else {
      setSelectedFile(null);

      // to be fixed:
      const { fileId, content } = await uploadFile(file, title, failureToast, color, token);
      const res = await saveTextForChat(fileId, content);
      window.location.href = `/reading/${fileId}`;
    }
  };

  const processFileCancel = () => {
    setSelectedFile(null);
  };

  return (
    <div id="fileUploadContainer">
      <FileUploadModal selectedFile={selectedFile} processFileUpload={processFileUpload} processFileCancel={processFileCancel} />
      <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" id="input-file-upload" onChange={handleFileSelect} />
        {/* eslint-disable-next-line */}
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
          <div>
            <p>Drag and drop your file here or</p>
            <button type="button" className="select-file-button" onClick={onButtonClick}>
              Select a file
            </button>
          </div>
        </label>
        {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} />}
      </form>
    </div>
  );
}

export default FileUpload;
