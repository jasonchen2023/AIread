import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

function SelectFileButton({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== 'application/pdf') {
        toast('Please select a PDF file!');
      } else {
        onFileSelect(file);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <button type="button" onClick={handleClick}>Upload PDF</button>
    </div>
  );
}

export default SelectFileButton;
