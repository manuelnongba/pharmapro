import React from 'react';
import { NavLink } from 'react-router-dom';
import Logout from '../containers/authentication/Logout';
import styles from '../styles/AttendantHeader.module.css';

const AttendantHeader = () => {
  return (
    <div className={styles.attendantheader}>
      <div>
        <NavLink to="/attendant/dashboard">Dashboard</NavLink>
        <NavLink to="/attendant/transact">Transact</NavLink>
      </div>
      <Logout />
    </div>
  );
};

export default AttendantHeader;
