/* eslint-disable react/no-children-prop */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { Box, Flex, Badge } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { toast } from 'react-toastify';
import rehypeRaw from 'rehype-raw';
import styles from './styles.module.scss';
import Notes from '../notes/notes';

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

function SummaryMapping(props) {
  function replaceWithBr(text) {
    return text.replace(/\r/g, '<br />').replace(/\n/g, '<br />').replace(/(<br \/>){3,}/g, '<br /><br />');
  }

  return (
    <Flex
      wrap="wrap"
      justifyContent="center"
      alignItems="stretch"
      columnGap={1}
      mb={4}
    >
      <Box
        flex="1"
        bg="white"
        p={2}
        minH="100%"
        style={{ borderRadius: '5px', fontFamily: props.fontStyleContent }}
        boxShadow="base"
      >
        <ReactMarkdown components={ChakraUIRenderer()} children={replaceWithBr(props.content)} rehypePlugins={[rehypeRaw]} />
      </Box>
      <Box
        flex="1"
        bg="white"
        p={2}
        minH="100%"
        boxShadow="base"
        position="relative"
        style={{ borderRadius: '5px' }}
      >
        <Box style={{ fontFamily: props.fontStyleSummary }}>
          <ReactMarkdown components={ChakraUIRenderer()} children={props.summary} skipHtml />
        </Box>
        <Notes chunkNum={props.chunkNum} text={props.userNote} />
        {giveSummaryStatus(props)}
      </Box>

    </Flex>
  );
}

export default SummaryMapping;
