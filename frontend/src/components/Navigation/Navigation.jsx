// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import styles from './Navigation.module.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header className={styles.header}>
      <ul className={styles.list}>
        <li className={styles.left}>
          <NavLink to="/" className={styles.home}>
            <img src='https://seeklogo.com/images/A/airbnb-logo-1D03C48906-seeklogo.com.png' className={styles.logo} />
            <h1 className={styles.text}>housebnb</h1>
          </NavLink>
        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </header>
  );
}

export default Navigation;
