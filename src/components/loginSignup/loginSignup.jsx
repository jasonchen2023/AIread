import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';
import background from '../../assets/background3.svg';
import { login, signup } from '../../services/firebase';

export default function LoginSignup(props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('18');
  const [displayName, setDisplayName] = useState('');

  const dispatch = useDispatch();

  const failureToast = (message) => toast(message);

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

  const handleLogin = () => {
    dispatch(login(email, password, failureToast, props.fullpageApi));
  };

  const handleSignup = () => {
    if (email.trim().length === 0 || password.trim().length === 0 || displayName.trim().length === 0 || !parseInt(age, 10)) {
      failureToast('Please fill out all fields!');
      return;
    }
    dispatch(signup(email, password, displayName, parseInt(age, 10), failureToast, props.fullpageApi));
  };

  const loginPanel = () => {
    return (
      <div className={styles.loginSignupPanel}>
        <h2>Login</h2>
        <div className={styles.panelFields}>
          <input placeholder="Email" value={email} onChange={handleEmailChange} />
          <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
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
          <input placeholder="Password" type="password" value={password} onChange={handlePasswordChange} />
          <input placeholder="Display Name" value={displayName} onChange={handleDisplayNameChange} />
          <div className={styles.ageRow}>
            Age: <input type="number" value={age} onChange={handleAgeChange} />
          </div>
        </div>
        <button type="button" onClick={handleSignup}>Sign up</button>
        <p>Already have an account? <span className={styles.signupLoginSpan} role="button" tabIndex={0} title="Log in" onClick={toggleLogin}>Log in</span></p>
        <hr />
      </div>
    );
  };

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${background}` }}>
      <h1>
        <span className={styles.ai}>AI</span>read
      </h1>
      {isLogin ? loginPanel() : signupPanel()}
    </div>
  );
}
