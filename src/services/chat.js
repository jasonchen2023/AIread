/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASE_URL, ANOTHER_CONSTANT } from '../utils/constants';

// export const processChat = async (fileContent, userPrompt, token = null) => {
//   try {
//     const res = await axios.post(`${ANOTHER_CONSTANT}/chat`, { content: fileContent, prompt: userPrompt }, { headers: { Authorization: token } });
//     return res;
//   } catch (error) {
//     console.log(`error: ${error.response.data}`);
//     throw error;
//   }
// };

export const processChat = async (prompt, fileId, summary, token = null) => {
  try {
    const res = await axios.post(`${ANOTHER_CONSTANT}/chat`, { prompt, fileId, summary }, { headers: { Authorization: token } });
    return res;
  } catch (error) {
    console.log(`error: ${error.response.data}`);
    throw error;
  }
};

export const analyzeText = async (userPrompt, fileContent, token = null) => {
  try {
    const res = await axios.post(`${ANOTHER_CONSTANT}/text-analysis`, { content: fileContent, prompt: userPrompt }, { headers: { Authorization: token } });
    return res;
  } catch (error) {
    console.log(`error: ${error.response.data}`);
    throw error;
  }
};
