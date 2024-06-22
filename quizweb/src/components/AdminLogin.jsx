import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/AdminLogin.module.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const adminPassword = 'Uk78504040Uk#'; 
    if (password === adminPassword) {
      localStorage.setItem('isAdmin', true);
      navigate('/admin');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Login</h2>
      <input
        type="password"
        className={styles.input}
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className={styles.button} onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;
