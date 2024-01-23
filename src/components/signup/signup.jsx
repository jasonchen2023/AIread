import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';
import background from '../../assets/background3.svg';
import { signup } from '../../services/firebase';

export default function Signup(props) {
  const [formData, setFormData] = useState({ email: '', password: '', age: '18', displayName: '' });
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const failureToast = (message) => toast(message);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  const handleSignup = () => {
    const { email, password, displayName, age } = formData;

    if (Object.values(formData).some((value) => value.trim() === '' || !parseInt(age, 10))) {
      failureToast('Please fill out all fields!');
      return;
    }

    dispatch(signup(email, password, displayName, parseInt(age, 10), failureToast, props.fullpageApi));
  };

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${background}` }}>
      <h1>
        <span className={styles.ai}>AI</span>read
      </h1>
      <div className={styles.loginSignupPanel}>
        <h2>Signup</h2>
        <div className={styles.panelFields}>
          {['email', 'password', 'displayName', 'age'].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field === 'age' ? 'Age' : field.replace(/([A-Z])/g, ' $1').trim()}
              type={field === 'password' ? 'password' : 'text'}
              value={formData[field]}
              onChange={handleInputChange}
            />
          ))}
        </div>
        <button type="button" onClick={handleSignup}>Sign up</button>
        <p>
          {isLogin ? 'Already have an account?' : 'Don\'t have an account?'}
          <span className={styles.signupLoginSpan} role="button" tabIndex={0} title={isLogin ? 'Log in' : 'Sign up'} onClick={toggleLogin}>
            {isLogin ? 'Log in' : 'Sign up'}
          </span>
        </p>
        <hr />
      </div>
    </div>
  );
}
