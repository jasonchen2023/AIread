/* eslint-disable react/no-children-prop */
/* eslint-disable new-cap */
/* eslint-disable camelcase */
import React from 'react';
import { Box, Text, Flex, Badge } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

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
  return (
    <Flex
      wrap="wrap"
      justifyContent="center"
      alignItems="stretch"
      columnGap={1}
    >
      <Box
        flex="1"
        // bg="blue.200"
        p={2}
        minH="100%"
      >
        <Text whiteSpace="pre-wrap">{props.content}</Text>
      </Box>
      <Box
        flex="1"
        bg="gray.50"
        p={2}
        minH="100%"
        position="relative"
        borderRadius="l"
      >
        <Text whiteSpace="pre-wrap"><ReactMarkdown components={ChakraUIRenderer()} children={props.summary} skipHtml /></Text>
        {giveSummaryStatus(props)}
      </Box>

    </Flex>
  );
}

export default ReadingEntry;
