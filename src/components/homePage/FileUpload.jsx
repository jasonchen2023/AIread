// // // adapted from https://codepen.io/codemzy/pen/YzELgbb and https://codepen.io/aquilesb/pen/LKLqZW

// // import React, { useRef, useState } from 'react';
// // import './FileUpload.scss';

// // function FileUpload() {
// //   // drag state
// //   const [dragActive, setDragActive] = useState(false);
// //   // ref
// //   const inputRef = useRef(null);

// //   // handle drag events
// //   const handleDrag = (e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     if (e.type === 'dragenter' || e.type === 'dragover') {
// //       setDragActive(true);
// //     } else if (e.type === 'dragleave') {
// //       setDragActive(false);
// //     }
// //   };

// //   // function to handle file upload
// //   const handleFile = async (file) => {
// //     console.log(file);

// //     const fileReader = new FileReader();

// //     fileReader.onload = async (result) => {
// //       const typeArray = new Uint8Array(result.target.result);
// //       // eslint-disable-next-line
// //       const loadingTask = pdfjsLib.getDocument(typeArray);
// //       const pdf = await loadingTask.promise;

// //       console.log('the pdf has a', pdf.numPages, 'page(s).');
// //       // eslint-disable-next-line
// //       // for (let i = 1; i <= pdf.numPages; i++) {
// //       //   // eslint-disable-next-line
// //       //   const page = await pdf.getPage(i);
// //       //   console.log(page);
// //       //   const viewport = page.getViewport({ scale: 2.0 });
// //       //   const canvas = document.querySelector('#pdf-canvas');
// //       //   canvas.height = viewport.height;
// //       //   canvas.width = viewport.width;

// //       //   const renderContext = {
// //       //     canvasContext: canvas.getContext('2d'),
// //       //     viewport,
// //       //   };
// //       //   // eslint-disable-next-line
// //       //   await page.render(renderContext).promise;
// //       // }
// //       const page = await pdf.getPage(1);
// //       console.log(page);
// //       const viewport = page.getViewport({ scale: 2.0 });
// //       const canvas = document.querySelector('#pdf-canvas');
// //       canvas.height = viewport.height;
// //       canvas.width = viewport.width;

// //       const renderContext = {
// //         canvasContext: canvas.getContext('2d'),
// //         viewport,
// //       };
// //       // eslint-disable-next-line
// //       await page.render(renderContext).promise;
// //     };

// //     fileReader.readAsArrayBuffer(file);
// //   };

// //   // triggers when file is dropped
// //   const handleDrop = (e) => {
// //     e.preventDefault();
// //     e.stopPropagation();
// //     setDragActive(false);
// //     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
// //       console.log(e.dataTransfer);
// //       handleFile(e.dataTransfer.files[0]);
// //     }
// //   };

// //   // triggers when file is selected with click
// //   const handleChange = (e) => {
// //     const file = e.target.files[0];
// //     console.log('file', file);
// //     if (file.type !== 'application/pdf') {
// //       console.error(file.name, 'is not a pdf file.');
// //     }
// //     handleFile(file);
// //   };

// //   // triggers the input when the button is clicked
// //   const onButtonClick = () => {
// //     inputRef.current.click();
// //   };

// //   return (
// //     <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
// //       <input ref={inputRef} type="file" id="input-file-upload" multiple onChange={handleChange} />
// //       {/* eslint-disable-next-line */}
// //       <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
// //         <div>
// //           <p>Drag and drop your file here or</p>
// //           <button type="button" className="upload-button" onClick={onButtonClick}>Upload a file</button>
// //         </div>
// //       </label>
// //       {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} />}
// //       <canvas id="pdf-canvas" />
// //     </form>
// //   );
// // }

// // export default FileUpload;

// import React, { useRef, useState } from 'react';
// import './FileUpload.scss';

// function FileUpload() {
//   const [dragActive, setDragActive] = useState(false);
//   const [uploadedPages, setUploadedPages] = useState([]);

//   const inputRef = useRef(null);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   };

//   const handleFile = async (file) => {
//     const fileReader = new FileReader();

//     fileReader.onload = async (result) => {
//       const typeArray = new Uint8Array(result.target.result);
//       // eslint-disable-next-line
//       const loadingTask = pdfjsLib.getDocument(typeArray);
//       const pdf = await loadingTask.promise;

//       const pages = [];
//       // eslint-disable-next-line
//       for (let i = 1; i <= pdf.numPages; i++) {
//         // eslint-disable-next-line
//         const page = await pdf.getPage(i);
//         const viewport = page.getViewport({ scale: 2.0 });
//         const canvas = document.createElement('canvas');
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;

//         const renderContext = {
//           canvasContext: canvas.getContext('2d'),
//           viewport,
//         };
//         // eslint-disable-next-line
//         await page.render(renderContext).promise;

//         pages.push(canvas.toDataURL('image/png')); // Save the canvas as an image data URL
//       }

//       setUploadedPages((prevPages) => [...prevPages, { name: file.name, pages }]);
//     };

//     fileReader.readAsArrayBuffer(file);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   };

//   const handleChange = (e) => {
//     const file = e.target.files[0];
//     if (file.type !== 'application/pdf') {
//       console.error(file.name, 'is not a pdf file.');
//     } else {
//       handleFile(file);
//     }
//   };

//   const onButtonClick = () => {
//     inputRef.current.click();
//   };

//   return (
//     <div>
//       <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
//         <input ref={inputRef} type="file" id="input-file-upload" multiple onChange={handleChange} />
//         {/* eslint-disable-next-line */}
//         <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
//           <div>
//             <p>Drag and drop your file here or</p>
//             <button type="button" className="upload-button" onClick={onButtonClick}>
//               Upload a file
//             </button>
//           </div>
//         </label>
//         {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} />}
//       </form>

//       <div id="uploaded-pages">
//         {uploadedPages.map((file, index) => (
//           // eslint-disable-next-line
//           <div key={index}>
//             <h3>{file.name}</h3>
//             {file.pages.map((page, pageIndex) => (
//               // eslint-disable-next-line
//               <img key={pageIndex} src={page} alt={`Page ${pageIndex + 1}`} />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FileUpload;

import React, { useRef, useState } from 'react';
import './FileUpload.scss';

function FileUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedPages, setUploadedPages] = useState([]);

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

  const handleFile = async (file) => {
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      console.error(file.name, 'is not a pdf file.');
    } else {
      handleFile(file);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleNameClick = (index) => {
    setUploadedPages((prevPages) => {
      const updatedPages = [...prevPages];
      updatedPages[index].expanded = !updatedPages[index].expanded;
      return updatedPages;
    });
  };

  return (
    <div>
      <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" id="input-file-upload" multiple onChange={handleChange} />
        {/* eslint-disable-next-line */}
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
          <div>
            <p>Drag and drop your file here or</p>
            <button type="button" className="upload-button" onClick={onButtonClick}>
              Upload a file
            </button>
          </div>
        </label>
        {dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} />}
      </form>

      <div id="uploaded-pages">
        {uploadedPages.map((file, index) => (
          // eslint-disable-next-line
          <div key={index}>
            <h3 onClick={() => handleNameClick(index)}>{file.name}</h3>
            {file.expanded && file.pages.map((page, pageIndex) => (
              // eslint-disable-next-line
              <img key={pageIndex} src={page} alt={`Page ${pageIndex + 1}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
