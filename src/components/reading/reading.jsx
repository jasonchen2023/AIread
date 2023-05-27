import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectFile } from '../../actions';
import styles from './styles.module.scss';

function FileList() {
  const allFiles = useSelector((state) => state.files.allFiles); // key: id, value: {name: , url: }
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileText, setFileText] = useState('');
  const [uploadedPages, setUploadedPages] = useState([]);

  const dispatch = useDispatch();
  const { id } = useParams();

  // credit: text extraction adapted from https://pspdfkit.com/blog/2023/how-to-extract-text-from-a-pdf-using-javascript/
  // eslint-disable-next-line
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.js';

  function extractText(pdfUrl) {
    // eslint-disable-next-line
    const pdf = pdfjsLib.getDocument(pdfUrl);
    // eslint-disable-next-line
    return pdf.promise.then((pdf) => {
      const totalPageCount = pdf.numPages;
      const countPromises = [];
      for (
        let currentPage = 1;
        currentPage <= totalPageCount;
        // eslint-disable-next-line
        currentPage++
      ) {
        const page = pdf.getPage(currentPage);
        countPromises.push(
          // eslint-disable-next-line
        page.then((page) => {
            const textContent = page.getTextContent();
            return textContent.then((text) => {
              console.log(text.items);
              return text.items
                .map((s) => {
                  return s.str;
                })
                .join('');
            });
          }),
        );
      }

      return Promise.all(countPromises).then((texts) => {
        return texts.join('');
      });
    });
  }

  useEffect(() => {
    console.log(allFiles);
    const file = allFiles[id];
    setFileName(file.name);
    setFileUrl(file.url);
    setTimeout(() => {
      extractText(file.url).then(
        (text) => {
          setFileText(text);
        },
        (reason) => {
          console.error(reason);
        },
      );
    }, 200);
  }, []);

  return (
    <div id={styles.container}>
      <h3>Reading:</h3>
      {fileName}

      <div id={styles.content}>
        <h3>Content:</h3>

        {fileText}
      </div>
    </div>
  );
}

export default FileList;
