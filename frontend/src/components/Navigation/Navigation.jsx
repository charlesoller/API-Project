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
            <h1 className={styles.text}>spotbnb</h1>
          </NavLink>
        </li>
        {isLoaded && (
          <div className={styles.right}>
            {
              sessionUser && (
                <li>
                  <NavLink to="/spots/new" className={styles.create_spot}>Create a New Spot</NavLink>
                </li>
              )
            }
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          </div>

        )}
      </ul>
    </header>
  );
}

export default Navigation;
