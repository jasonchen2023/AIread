import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';

export default function Nav(props) {
  return (
    <div id={styles.navBar}>
      <NavLink to="/">
        <span className={styles.aiReadText}>AI</span>read
      </NavLink>
      <NavLink to="/profile">
        <FontAwesomeIcon icon={faUserCircle} />
      </NavLink>
    </div>
  );
}
