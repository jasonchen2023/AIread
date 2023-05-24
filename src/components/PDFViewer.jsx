import React from 'react';

function PDFViewer({ url }) {
  return (
    <div>
      <embed src={url} type="application/pdf" width="100%" height="600px" />
    </div>
  );
}

export default PDFViewer;
