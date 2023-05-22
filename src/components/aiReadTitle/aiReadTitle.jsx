import React from 'react';
import styles from './styles.module.scss';

export default function AIreadTitle(props) {
  return (
    <div className={styles.page}>
      <h1>
        <span className={styles.ai}>AI</span>read
      </h1>
      <p>An Interactive Learning Environment</p>
    </div>
  );
}
