/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
import { Button, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import style from './style.module.scss';
import { processChat } from '../../services/chat';
import { auth } from '../../services/firebase';

export default function chat() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    if (prompt) {
      console.log(`prompt: ${prompt}`);
      setIsLoading(true);
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await processChat(prompt, token);
        setResponse(res.data);
      } catch (err) {
        console.log(`error: ${err}`);
      }
      setIsLoading(false);
    } else {
      alert('Must enter a valid prompt');
    }
  };

  return (
    <div className={style.container}>
      <p className={style.headerText}>Have a question? Ask GPT!</p>
      <div className={style.inputWrapper}>
        <Input
          placeholder="Who was Mark Twain?"
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); }}
          sx={{ '::placeholder': { fontStyle: 'italic' } }}
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
