/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChakraProvider, Flex, Box, Container, Popover, PopoverTrigger, PopoverContent, PopoverBody, Text } from '@chakra-ui/react';
import SummaryMapping from './SummaryMapping';
import Nav from '../nav/nav';
import style from './styles.module.scss';
import { getFile } from '../../services/firebase';
import Chat from '../chat/chat';
import NotePad from '../notes/notepad';
import { analyzeText, processChat } from '../../services/chat';
import ReadingHeader from './ReadingHeader';
import TextHighlightPopup from './textHighlightPopup';

import './reading.module.scss';
import chatIcon from '../../img/chat.png';
import closeIcon from '../../img/close-button.png'; // from https://www.flaticon.com/free-icon/close-button_106830

import { textInteractions } from '../../utils/constants';

function PdfSummaryPage(props) {
  const [isSelectedFileLoaded, setIsSelectedFileLoaded] = useState(false);
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const pdfView = useSelector((state) => state.files.showPDF);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [chatResponse, setChatResponse] = useState('');
  const [pdfContent, setPdfContent] = useState('');

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getFile(id));
  }, []);

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

  function handleMouseUp(event) {
    const selection = window.getSelection();
    const text = selection.toString();

    if (text) {
      const top = event.clientY + window.scrollY + 10;
      const left = event.clientX + window.scrollX;

      setHighlightedText(text);
      setPopupPosition({ top, left });
      setShowPopup(true);
    } else {
      setHighlightedText('');
      setShowPopup(false);
    }
  }

  const handlePopupOptionClick = async (action) => {
    setIsChatVisible(true);
    setShowPopup(false);

    const prompt = `Please ${action} the following text: `;
    const res = await analyzeText(prompt, highlightedText);
    const content = `${textInteractions[action].header}: ${res.data}`;

    setChatResponse(content);
  };

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
            handleMouseUp={handleMouseUp}
          />
        </div>
      ));
    } else {
      return <div>Hello</div>;
    }
  };

  const toggleNoteBox = () => {
    setIsNoteVisible(!isNoteVisible);
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
          {showPopup && (
            <TextHighlightPopup popupPosition={popupPosition} handlePopupOptionClick={handlePopupOptionClick} />
          )}

          {!isNoteVisible ? (
            <img id={style.noteIcon} className={style.iconBorder} alt="note icon" src={chatIcon} onClick={toggleNoteBox} />
          ) : (
            <img id={style.closeNoteIcon} alt="close icon" src={closeIcon} onClick={toggleNoteBox} />
          )}
          {isNoteVisible && <div id={style.chatDiv}><NotePad /></div>}

          {!isChatVisible ? (
            <img id={style.chatIcon} className={style.iconBorder} alt="chat icon" src={chatIcon} onClick={toggleChatBox} />
          ) : (
            <img id={style.closeIcon} alt="close icon" src={closeIcon} onClick={toggleChatBox} />
          )}
          {isChatVisible && <div id={style.chatDiv}><Chat setChatResponse={setChatResponse} chatResponse={chatResponse} fileContent={pdfContent} summary={selectedFile.summary} /></div>}
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
