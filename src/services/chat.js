/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

export const processChat = async (prompt, token) => {
  try {
    const res = await axios.post(`${BASE_URL}/chat`, { content: `Give a concise response to the following prompt: ${prompt}` }, { headers: { Authorization: token } });
    return res;
  } catch (error) {
    console.log(`error: ${error.response.data}`);
    throw error;
  }
};
