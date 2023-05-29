/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChakraProvider, Flex, Button, Box, Container, Divider, Heading } from '@chakra-ui/react';
import ReadingEntry from './ReadingEntry';
import Nav from '../nav/nav';
import style from './styles.module.scss';
import { getFile, makeSummaries, auth } from '../../services/firebase';
import Chat from '../chat/chat';

import './reading.module.scss';
import { showPDF } from '../../actions';

function ReadingHeader(props) {
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const pdfView = useSelector((state) => state.files.showPDF);
  const dispatch = useDispatch();

  const onGenerateClick = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      makeSummaries(selectedFile.id, selectedFile.chunks, token);
    } catch (err) {
      console.log(`error: ${err}`);
    }
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
        {pdfView ? (
          <Button onClick={() => dispatch(showPDF(false))}>Hide PDF</Button>
        ) : (
          <Button onClick={() => dispatch(showPDF(true))}>Show PDF</Button>
        )}
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
  const pdfView = useSelector((state) => state.files.showPDF);

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

  useEffect(() => {
    console.log(pdfView);
  }, [pdfView]);

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
          {pdfView && (
            <div id={style.pdfDisplay}>
              <embed src={selectedFile.url} width="70%" height="1000" type="application/pdf" />
            </div>
          )}
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
