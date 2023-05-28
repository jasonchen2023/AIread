/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

export const processChat = (prompt) => {
  return axios.post(`${BASE_URL}/chat`, { content: `Give a concise response to the following prompt: ${prompt}` });
};
