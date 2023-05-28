import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.scss';
import background from '../../assets/background2.svg';
import aiIntro from '../../assets/aiReadDemo.png';

export default function AIreadIntro(props) {
  return (
    <div className={styles.page} style={{ backgroundImage: `url(${background}` }}>
      <div className={styles.titleImgRow}>
        <div className={styles.introTextContainer}>
          <h1>
            <span className={styles.ai}>AI</span>read
          </h1>
          <div className={styles.introContentContainer}>
            <p>
              AIread is a web application and learning and note-taking platform that allows users to more effectively and efficiently absorb information from handouts and assigned readings.
            </p>
            <p>
              When a user uploads readings to the platform, they can receive and save summaries and explanations of the texts (with varying complexities).
            </p>
            <p>
              Original texts and their summaries are viewed side by side, helping users break down the structure of the readings and the significance of each section,
              and users can add to the AI-generated summaries with their own notes and insights, resulting in an interactive AI-facilitated learning environment.
            </p>
          </div>
        </div>
        <img alt="" src={aiIntro} />
      </div>
      <FontAwesomeIcon icon={faChevronDown} bounce size="2xl" />
    </div>
  );
}
