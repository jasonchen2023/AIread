/* eslint-disable max-len */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Button, Box, Heading, Input, Text, useMediaQuery } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { makeSummaries, auth } from '../../services/firebase';

import './reading.module.scss';
import { showPDF } from '../../actions';

function ReadingHeader(props) {
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const pdfView = useSelector((state) => state.files.showPDF);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const onGenerateClick = async () => {
    try {
      setIsLoading(true);
      // const token = await auth.currentUser.getIdToken();
      makeSummaries(selectedFile.id, selectedFile.chunks)
        .then(() => {
          toast.success('Summaries generated!');
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Error generating summaries');
          setIsLoading(false);
        });
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  const onGoClick = async () => {
    // Handle custom prompt logic here
    console.log('Custom Prompt:', customPrompt);
    setIsLoading(true);
    const token = await auth.currentUser.getIdToken();
    makeSummaries(selectedFile.id, selectedFile.chunks, token, customPrompt)
      .then(() => {
        toast.success('Summaries generated!');
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error('Error generating summaries');
        setIsLoading(false);
      });
    // Reset state after handling custom prompt
    setCustomPrompt('');
  };

  return (
    <Flex
      direction={isMobile ? 'column' : 'row'}
      wrap="wrap"
      justifyContent="center"
      columnGap={1}
      mt={4}
    >
      <Box
        flex="1"
        bg="white"
        p={2}
        minH="100%"
        style={{ borderRadius: '5px' }}
        boxShadow="base"
      >
        <Flex justifyContent="space-between" alignItems="center" width="100%">
          <Box>
            {/* <Heading size="m">Your Document:</Heading> */}
            <Heading size="m">{selectedFile.title}</Heading>
          </Box>
          {pdfView ? (
            <Button onClick={() => dispatch(showPDF(false))}>Hide PDF</Button>
          ) : (
            <Button onClick={() => dispatch(showPDF(true))}>Show PDF</Button>
          )}
        </Flex>
      </Box>

      <Flex
        justifyContent="space-around"
        alignItems="center"
        // width="50%"
        flex="1"
        direction={isMobile ? 'column' : 'row'}
        bg="white"
        p={2}
        minH="100%"
        style={{ borderRadius: '5px' }}
        position="relative"
        borderRadius="l"
        boxShadow="base"
      >
        <Box flex="1" display="flex">
          <Input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            flex="1"
            placeholder="Enter custom prompt here..."
            mr={4}
          />
          <Button
            isLoading={isLoading}
            colorScheme="pink"
            onClick={onGoClick}
            style={{ marginRight: '10px' }}
          >
            Go
          </Button>
        </Box>
        <Text fontSize="xl" ml="4" fontWeight="bold" alignSelf="center" style={{ margin: '0px' }}>
          OR
        </Text>
        <Button
          isLoading={isLoading}
          colorScheme="yellow"
          onClick={onGenerateClick}
          style={{ marginLeft: '10px' }}
        >
          {props.summaryExists ? 'Regenerate Summary' : 'Standard Summary'}
        </Button>
      </Flex>
    </Flex>
  );
}

export default ReadingHeader;
