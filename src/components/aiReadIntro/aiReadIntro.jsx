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
          <p>
            This is to be filled in later. This is to be filled in later. This is to be filled in later. This is to be filled in later.
          </p>
        </div>
        <img alt="" src={aiIntro} />
      </div>
      <FontAwesomeIcon icon={faChevronDown} bounce size="2xl" />
    </div>
  );
}
