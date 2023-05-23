// chatgpt

import React, { useEffect, useState } from 'react';
import { getAllFiles } from '../../firebase';

function FileList() {
  const [fileURLs, setFileURLs] = useState([]);

  async function fetchFiles() {
    try {
      const files = await getAllFiles();
      setFileURLs(files);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="file-list">
      <h2>File List</h2>
      <ul>
        {fileURLs.map((fileURL, index) => (
          // eslint-disable-next-line
          <li key={index}>
            <a href={fileURL} target="_blank" rel="noopener noreferrer">
              {fileURL}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
