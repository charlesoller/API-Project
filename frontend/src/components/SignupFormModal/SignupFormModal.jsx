import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import styles from './SignupForm.module.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  // This function is only responsible for handling whether or not the button is disabled.
  const validateFields = () => {
    if(!email.length || !username.length || !firstName.length
      || !lastName.length || !password.length || !confirmPassword.length
      || username.length < 4 || password.length < 6) {
      return true
    } else {
      return false
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className={styles.main}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.input_group}>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        {errors.email && <p className={styles.error}>{errors.email}</p>}
        <label className={styles.input_group}>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        {errors.username && <p className={styles.error}>{errors.username}</p>}
        <label className={styles.input_group}>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
        <label className={styles.input_group}>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
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
        {errors.password && <p className={styles.error}>{errors.password}</p>}
        <label className={styles.input_group}>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}
        <button type="submit" className={styles.button} disabled={validateFields()}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
