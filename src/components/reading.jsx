import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFiles } from '../firebase';
import { selectFile } from '../actions';
import PDFViewer from './pdfViewer';

function FileList() {
  const allFiles = useSelector((state) => state.files.allFiles); // key: id, value: {name: , url: }
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploadedPages, setUploadedPages] = useState([]);

  const dispatch = useDispatch();
  const { id } = useParams();

  // not sure why I need to call getAllFiles again. State of allFiles should persist, but seems to be empty object upon load
  useEffect(() => {
    dispatch(getAllFiles());
  }, [dispatch]);

  useEffect(() => {
    console.log(allFiles);
    const file = allFiles[id];
    if (Object.keys(allFiles).length > 0) {
      setFileName(file.name);
      setFileUrl(file.url);
    }
  }, [allFiles]);

  return (
    <div>
      Current Reading: {fileName}
      <br />
      File URL: {fileUrl}
      <PDFViewer url={fileUrl} />
    </div>
  );
}

export default FileList;
