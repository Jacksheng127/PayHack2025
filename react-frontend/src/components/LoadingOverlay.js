import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Analyzing transaction...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
