/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASE_URL, ANOTHER_CONSTANT } from '../utils/constants';

export const processChat = async (fileContent, userPrompt, token) => {
  try {
    const res = await axios.post(`${ANOTHER_CONSTANT}/chat`, { content: fileContent, prompt: userPrompt }, { headers: { Authorization: token } });
    return res;
  } catch (error) {
    console.log(`error: ${error.response.data}`);
    throw error;
  }
};
