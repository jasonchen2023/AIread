/* eslint-disable react/no-children-prop */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { Box, Flex, Badge } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';
import UserNote from './userNote';

function giveSummaryStatus(props) {
  let colorScheme = '';
  let symbol = '';

  if (props.summary_inProgress) {
    // return a spinner
  }

  if (props.summary_upToDate) {
    colorScheme = 'green';
    symbol = '✓';
  } else {
    colorScheme = 'yellow';
    symbol = '✗';
  }

  return (
    <Badge
      colorScheme={colorScheme}
      position="absolute"
      bottom={1}
      right={1}
      mr={2}
      mb={2}
    >
      {symbol}
    </Badge>
  );
}

function ReadingEntry(props) {
  const [userNoteText, setUserNoteText] = useState('');

  const successAddCallback = () => {
    setUserNoteText('');
  };

  const errorAddCallback = () => {
    toast('Unable to add note!');
  };

  return (
    <Flex
      wrap="wrap"
      justifyContent="center"
      alignItems="stretch"
      columnGap={1}
    >
      <Box
        flex="1"
        bg="white"
        p={2}
        minH="100%"
        style={{ borderRadius: '5px' }}
        boxShadow="base"
      >
        <ReactMarkdown components={ChakraUIRenderer()} children={props.content} skipHtml />
      </Box>
      <Box
        flex="1"
        bg="white"
        p={2}
        minH="100%"
        style={{ borderRadius: '5px' }}
        boxShadow="base"
        position="relative"
      >
        <ReactMarkdown components={ChakraUIRenderer()} children={props.summary} skipHtml />
        <span className={styles.userTextMarkdown}>
          {props.userNotes && props.userNotes.map((userNote, index) => {
            return (
              <UserNote userNote={userNote} index={index} chunkNum={props.chunkNum} deleteUserNote={props.deleteUserNote} />
            );
          })}
        </span>

        <div className={styles.noteInputContainer}>
          <input className={styles.userNoteInput} value={userNoteText} onChange={(e) => setUserNoteText(e.target.value)} placeholder="add a note..." />
          <button className={styles.enterButton} type="button" onClick={() => props.addUserNote(userNoteText, props.chunkNum, successAddCallback, errorAddCallback)}>Enter</button>
        </div>
        {giveSummaryStatus(props)}
      </Box>

    </Flex>
  );
}

export default ReadingEntry;
