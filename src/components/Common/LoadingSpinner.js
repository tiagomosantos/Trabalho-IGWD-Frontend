import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ message = "A carregar..." }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
