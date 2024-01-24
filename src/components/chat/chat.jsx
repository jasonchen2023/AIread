/* eslint-disable react/no-children-prop */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input } from '@chakra-ui/react';
import style from './style.module.scss';
import { processChat } from '../../services/chat';
import { auth, uploadDocumentSummary } from '../../services/firebase';

export default function chat(props) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [response, setResponse] = useState('');
  const { id } = useParams();

  const handleSubmit = async () => {
    if (prompt) {
      setIsLoading(true);
      try {
        // const token = await auth.currentUser.getIdToken();
        const res = await processChat(prompt, id, props.summary);
        props.setChatResponse(res.data);

        // to be deleted, and uncomment top two lines
        // uploadDocumentSummary(id, props.fileContent);
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
      <p className={style.headerText}>Have a question about the document? Ask GPT!</p>
      <p className={style.warningText}>The model may occasionally provide false information</p>
      <div className={style.inputWrapper}>
        <Input
          placeholder=""
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); }}
          sx={{ '::placeholder': { fontStyle: 'italic' }, borderRadius: '5px 0 0 5px' }}
          pl={2}
        />

        <Button
          isLoading={isLoading}
          colorScheme="pink"
          onClick={handleSubmit}
          ml={0}
          sx={{ borderRadius: '0 5px 5px 0' }}
        >
          Submit
        </Button>
      </div>
      {props.chatResponse.length > 0 && (
        <p className={style.responseText}>{props.chatResponse}</p>
      )}
    </div>
  );
}
