import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { auth } from '../../services/firebase';
import styles from './styles.module.scss';

export default function Nav(props) {
  const displayUser = () => {
    if (auth.currentUser != null) {
      return (
        <NavLink to="/profile">
          <FontAwesomeIcon icon={faUserCircle} />
        </NavLink>
      );
    } else {
      return (
        <NavLink to="/signup">
          <button type="button">Sign Up</button>
        </NavLink>
      );
    }
  };

  return (
    <div id={styles.navBar}>
      <NavLink to="/">
        <span className={styles.aiReadText}>AI</span>read
      </NavLink>
      {/* <NavLink to="/profile">
        <FontAwesomeIcon icon={faUserCircle} />
      </NavLink> */}
      {displayUser()}
    </div>
  );
}
