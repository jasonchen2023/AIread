import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import { login, signup } from '../../firebase';

export default function LoginSignup(props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('18');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  const updateError = (message) => {
    setError(message);
  };

  const handleLogin = () => {
    dispatch(login(email, password, updateError, props.fullpageApi));
  };

  const handleSignup = () => {
    if (email.trim().length === 0 || password.trim().length === 0 || displayName.trim().length === 0 || !parseInt(age, 10)) {
      setError('Please fill out all fields!');
      return;
    }
    dispatch(signup(email, password, displayName, parseInt(age, 10), updateError, props.fullpageApi));
  };

  const loginPanel = () => {
    return (
      <div className={styles.loginSignupPanel}>
        <h2>Login</h2>
        <div className={styles.panelFields}>
          <input placeholder="Email" value={email} onChange={handleEmailChange} />
          <input placeholder="Password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="button" onClick={handleLogin}>Log in</button>
        <p>Don&apos;t have an account? <span className={styles.signupLoginSpan} role="button" tabIndex={0} title="Sign Up" onClick={toggleLogin}>Sign up</span></p>
        <hr />
      </div>
    );
  };

  const signupPanel = () => {
    return (
      <div className={styles.loginSignupPanel}>
        <h2>Signup</h2>
        <div className={styles.panelFields}>
          <input placeholder="Email" value={email} onChange={handleEmailChange} />
          <input placeholder="Password" value={password} onChange={handlePasswordChange} />
          <input placeholder="Display Name" value={displayName} onChange={handleDisplayNameChange} />
          <div className={styles.ageRow}>
            Age: <input type="number" value={age} onChange={handleAgeChange} />
          </div>
        </div>
        <button type="button" onClick={handleSignup}>Sign up</button>
        <p>Already have an account? <span className={styles.signupLoginSpan} role="button" tabIndex={0} title="Log in" onClick={toggleLogin}>Log in</span></p>
        <hr />
        <span className={styles.errorText}>{error.length > 0 ? error : null}</span>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <h1>
        <span className={styles.ai}>AI</span>read
      </h1>
      {isLogin ? loginPanel() : signupPanel()}
    </div>
  );
}
