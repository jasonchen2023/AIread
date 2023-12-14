/* eslint-disable max-len */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Button, Box, Heading } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { makeSummaries, auth } from '../../services/firebase';

import './reading.module.scss';
import { showPDF } from '../../actions';

function ReadingHeader(props) {
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const pdfView = useSelector((state) => state.files.showPDF);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onGenerateClick = async () => {
    try {
      setIsLoading(true);
      const token = await auth.currentUser.getIdToken();
      makeSummaries(selectedFile.id, selectedFile.chunks, token)
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

  return (
    <Flex
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
            <Heading size="m">Your Document:</Heading>
            <Heading size="sm">{selectedFile.title}</Heading>
          </Box>
          {pdfView ? (
            <Button onClick={() => dispatch(showPDF(false))}>Hide PDF</Button>
          ) : (
            <Button onClick={() => dispatch(showPDF(true))}>Show PDF</Button>
          )}
        </Flex>
      </Box>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        width="50%"
        bg="white"
        p={2}
        minH="100%"
        style={{ borderRadius: '5px' }}
        position="relative"
        borderRadius="l"
        boxShadow="base"
      >
        <Heading size="m">AI Summary</Heading>
        <Button
          isLoading={isLoading}
          colorScheme="pink"
          onClick={onGenerateClick}
        >
          {props.summaryExists ? 'Regenerate Summary' : 'Generate Summary'}
        </Button>
      </Flex>
    </Flex>
  );
}

export default ReadingHeader;
