/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChakraProvider, Flex, Box, Container } from '@chakra-ui/react';
import SummaryMapping from '../summaries/SummaryMapping';
import Nav from '../nav/nav';
import style from './styles.module.scss';
import { getFile } from '../../services/firebase';
import Chat from '../chat/chat';
import ReadingHeader from './ReadingHeader';

import './reading.module.scss';
import chatIcon from '../../img/chat.png';
import closeIcon from '../../img/close-button.png'; // from https://www.flaticon.com/free-icon/close-button_106830

function PdfSummaryPage(props) {
  const [isSelectedFileLoaded, setIsSelectedFileLoaded] = useState(false);
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const pdfView = useSelector((state) => state.files.showPDF);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [pdfContent, setPdfContent] = useState('');

  // for font changing
  // Arial, Georgia, Courier New, Default ('')
  const [fontStyleContent, setFontStyleContent] = useState('');
  const handleFontChangeContent = (font) => {
    setFontStyleContent(font);
  };
  const [fontStyleSummary, setFontStyleSummary] = useState('');
  const handleFontChangeSummary = (font) => {
    setFontStyleSummary(font);
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getFile(id));
  }, []);

  function concatenateChunkContents(chunks) {
    return chunks?.map((chunk) => chunk.content || '').join('');
  }

  useEffect(() => {
    if (selectedFile && selectedFile.id === id) {
      setIsSelectedFileLoaded(true);

      const fileContent = concatenateChunkContents(selectedFile.chunks);
      setPdfContent(fileContent);
    }
  }, [selectedFile]);

  // eslint-disable-next-line no-shadow
  const renderChunks = (fontStyleContent, fontStyleSummary) => {
    if (isSelectedFileLoaded) {
      return selectedFile.chunks?.map((chunk, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <SummaryMapping
            chunkNum={index}
            content={chunk.content}
            summary={chunk.summary}
            userNotes={chunk.userNotes}
            summary_upToDate
            fontStyleContent={fontStyleContent}
            fontStyleSummary={fontStyleSummary}
          />
        </div>
      ));
    } else {
      return <div>Hello</div>;
    }
  };

  const toggleChatBox = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="reading-window">
      <Box minHeight="100vh" display="flex" flexDir="column">
        <Container maxWidth="none" flex={1}>
          <ReadingHeader />
          <Flex mb={6}>
            {/* font buttons for content (left) */}
            {/* <Box mt={2} width="50%">
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeContent('')}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeContent('Arial')} style={{ fontFamily: 'Arial' }}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeContent('Georgia')} style={{ fontFamily: 'Georgia' }}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="2xl" onClick={() => handleFontChangeContent('Courier New')} style={{ fontFamily: 'Courier New' }}>T</Button>
            </Box> */}
            {/* font buttons for summary (right) */}
            {/* <Box mt={2}>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeSummary('')}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeSummary('Arial')} style={{ fontFamily: 'Arial' }}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="xl" onClick={() => handleFontChangeSummary('Georgia')} style={{ fontFamily: 'Georgia' }}>T</Button>
              <Button background="white" mr={1} size="sm" fontSize="2xl" onClick={() => handleFontChangeSummary('Courier New')} style={{ fontFamily: 'Courier New' }}>T</Button>
            </Box> */}
          </Flex>
          {/* pdf display */}
          {pdfView && (
            <div id={style.pdfDisplay}>
              <embed src={selectedFile.url} width="70%" height="1000" type="application/pdf" />
            </div>
          )}
          {/* reading chunks */}
          {renderChunks(fontStyleContent, fontStyleSummary)}
          {!isChatVisible ? (
            <img id={style.chatIcon} className={style.iconBorder} alt="chat icon" src={chatIcon} onClick={toggleChatBox} />
          ) : (
            <img id={style.closeIcon} alt="close icon" src={closeIcon} onClick={toggleChatBox} />
          )}
          {isChatVisible && <div id={style.chatDiv}><Chat fileContent={pdfContent} /></div>}
        </Container>
      </Box>
    </div>
  );
}

function ReadingWrapper(props) {
  return (
    <div
      className={style.container}
    >
      <Nav />
      {/* wrapping with Chakra, stan used for frontend in this section */}
      <ChakraProvider>
        <PdfSummaryPage />
      </ChakraProvider>
    </div>
  );
}

export { PdfSummaryPage, ReadingWrapper };
