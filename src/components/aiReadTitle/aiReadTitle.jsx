import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import background from '../../assets/background1.svg';
import styles from './styles.module.scss';

export default function AIreadTitle(props) {
  return (
    <div className={styles.page} style={{ backgroundImage: `url(${background}` }}>
      <h1>
        <span className={styles.ai}>AI</span>read
      </h1>
      <p>An AI-Augmented Reading Environment</p>
      <FontAwesomeIcon className={styles.chevronIcon} icon={faChevronDown} bounce size="2xl" />
    </div>
  );
}
