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

// from chatGPT
export function chunkify(rawContent, wordsPerChunk = 300) {
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
