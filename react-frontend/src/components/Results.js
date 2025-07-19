import React from 'react';

const Results = ({ results }) => {
  const statusClass = results.is_fraud ? 'blocked' : 'approved';
  const riskLevelClass = results.risk_level;
  const fraudPercentage = Math.round(results.fraud_probability * 100);

  const getStatusIcon = (isFraud) => {
    return isFraud ? 'fa-ban' : 'fa-check-circle';
  };

  return (
    <div className="demo-section" id="results-section">
      <div className="section-header">
        <h2><i className="fas fa-chart-bar"></i> Analysis Results</h2>
        <p>Risk assessment and compliance check results</p>
      </div>

      <div className="results-grid">
        <div className={`result-card ${statusClass}`}>
          <div className="result-header">
            <i className={`fas ${getStatusIcon(results.is_fraud)}`}></i>
            <h3>Fraud Detection Result</h3>
          </div>
          <div className={`risk-score ${riskLevelClass}`}>{fraudPercentage}%</div>
          <div className={`status-badge ${statusClass}`}>
            {results.is_fraud ? 'FRAUD DETECTED' : 'LEGITIMATE'}
          </div>
          <p style={{ marginTop: '15px', textAlign: 'center' }}>
            <strong>Risk Level:</strong> {results.risk_level.toUpperCase()}
          </p>
        </div>
        
        <div className="result-card">
          <div className="result-header">
            <i className="fas fa-chart-line"></i>
            <h3>Risk Metrics</h3>
          </div>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-label">Fraud Probability</div>
              <div className="metric-value">{fraudPercentage}%</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Anomaly Score</div>
              <div className="metric-value">{results.anomaly_score.toFixed(1)}</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Risk Level</div>
              <div className={`metric-value ${riskLevelClass}`}>{results.risk_level.toUpperCase()}</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Transaction ID</div>
              <div className="metric-value">{results.transaction_id}</div>
            </div>
          </div>
        </div>
        
        <div className="result-card">
          <div className="result-header">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Risk Factors</h3>
          </div>
          <ul className="risk-factors-list">
            {results.risk_factors && results.risk_factors.length > 0 ? (
              results.risk_factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))
            ) : (
              <li>No significant risk factors identified</li>
            )}
          </ul>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: 'rgba(59, 130, 246, 0.05)', 
        borderRadius: '8px', 
        border: '1px solid rgba(59, 130, 246, 0.2)' 
      }}>
        <h4 style={{ color: 'var(--info-color)', marginBottom: '10px' }}>
          <i className="fas fa-lightbulb"></i> Analysis Summary
        </h4>
        <p>
          {results.is_fraud 
            ? 'This transaction has been flagged as potentially fraudulent based on the risk analysis.' 
            : 'This transaction appears to be legitimate based on the risk analysis.'
          }
        </p>
        <div style={{ 
          marginTop: '15px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '14px', 
          color: 'var(--text-light)' 
        }}>
          <span>Analysis Time: {new Date(results.timestamp).toLocaleString()}</span>
          <span>Transaction ID: {results.transaction_id}</span>
        </div>
      </div>
    </div>
  );
};

export default Results;
