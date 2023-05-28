/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChakraProvider, Flex, Button, Box, Container, Divider, Heading } from '@chakra-ui/react';
import ReadingEntry from './ReadingEntry';
import Nav from '../nav/nav';
import style from './styles.module.scss';
import { getFile, makeSummaries } from '../../services/firebase';
import Chat from '../chat/chat';

import './reading.module.scss';

function ReadingHeader(props) {
  const selectedFile = useSelector((state) => state.files.selectedFile);

  const onGenerateClick = () => {
    makeSummaries(selectedFile.id, selectedFile.chunks);
  };

  return (
    <Flex
      wrap="wrap"
      justifyContent="center"
      columnGap={1}
      mt={4}
    >
      <Box
        flex="1"
        // bg="blue.200"
        p={2}
        minH="100%"
      >
        <Heading size="m">Your Document</Heading>
      </Box>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        width="50%"
        // bg="orange"
        p={2}
        minH="100%"
        position="relative"
        borderRadius="l"
      >
        <Heading size="m">AI Summary</Heading>
        <Button size="sm" colorScheme="blue" onClick={onGenerateClick}>{props.summaryExists ? 'Regenerate Summary' : 'Generate Summary'}</Button>
      </Flex>
      <Divider />
    </Flex>
  );
}

function Reading(props) {
  const [isSelectedFileLoaded, setIsSelectedFileLoaded] = useState(false);
  const selectedFile = useSelector((state) => state.files.selectedFile);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getFile(id));
  }, []);

  useEffect(() => {
    if (selectedFile) {
      setIsSelectedFileLoaded(true);
    }
  }, [selectedFile]);

  const renderChunks = () => {
    if (isSelectedFileLoaded) {
      return selectedFile.chunks?.map((chunk, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <ReadingEntry content={chunk.content} summary={chunk.summary} summary_upToDate />
          <Divider />
        </div>
      ));
    } else {
      return <div>Hello</div>;
    }
  };

  return (
    <div className="reading-window">
      <Box minHeight="100vh" display="flex" flexDir="column">
        <Container maxWidth="none" flex={1}>
          <Chat />
          <ReadingHeader />
          {renderChunks()}
        </Container>
      </Box>
    </div>
  );
}

export default function ReadingWrapper() {
  return (
    <div
      className={style.container}
    >
      <Nav />
      <ChakraProvider>
        <Reading />
      </ChakraProvider>
    </div>
  );
}
