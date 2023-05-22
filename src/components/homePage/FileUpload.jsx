import React, { useRef, useState } from 'react';

// copied from https://codepen.io/codemzy/pen/YzELgbb
function FileUpload() {
  // drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);

  // handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // function to handle file upload
  const handleFile = (files) => {
    alert(`Number of files: ${files.length}`);
  };

  // triggers when file is dropped
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input ref={inputRef} type="file" id="file-drag-upload" multiple onChange={handleChange} />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="file-drag-upload" className={dragActive ? 'drag-active' : ''}>
        <div>
          <p>Drag and drop your file here or</p>
          <button type="button" className="upload-button" onClick={onButtonClick}>
            Upload a file
          </button>
        </div>
      </label>
      <input id="file-select-upload" type="file" />

      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
    </form>
  );
}

export default FileUpload;
