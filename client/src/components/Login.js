import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const LoginButton = () => {
  return (
    <div className={styles.login}>
      <img
        src="https://res.cloudinary.com/drxwuqu3v/image/upload/v1672880675/logo_tiappr.svg"
        alt="pharmapro-logo"
        className={styles.logo}
      />

      <p>Welcome to PharmaPro</p>
      <p>Login with your account to continue</p>

      <NavLink to="/login">
        <button>Login</button>
      </NavLink>
    </div>
  );
};
export default LoginButton;
