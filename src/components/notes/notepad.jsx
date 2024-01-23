import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import { getUserNoteNew, saveUserNote } from '../../services/firebase';
import markdownIcon from '../../assets/markdown.svg';
import './notepad.scss';

function NotePad(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.text);
  const [markdownMode, setMarkdownMode] = useState(false);
  const { id } = useParams();

  const successAddCallback = () => {
    toast('Note saved!');
  };

  const errorAddCallback = () => {
    toast('Unable to add note!');
  };

  const errorGetCallback = () => {
    toast('Unable to retrieve notes');
  };

  useEffect(() => {
    const fetchInitialNote = async () => {
      try {
        const initialNote = await getUserNoteNew(id, errorGetCallback);
        setText(initialNote || ''); // Set the initial note content to the state
      } catch (error) {
        console.error('Error fetching initial note:', error);
      }
    };

    fetchInitialNote();
  }, [id]);

  const updateNoteContent = (event) => {
    const newText = event.target.value;
    setText(newText);
  };

  const onSaveClick = () => {
    console.log(text);
    setIsEditing(false);
    saveUserNote(id, text, successAddCallback, errorAddCallback);
  };

  const onEditClick = () => {
    console.log('Save clicked');
    setIsEditing(true);
  };

  const onMarkdownSelect = () => {
    if (!markdownMode && isEditing) {
      setIsEditing(false);
    }
    setMarkdownMode(!markdownMode);
  };

  const setIsEditingOn = () => {
    setIsEditing(true);
    setMarkdownMode(false);
  };

  const renderTextSection = () => {
    if (markdownMode && !isEditing) {
      return (

        <div>
          { /* eslint-disable jsx-a11y/no-static-element-interactions */}
          <div id="note-input-box" onClick={setIsEditingOn}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{text || ''}</ReactMarkdown>
          </div>
        </div>

      );
    } else {
      return (
        <div id="note-input-box">
          <TextareaAutosize id="notesTextArea" onChange={updateNoteContent} value={text} />
        </div>
      );
    }
  };

  const renderNotesHeader = () => {
    if (isEditing) {
      return (
        <div id="note-header" onClick={() => setIsEditing(true)}>
          <span className="notes-title">Notes</span>:
          <button type="button" id="save-button" onClick={onSaveClick}>Save Note</button>
          <button type="button" id={markdownMode ? 'markdown-button-on' : 'markdown-button-off'} onClick={onMarkdownSelect}>  <img src={markdownIcon} alt="Markdown" /></button>
        </div>
      );
    } else {
      return (

        <div id="note-header">
          <span className="notes-title">Notes</span>:
          <button type="button" onClick={onEditClick}>Edit Note</button>
          <button type="button" id={markdownMode ? 'markdown-button-on' : 'markdown-button-off'} onClick={onMarkdownSelect}>  <img src={markdownIcon} alt="Markdown" /></button>
        </div>
      );
    }
  };

  return (
    <div id="notepad-container">
      {/* {renderNotesHeader()} */}
      <div id="note-header">
        <span className="notes-title">Notes</span>
        <button type="button" className={markdownMode ? 'markdown-button button-on' : 'markdown-button'} onClick={onMarkdownSelect}>
          <img id="markdown-icon" src={markdownIcon} alt="Markdown" />
        </button>
        <button type="button" id="save-button" onClick={onSaveClick}>Save Note</button>
      </div>
      {renderTextSection()}
    </div>
  );
}

export default NotePad;
