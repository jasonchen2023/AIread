// TextHighlightPopup.jsx
import React from 'react';
import './TextHighlightPopup.scss';
import { textInteractions } from '../../utils/constants';

function TextHighlightPopup({ popupPosition, handlePopupOptionClick }) {
  return (
    <div className="text-highlight-container" style={{ top: popupPosition.top, left: popupPosition.left }}>
      {Object.keys(textInteractions).map((key) => (
        <div key={key} className={`${key}-option`} onClick={() => handlePopupOptionClick(key)}>
          {textInteractions[key].label}
        </div>
      ))}
    </div>
  );
}

export default TextHighlightPopup;
