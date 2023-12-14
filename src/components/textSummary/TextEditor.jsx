import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.scss';

function TextEditor() {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  return (
    <div>
      <textarea
        className={styles.editor}
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your text here..."
      />
    </div>
  );
}
export default TextEditor;
