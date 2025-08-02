import React from 'react';
import { AlertModalProps } from '../types';

const AlertModal: React.FC<AlertModalProps> = ({ data, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleStopPropagation = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content alert-modal" onClick={handleStopPropagation}>
        <div className="modal-header alert">
          <h3><i className="fas fa-exclamation-triangle"></i> High Risk Transaction Detected</h3>
        </div>
        <div className="modal-body">
          <p>This transaction has been flagged as high risk. An email alert has been sent to the compliance team.</p>
          <div className="alert-details">
            <h4>Fraud Alert Details:</h4>
            <p><strong>Transaction ID:</strong> {data.transaction_id}</p>
            <p><strong>Fraud Probability:</strong> {Math.round(data.fraud_probability * 100)}%</p>
            <p><strong>Risk Level:</strong> {data.risk_level.toUpperCase()}</p>
            <p><strong>Anomaly Score:</strong> {data.anomaly_score.toFixed(1)}</p>
            <p><strong>Alert Recipients:</strong> fraud-detection@gosel.com, compliance@gosel.com</p>
            <p><strong>Time:</strong> {data.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}</p>
            
            <h4 style={{ marginTop: '15px' }}>Risk Factors:</h4>
            <ul>
              {data.risk_factors && data.risk_factors.map((factor: string, index: number) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn primary" onClick={onClose}>Acknowledge</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
