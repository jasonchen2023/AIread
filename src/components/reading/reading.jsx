/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import styles from './styles.module.scss';
import { getFile } from '../../firebase';

function Reading() {
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const [fileText, setFileText] = useState('');

  const convertPdfToText = async () => {
    try {
      console.log(`converting pdf with title: ${selectedFile.title}`);
      const res = await axios.postForm('https://selectpdf.com/api2/pdftotext/', {
        key: import.meta.env.VITE_PDFTOTEXT_API_KEY,
        url: selectedFile.url,
      });
      setFileText(res.data.trim());
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getFile(id));
  }, []);

  useEffect(() => {
    if (selectedFile.url && selectedFile.id === id) {
      convertPdfToText();
    }
  }, [selectedFile.url]);

  return (
    <div id={styles.container}>
      <h3>Reading:</h3>
      {selectedFile.title}

      <div id={styles.content}>
        <h3>Content:</h3>
        {fileText}
      </div>
    </div>
  );
}

export default Reading;
