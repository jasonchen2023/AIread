// processFile.js
import axios from 'axios';

export async function convertPDFtoText(url) {
  try {
    const formData = new FormData();
    formData.append('key', import.meta.env.VITE_PDFTOTEXT_API_KEY);
    formData.append('url', url);
    formData.append('text_layout', 1);

    const res = await axios.post('https://selectpdf.com/api2/pdftotext/', formData);

    return res.data.trim();
  } catch (err) {
    console.log(`error: ${err}`);
    throw err;
  }
}

export function chunkifyByParagraph(rawContent, wordsPerChunk = 300) {
  // Split the raw content into paragraphs using newlines
  const paragraphs = rawContent.split('\n');

  let currentWordCount = 0;
  let currentChunk = '';
  const chunks = [];
  let chunk = {};

  for (const paragraph of paragraphs) {
    // Split each paragraph into words
    const words = paragraph.split(' ');

    if (currentWordCount + words.length > wordsPerChunk && currentChunk !== '') {
      // If adding this paragraph would exceed the word limit, save current chunk and start a new one
      chunk.content = currentChunk;
      chunks.push(chunk);
      currentChunk = '';
      currentWordCount = 0;
      chunk = {
        title: '', // Add title here later
        summary: '', // Add summary here later
        summary_upToDate: false,
      };
    }

    // Add this paragraph to the current chunk
    currentChunk += `${paragraph}\n`;
    currentWordCount += words.length;
  }

  // Add the final chunk if it's not empty
  if (currentChunk !== '') {
    chunk.content = currentChunk;
    chunks.push(chunk);
  }

  return chunks;
}

function getChunkWordCount(chunk) {
  const wordCount = {};

  chunk.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return wordCount;
}

function getChunkContent(rawContent, wordsPerChunk, overlap) {
  const words = rawContent.split(' ');
  const chunks = [];
  let currentChunk = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < words.length; i++) {
    // eslint-disable-next-line no-useless-escape
    const word = words[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    currentChunk.push(word.toLowerCase());

    if (currentChunk.length >= wordsPerChunk) {
      chunks.push({ content: currentChunk });
      i = Math.max(0, i - overlap);
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push({ content: currentChunk });
  }

  return chunks;
}

export function chunkifyByWords(rawContent, wordsPerChunk = 1000, overlap = 200) {
  const chunks = getChunkContent(rawContent, wordsPerChunk, overlap);
  const padding = overlap / 2;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i].content;
    chunk = i > 0 ? chunk.slice(padding) : chunk; // do not count first words (to avoid duplicate counting)
    chunk = i < chunks.length - 1 ? chunk.slice(0, -padding) : chunk; // do not count last words (to avoid duplicate counting)

    chunks[i].wordCount = getChunkWordCount(chunk);
    chunks[i].content = chunks[i].content.join(' ');
  }
  return chunks;
}
