// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import styles from "./LoginForm.module.css"

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(res => {
        if(!res.ok){
          setErrors({ credential: "The provided credentials were invalid." });
        } else {
          closeModal()
        }
      })
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: "demo@user.io", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data) {
          setErrors({ credential: "Sorry, something went wrong. Please try again." });
        }
      });
  }

  return (
    <div className={styles.main}>
      <h1>Log In</h1>
      { errors.credential && (
          <p className={styles.error}>{errors.credential}</p>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.input_group}>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label className={styles.input_group}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button} disabled={credential.length < 4 || password.length < 6}>Log In</button>
      </form>

      <button className={styles.demo} onClick={handleDemoLogin}>Demo User</button>
    </div>
  );
}

export default LoginFormModal;
