/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
import { Button, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import style from './style.module.scss';
import { processChat } from '../../services/chat';

export default function chat() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    console.log(`prompt: ${prompt}`);
    if (prompt) {
      setIsLoading(true);
      processChat(prompt)
        .then((res) => {
          setResponse(res.data);
          setIsLoading(false);
        });
    } else {
      alert('Must enter a valid prompt');
    }
  };

  return (
    <div className={style.container}>
      <p className={style.headerText}>Have a question? Ask here!</p>
      <div className={style.inputWrapper}>
        <Input
          placeholder="i.e. Who was Mark Twain?"
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); }}
        />

        <Button
          isLoading={isLoading}
          colorScheme="pink"
          ms={6}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
      {response.length > 0 && (
        <p className={style.responseText}>{response}</p>
      )}
    </div>
  );
}
