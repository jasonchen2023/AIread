# AIread

(Still Under Development)

AIread is a web application and learning and note-taking platform that allows users to more effectively and efficiently absorb information from handouts and assigned readings. 

When a user uploads readings to the platform, they can receive and save summaries and explanations of the texts. Original texts and their summaries are viewed side by side, helping users break down the structure of the readings and the significance of each section. 

Alternatively, users can also pass in custom prompts to translate or analyze the text based on their needs. 

Additional features further allow users to chat with their document, analyze highlighted text directly, and take notes on the platform.


## Architecture

AIread is a Single-Page Application built using React and Vite. It interacts with a node + express backend and uses utilize OpenAI language models in order to perform text summary / analysis and other text-related tasks.

Firebase Storage stores uploaded PDFs and Cloud Firestore stores the PDF text, summaries, and user notes. The application also utilizes Firebase Authentication to handle account creation and maintenance.

## Setup

Run `npm install` and then `npm run dev`