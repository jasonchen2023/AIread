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

  // // credit: text extraction adapted from https://pspdfkit.com/blog/2023/how-to-extract-text-from-a-pdf-using-javascript/
  // // eslint-disable-next-line
  // pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

  // function extractText(pdfUrl) {
  //   // eslint-disable-next-line
  //   const pdf = pdfjsLib.getDocument(pdfUrl);
  //   // eslint-disable-next-line
  //   return pdf.promise.then((pdf) => {
  //     const totalPageCount = pdf.numPages;
  //     const countPromises = [];
  //     for (
  //       let currentPage = 1;
  //       currentPage <= totalPageCount;
  //       // eslint-disable-next-line
  //       currentPage++
  //     ) {
  //       const page = pdf.getPage(currentPage);
  //       countPromises.push(
  //         // eslint-disable-next-line
  //       page.then((page) => {
  //           const textContent = page.getTextContent();
  //           return textContent.then((text) => {
  //             console.log(text.items);
  //             return text.items
  //               .map((s) => {
  //                 return s.str;
  //               })
  //               .join('');
  //           });
  //         }),
  //       );
  //     }

  //     return Promise.all(countPromises).then((texts) => {
  //       return texts.join('');
  //     });
  //   });
  // }
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
