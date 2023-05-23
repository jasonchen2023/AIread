// adapted from https://codepen.io/codemzy/pen/YzELgbb, https://codepen.io/aquilesb/pen/LKLqZW , and chatGPT

import React, { useRef, useState } from 'react';
import './FileUpload.scss';
import { useSelector } from 'react-redux';
import { uploadFile } from '../../firebase';

function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedPages, setUploadedPages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const inputRef = useRef(null);
  const user = useSelector((state) => state.user.displayName);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // NOTE: code for pdf display. Move to appropriate component
  const viewFile = async (file) => {
    const fileReader = new FileReader();

    fileReader.onload = async (result) => {
      const typeArray = new Uint8Array(result.target.result);
      // eslint-disable-next-line
      const loadingTask = pdfjsLib.getDocument(typeArray);
      const pdf = await loadingTask.promise;

      const pages = [];
      // eslint-disable-next-line
      for (let i = 1; i <= pdf.numPages; i++) {
        // eslint-disable-next-line
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport,
        };
        // eslint-disable-next-line
        await page.render(renderContext).promise;

        pages.push(canvas.toDataURL('image/png')); // Save the canvas as an image data URL
      }

      setUploadedPages((prevPages) => [...prevPages, { name: file.name, pages }]);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      console.error(file.name, 'is not a pdf file.');
      // eslint-disable-next-line
      alert('Please select a PDF');
    } else {
      setSelectedFile(file);
    }
  };

  const handleDropFile = (e) => {
    const file = e.dataTransfer.files[0];
    if (file.type !== 'application/pdf') {
      console.error(file.name, 'is not a pdf file.');
      // eslint-disable-next-line
      alert('Please select a PDF');
    } else {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    //   viewFile(e.dataTransfer.files[0]);
    // }
    console.log(e);
    handleDropFile(e);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileClick = (index) => {
    setUploadedPages((prevPages) => {
      const updatedPages = [...prevPages];
      updatedPages[index].expanded = !updatedPages[index].expanded;
      return updatedPages;
    });
  };

  const processFile = () => {
    const file = selectedFile;
    if (file === null) {
      // eslint-disable-next-line
      alert('No File Selected');
    } else {
      uploadFile(file)
        .then((downloadURL) => {
          window.location.reload();
          console.log('Download URL:', downloadURL);
          // Handle the download URL (save it to state, send it to the server, etc.)
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <div>
      <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" id="input-file-upload" webkitdirectory onChange={handleFileSelect} />
        {/* eslint-disable-next-line */}
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
          <div>
            <p>Drag and drop your file here or</p>
            <button type="button" className="upload-button" onClick={onButtonClick}>
              Select a file
            </button>
          </div>
        </label>
        {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} />}
      </form>
      {selectedFile && (
      <div>
        Selected File: {selectedFile.name}
      </div>
      )}
      <button type="button" onClick={processFile}>Upload</button>

      {/* <div id="uploaded-pages">
        {uploadedPages.map((file, index) => (
          // eslint-disable-next-line
          <div key={index}>
            <h3 onClick={() => handleFileClick(index)}>{file.name}</h3>
            {file.expanded && file.pages.map((page, pageIndex) => (
              // eslint-disable-next-line
              <img key={pageIndex} src={page} alt={`Page ${pageIndex + 1}`} />
            ))}
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default FileUpload;
