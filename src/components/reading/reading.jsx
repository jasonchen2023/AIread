/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ChakraProvider, Flex, Button, Box, Container, Divider, Text, Heading } from '@chakra-ui/react';
import styles from './styles.module.scss';
import { getFile } from '../../firebase';
import ReadingEntry from './ReadingEntry';
import Nav from '../nav/nav';

import './reading.module.scss';

function ReadingHeader(props) {
  return (
    <Flex
      wrap="wrap"
      justifyContent="center"
      columnGap={1}
      mt={4}
    >
      <Box
        flex="1"
        // bg="blue.200"
        p={2}
        minH="100%"
      >
        <Heading size="m">Your Document</Heading>
      </Box>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        width="50%"
        // bg="orange"
        p={2}
        minH="100%"
        position="relative"
        borderRadius="l"
      >
        <Heading size="m">AI Summary</Heading>
        <Button size="sm" colorScheme="blue" onClick={() => {}}>{props.summaryExists ? 'Regenerate Summary' : 'Generate Summary'}</Button>
      </Flex>
      <Divider />
    </Flex>
  );
}

function Reading(props) {
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

  console.log(selectedFile.title);

  const [summaryExists, setSummaryExists] = useState(true);

  const testData = [
    [
      '**Abstract**\nWe report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs. While less capable than humans in many real-world scenarios, GPT-4 exhibits human-level performance on various professional and academic benchmarks, including passing a simulated bar exam with a score around the top 10% of test takers. GPT-4 is a Transformerbased model pre-trained to predict the next token in a document. The post-training alignment process results in improved performance on measures of factuality and adherence to desired behavior. A core component of this project was developing infrastructure and optimization methods that behave predictably across a wide range of scales. This allowed us to accurately predict some aspects of GPT-4’s performance based on models trained with no more than 1/1,000th the compute of GPT-4.',
      '- We developed GPT-4, a large-scale, multimodal model that can accept image and text inputs and produce text outputs.\n- GPT-4 achieved human-level performance on various professional and academic benchmarks, including passing a simulated bar exam with a score around the top 10% of test takers.\n- GPT-4 is a Transformer-based model pre-trained to predict the next token in a document.\n- Post-training alignment process results in improved performance on measures of factuality and adherence to desired behavior.\n- Infrastructure and optimization methods developed to predict aspects of GPT-4’s performance based on models trained on 1/1,000th the compute of GPT-4.',
    ],
    [
      '**Introduction**\nThis technical report presents GPT-4, a large multimodal model capable of processing image and text inputs and producing text outputs. Such models are an important area of study as they have the potential to be used in a wide range of applications, such as dialogue systems, text summarization, and machine translation. As such, they have been the subject of substantial interest and progress in recent years [1–34].\nOne of the main goals of developing such models is to improve their ability to understand and generate natural language text, particularly in more complex and nuanced scenarios. To test its capabilities in such scenarios, GPT-4 was evaluated on a variety of exams originally designed for humans. In these evaluations it performs quite well and often outscores the vast majority of human test takers. For example, on a simulated bar exam, GPT-4 achieves a score that falls in the top 10% of test takers. This contrasts with GPT-3.5, which scores in the bottom 10%.\nOn a suite of traditional NLP benchmarks, GPT-4 outperforms both previous large language models and most state-of-the-art systems (which often have benchmark-specific training or hand-engineering). On the MMLU benchmark [35, 36], an English-language suite of multiple-choice questions covering 57 subjects, GPT-4 not only outperforms existing models by a considerable margin in English, but also demonstrates strong performance in other languages. On translated variants of MMLU, GPT-4 surpasses the English-language state-of-the-art in 24 of 26 languages considered.',
      '- GPT-4 is a large multimodal model capable of processing image and text inputs and producing text outputs. \n- GPT-4 has been evaluated on exams designed for humans and outperformed the majority of test takers.\n- GPT-4 has also been tested on traditional NLP benchmarks and outperformed both previous large language models and most state-of-the-art systems.\n- GPT-4 achieves strong performance on the MMLU benchmark, outperforming existing models by a considerable margin and surpassing the state-of-the-art in 24 out of 26 languages.',
    ],
    [
      'We discuss these model capability results, as well as model safety improvements and results, in more detail in later sections.\nThis report also discusses a key challenge of the project, developing deep learning infrastructure and optimization methods that behave predictably across a wide range of scales. This allowed us to make predictions about the expected performance of GPT-4 (based on small runs trained in similar ways) that were tested against the final run to increase confidence in our training. Despite its capabilities, GPT-4 has similar limitations to earlier GPT models [1, 37, 38]: it is not fully reliable (e.g. can suffer from “hallucinations”), has a limited context window, and does not learn from experience. Care should be taken when using the outputs of GPT-4, particularly in contexts where reliability is important.\nGPT-4’s capabilities and limitations create significant and novel safety challenges, and we believe careful study of these challenges is an important area of research given the potential societal impact. This report includes an extensive system card (after the Appendix) describing some of the risks we foresee around bias, disinformation, over-reliance, privacy, cybersecurity, proliferation, and more. It also describes interventions we made to mitigate potential harms from the deployment of GPT-4, including adversarial testing with domain experts, and a model-assisted safety pipeline.',
      '- We discuss model capability and safety improvements in later sections of the report.\n- Developed deep learning infrastructure and optimization methods to make predictions about expected performance of GPT-4.\n- GPT-4 has similar limitations to earlier GPT models, such as unreliability, limited context window, and inability to learn from experience.\n- Report includes a system card to describe risks related to bias, disinformation, over-reliance, privacy, cybersecurity, proliferation, and more.\n- Interventions to mitigate potential harms from the deployment of GPT-4, such as adversarial testing with domain experts and model-assisted safety pipeline.',
    ],
    [
      '**Scope and Limitations of this Technical Report**\nThis report focuses on the capabilities, limitations, and safety properties of GPT-4. GPT-4 is a Transformer-style model [39] pre-trained to predict the next token in a document, using both publicly available data (such as internet data) and data licensed from third-party providers. The model was then fine-tuned using Reinforcement Learning from Human Feedback (RLHF) [40]. Given both the competitive landscape and the safety implications of large-scale models like GPT-4, this report contains no further details about the architecture (including model size), hardware, training compute, dataset construction, training method, or similar.\nWe are committed to independent auditing of our technologies, and shared some initial steps and ideas in this area in the system card accompanying this release.2 We plan to make further technical details available to additional third parties who can advise us on how to weigh the competitive and safety considerations above against the scientific value of further transparency.',
      '- This technical report focuses on the capabilities, limitations, and safety properties of GPT-4, a Transformer-style model pre-trained to predict the next token in a document. \n- The model was fine-tuned using Reinforcement Learning from Human Feedback (RLHF).\n- No further details about the architecture, hardware, training compute, dataset construction, training method, etc. are included in this report. \n- A system card accompanying the release provides some initial steps and ideas for independent auditing of this technology. \n- Further technical details will be made available to additional third parties to consider the competitive and safety considerations against the scientific value of further transparency.',
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

          <ReadingHeader summaryExists />

          {chunks}

        </Container>
      </Box>
    </div>
  );
}

export default function ReadingWrapper() {
  return (
    <div>
      <Nav />
      <ChakraProvider>
        <Reading />
      </ChakraProvider>
    </div>
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
