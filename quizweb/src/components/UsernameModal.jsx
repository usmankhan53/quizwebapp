import React, { useState } from 'react';
import '../css/UsernameModal.css'; // Import the CSS file for styling

function UsernameModal({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trim spaces from username
    const trimmedUsername = username.trim();

    // Regular expression to match alphanumeric characters
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (trimmedUsername === '') {
      setErrorMessage('Please enter a username');
      return;
    }

    if (!alphanumericRegex.test(trimmedUsername)) {
      setErrorMessage('Username must be alphanumeric');
      return;
    }

    // Reset error message
    setErrorMessage('');

    // Call onSubmit with trimmed username
    onSubmit(trimmedUsername);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // Clear error message if username is not empty
    if (e.target.value.trim() !== '') {
      setErrorMessage('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Enter Your Username</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="username-input"
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UsernameModal;
