import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';
import background from '../../assets/background3.svg';
import { login } from '../../services/firebase';

export default function Login(props) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const failureToast = (message) => toast(message);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleLogin = () => {
    setFormData({ email: '', password: '' });
  };

  const handleAuth = () => {
    dispatch(login(formData.email, formData.password, failureToast, props.fullpageApi));
  };

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${background}` }}>
      <h1>
        <span className={styles.ai}>AI</span>read
      </h1>
      <div className={styles.loginSignupPanel}>
        <h2>Login</h2>
        <div className={styles.panelFields}>
          {Object.entries(formData).map(([field, value]) => (
            <input
              key={field}
              name={field}
              placeholder={field === 'email' ? 'Email' : 'Password'}
              type={field === 'password' ? 'password' : 'text'}
              value={value}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <button type="button" onClick={handleAuth}>Log in</button>
        <p>Don&apos;t have an account? <span className={styles.signupLoginSpan} role="button" tabIndex={0} title="Sign Up" onClick={toggleLogin}>Sign up</span></p>
        <hr />
      </div>
    </div>
  );
}
