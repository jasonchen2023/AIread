import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

function ReadingEntry(props) {
  return (
    <Flex
      wrap="wrap"
      justifyContent="center"
      alignItems="stretch"
      columnGap={2}
      mb={2}
    >
      <Box
        flex="1"
        bg="blue.200"
        p={2}
        minH="100%"
      >
        <Text whiteSpace="pre-wrap">{props.left}</Text>
      </Box>
      <Box
        flex="1"
        bg="green.200"
        p={2}
        minH="100%"
      >
        <Text whiteSpace="pre-wrap">{props.right}</Text>
      </Box>
    </Flex>
  );
}

export default ReadingEntry;
