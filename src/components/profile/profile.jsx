import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';
import {
  auth, logOut, setNewPassword, updateUserDoc,
} from '../../firebase';

export default function Landing(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const displayName = useSelector((state) => state.user.displayName);
  const age = useSelector((state) => state.user.age);
  const fieldOfInterest = useSelector((state) => state.user.fieldOfInterest);
  const [resetPassword, setResetPassword] = useState('');

  const updateInfo = (fields) => {
    const newFields = fields;
    if (newFields.age !== undefined && !parseInt(newFields.age, 10)) {
      return;
    } else if (newFields.age !== undefined) {
      newFields.age = parseInt(newFields.age, 10);
    }
    dispatch(updateUserDoc(newFields));
  };

  const successToast = () => toast('Password Updated');
  const failureToast = () => toast('Couldn\'t Update Password');

  return (
    <div id={styles.page}>
      <div id={styles.header}>
        <NavLink to="/">AIread</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
      <div id={styles.profileContainer} />
      <div className={styles.infoRow}>
        <p>Email</p>
        <input type="text" disabled defaultValue={auth.currentUser.email} />
        <div className={styles.rightContainer} />
      </div>
      <div className={styles.infoRow}>
        <p>Display Name</p>
        <input type="text" defaultValue={displayName} onChange={(event) => updateInfo({ displayName: event.target.value })} />
        <div className={styles.rightContainer} />
      </div>
      <div className={styles.infoRow}>
        <p>Reset Password</p>
        <input className={styles.resetPasswordInput} value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} type="text" />
        <div className={styles.rightContainer}>
          <button type="button" className={styles.resetPasswordButton} onClick={() => setNewPassword(resetPassword, setResetPassword, successToast, failureToast)}>Submit</button>
        </div>
      </div>
      <div className={styles.infoRow}>
        <p>Age</p>
        <div className={styles.ageFieldContainer}>
          <input type="number" defaultValue={age} onChange={(event) => updateInfo({ age: event.target.value })} />
        </div>
        <div className={styles.rightContainer} />
      </div>
      <div className={styles.infoRow}>
        <p>Field of Interest</p>
        <div className={styles.ageFieldContainer}>
          <input type="text" defaultValue={fieldOfInterest} onChange={(event) => updateInfo({ fieldOfInterest: event.target.value })} />
        </div>
        <div className={styles.rightContainer} />
      </div>
      <button type="button" className={styles.logoutButton} onClick={() => dispatch(logOut(navigate))}>Logout</button>
    </div>
  );
}
