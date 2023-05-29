/* eslint-disable react/no-children-prop */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { toast } from 'react-toastify';
import trash from '../../img/trash.png';
import styles from './styles.module.scss';

function UserNote(props) {
  const [isHover, setIsHover] = useState(false);

  const successDeleteCallback = () => {
    toast('Deleted note!');
  };

  const errorDeleteCallback = () => {
    toast('Unable to delete note!');
  };

  return (
    <div className={styles.userNoteContainer} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <ReactMarkdown components={ChakraUIRenderer()} children={props.userNote} skipHtml />
      <img
        style={isHover ? { display: 'flex' } : { display: 'none' }}
        className="trash"
        alt="Delete"
        src={trash}
        onClick={() => { props.deleteUserNote(props.index, props.chunkNum, successDeleteCallback, errorDeleteCallback); }}
      />
    </div>
  );
}

export default UserNote;
