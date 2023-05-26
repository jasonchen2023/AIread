/* eslint-disable max-len */
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { ChakraProvider, Flex, Button, Box, Container, Divider } from '@chakra-ui/react';
import ReadingEntry from './ReadingEntry';

import './reading.module.scss';

function Reading(props) {
  const { id } = useParams();
  const [summaryExists, setSummaryExists] = useState(true);

  const testData = [
    [
      'This technical report presents GPT-4, a large multimodal model capable of processing image andtext inputs and producing text outputs. Such models are an important area of study as they have the potential to be used in a wide range of applications, such as dialogue systems, text summarization, and machine translation. As such, they have been the subject of substantial interest and progress in recent years [1–34].',
      '• Computer Science focuses on how software works and interactions with hardware  \n• Computational thinking is a skill tied to the field and involves recognizing patterns, data structures and abstractions  \n• Economics is concerned with the study of how goods and services are produced, allocated, and consumed  \n• Production theory examines how efficient production of a certain commodity can be achieved  \n• Behavior economics allows analysis of people\'s decisions regarding production, allocation and consumption of goods and services \n• Incentives such as subsidies, taxes, and regulations are examined for their effectiveness \n\n• Computer Science focuses on the interactions between software and hardware, and includes skills in recognizing patterns, data structures and abstractions.\n• Economics studies the production, allocation and consumption of goods and services. \n• Production theory aims to achieve efficient production of commodities. \n• Behavior economics examines people\'s decisions in relation to these factors. \n• Incentives, such as subsidies, taxes and regulations are evaluated for effectiveness.',
    ],
    [
      'One of the main goals of developing such models is to improve their ability to understand and generate natural language text, particularly in more complex and nuanced scenarios. To test its capabilities in such scenarios, GPT-4 was evaluated on a variety of exams originally designed for humans. In these evaluations it performs quite well and often outscores the vast majority of human test takers. For example, on a simulated bar exam, GPT-4 achieves a score that falls in the top 10% of test takers. This contrasts with GPT-3.5, which scores in the bottom 10%.',
      '• Computer Science (CS) as an academic field has grown tremendously in recent decades. \n• This is due in part to the proliferation of computing technology, which has impacted all aspects of modern life. \n• CS has become even more important as it is now used to solve large-scale problems in industries, such as finance, chemistry, and healthcare. \n• Economists have also seen a rise in the usage of CS, as they use the field to analyze financial markets, develop better models and predictions, and monitor industry trends. \n• CS is also an important part of modern education, especially in higher education. \n• As a result, CS is now taught in many schools, from elementary schools to universities, providing more options for students seeking training.\n\n• In recent decades, the academic field of Computer Science (CS) has seen tremendous growth due to advances in computing technology impacting all aspects of modern life. \n• CS is now used to solve large-scale problems in industries, such as finance, chemistry, and healthcare, and is also rising rapidly in importance for economists leveraging the field to analyze financial markets, develop better models and predictions, and monitor industry trends.\n• The increased prevalence of CS has had a positive effect on modern education, with more institutions now teaching CS from elementary school to universities, providing students with more options for training.',
    ],
    [
      'On a suite of traditional NLP benchmarks, GPT-4 outperforms both previous large language models and most state-of-the-art systems (which often have benchmark-specific training or hand-engineering). On the MMLU benchmark [35, 36], an English-language suite of multiple-choice questions covering 57 subjects, GPT-4 not only outperforms existing models by a considerable margin in English, but also demonstrates strong performance in other languages. On translated variants of MMLU, GPT-4 surpasses the English-language state-of-the-art in 24 of 26 languages considered. We discuss these model capability results, as well as model safety improvements and results, in more detail in later sections.',
      '• Computer Science is a field of study that involves understanding the principles and application of computing technologies.\n• Economics is a field of study concerned with the production, distribution, and consumption of goods and services.\n• An interdisciplinary field of Computer Science and Economics seeks to understand how technology affects economic and financial decisions.\n• A combination of Computer Science and Economics provides a unique perspective on economic and financial issues.\n• Computer Science and Economics provide insights on how technology can be used to enhance economic performance and improve decision-making.',
    ],
    [
      'This report also discusses a key challenge of the project, developing deep learning infrastructure and optimization methods that behave predictably across a wide range of scales. This allowed us to make predictions about the expected performance of GPT-4 (based on small runs trained in similar ways) that were tested against the final run to increase confidence in our training. Despite its capabilities, GPT-4 has similar limitations to earlier GPT models [1, 37, 38]: it is not fully reliable (e.g. can suffer from “hallucinations”), has a limited context window, and does not learn from experience. Care should be taken when using the outputs of GPT-4, particularly in contexts where reliability is important.',
      '• Computer Science is an interdisciplinary field that combines elements of mathematics, engineering, and natural sciences to study computation and computer systems. \n• Economic approaches are used to understand how computers and computing systems affect individuals, businesses, and societies. \n• Computational models are used to assist decision-making and to develop software, computer systems, and networks within an organization. \n• Computer Science can also be applied to other areas, such as the development of artificial intelligence, robotics, graphics, and security designs.\n\nComputer Science is an interdisciplinary field combining mathematics, engineering, and natural sciences to study computation and computer systems, with economic approaches used to understand the effects of computer systems on individuals, businesses, and societies. It is also applied to other areas for the development of artificial intelligence, robotics, graphics, security designs, and more, with computational models assisting decision-making and the development of software, computer systems, and networks.',
    ],
    [
      'GPT-4’s capabilities and limitations create significant and novel safety challenges, and we believe careful study of these challenges is an important area of research given the potential societal impact. This report includes an extensive system card (after the Appendix) describing some of the risks we foresee around bias, disinformation, over-reliance, privacy, cybersecurity, proliferation, and more. It also describes interventions we made to mitigate potential harms from the deployment of GPT-4, including adversarial testing with domain experts, and a model-assisted safety pipeline.',
      '• Artificial Intelligence (AI) is a branch of computer science that utilizes computer systems to carry out tasks that are usually done by humans, such as decision-making, pattern recognition, and problem solving. \n• AI relies on algorithms and probability to draw conclusions and it often requires a vast amount of data in order to produce accurate results. \n• Applications of AI include natural language processing, robotics, data mining, and automation. \n• AI also has the potential to find answers to problems that humans have been unable to solve.\n\n• AI is a field of computer science that enables machines to complete tasks usually done by humans, such as recognizing patterns and making decisions. \n• It harnesses algorithms and probability to draw conclusions and requires large data sets to produce accurate results. \n• Applications include natural language processing, robotics, data mining, and automation. \n• AI has the potential to solve problems eluding humans.',
    ],
  ];

  const testTrue = true;
  const chunks = testData.map((entry, index) => (
    <div>
      <ReadingEntry content={entry[0]} summary={entry[1]} summary_upToDate={testTrue} />
      <Divider />
    </div>
    // <ReadingEntry content={entry["content"]} summary={entry["summary"]} summary_upToDate={entry["summary_upToDate"]} />
  ));

  return (
    <div className="reading-window">
      <Box minHeight="100vh" display="flex" flexDir="column">
        <Container maxWidth="none" flex={1}>

          <Flex justify="center" mt={4} mb={4}>
            <Button colorScheme="blue" onClick={() => {}}>{summaryExists ? 'Regenerate Summary' : 'Generate Summary'}</Button>
          </Flex>

          {chunks}

        </Container>
      </Box>
    </div>
  );
}

export default function ReadingWindow() {
  return (
    <ChakraProvider>
      <Reading />
    </ChakraProvider>
  );
}

/*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import styles from './styles.module.scss';
import { getFile } from '../../firebase';

function Reading() {
  const selectedFile = useSelector((state) => state.files.selectedFile);
  const [fileText, setFileText] = useState('');

  const convertPdfToText = async () => {
    try {
      console.log(`converting pdf with title: ${selectedFile.title}`);
      const res = await axios.postForm('https://selectpdf.com/api2/pdftotext/', {
        key: import.meta.env.VITE_PDFTOTEXT_API_KEY,
        url: selectedFile.url,
      });
      setFileText(res.data.trim());
    } catch (err) {
      console.log(`error: ${err}`);
    }
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getFile(id));
  }, []);

  useEffect(() => {
    if (selectedFile.url && selectedFile.id === id) {
      convertPdfToText();
    }
  }, [selectedFile.url]);

  return (
    <div id={styles.container}>
      <h3>Reading:</h3>
      {selectedFile.title}

      <div id={styles.content}>
        <h3>Content:</h3>
        {fileText}
      </div>
    </div>
  );
}
*/
