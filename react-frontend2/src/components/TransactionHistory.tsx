import React, { useState, useRef, useEffect } from 'react';
import { TransactionHistoryProps, TransactionHistoryItem } from '../types';

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  const filteredTransactions = transactions.filter((transaction: TransactionHistoryItem) => {
    if (!statusFilter) return true;
    return transaction.risk_level === statusFilter;
  });

  const transactionLabelsTable = {
    'L3': {
      scoreRange: '0.90 - 1.00',
      label: '🚨 Red Flag',
      permissions: '❌ Cannot Send or Receive',
      reasoning: 'Very high suspicion of laundering; Fan-in + Fan-out within short time; layering patterns detected'
    },
    'L2': {
      scoreRange: '0.70 - 0.90',
      label: '⚠️ Outbound Freeze',
      permissions: '✅ Can Receive ❌ Cannot Send',
      reasoning: 'Rapid fan-in detected, or unusual pattern; under investigation'
    },
    'L1': {
      scoreRange: '0.40 - 0.70',
      label: '🟡 Watchlist',
      permissions: '✅ Can Send & Receive',
      reasoning: 'Mildly abnormal pattern (e.g., new account w/ frequent p2p inflow); monitored but not blocked'
    },
    'L0': {
      scoreRange: '0.00 - 0.40',
      label: '🟢 Normal',
      permissions: '✅ Fully Operational',
      reasoning: 'Behavior aligns with normal expected pattern for their entity type'
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="demo-section" id="history-section">
      <div className="section-header">
        <div className="section-header-content">
          <h2>
            <i className="fas fa-history"></i> Transaction History
          </h2>
          <div ref={popoverRef} className="info-button-container">
            <button 
              className="info-button"
              onClick={() => setShowPopover(!showPopover)}
              title="Risk Level Information"
            >
              <i className="fas fa-info-circle"></i>
            </button>
            {showPopover && (
              <div className="risk-level-popover">
                <div className="popover-header">Risk Level Guide</div>
                <div className="popover-content">
                  {Object.entries(transactionLabelsTable).map(([level, info]) => (
                    <div key={level} className="risk-level-item">
                      <div className="risk-level-header">
                        <span className={`status-badge ${level.toLowerCase()}`}>{level}</span>
                      </div>
                      <div className="risk-details">
                        <div className="risk-detail-row">
                          <strong>Label:</strong> {info.label}
                        </div>
                        <div className="risk-detail-row">
                          <strong>Score Range:</strong> {info.scoreRange}
                        </div>
                        <div className="risk-detail-row">
                          <strong>Permissions:</strong> {info.permissions}
                        </div>
                        <div className="risk-detail-row">
                          <strong>Reasoning:</strong> {info.reasoning}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <p>Recent transaction analysis results</p>
        
      </div>

      <div className="history-filters">
        <select 
          id="status-filter" 
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="">All Risk Levels</option>
          <option value="L1">L3 - Red Flag</option>
          <option value="L2">L2 - Outbound Freeze</option>
          <option value="L3">L1 - Watchlist</option>
          <option value="L4">L0 - Normal</option>
        </select>
      </div>

      <div id="history-content">
        {!filteredTransactions || filteredTransactions.length === 0 ? (
          <p>No transaction history available.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Sender ID</th>
                <th>Receiver ID</th>
                <th>Timestamp</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Sender Type</th>
                <th>Receiver Type</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx: TransactionHistoryItem, index: number) => (
                <tr key={index}>
                  <td>{tx.id}</td>
                  <td>{tx.sender_id}</td>
                  <td>{tx.receiver_id}</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>${parseFloat(tx.amount.toString()).toLocaleString()}</td>
                  <td>{tx.transaction_type.replace('es_', '').replace('_', ' ')}</td>
                  <td>
                    {<span>{tx.sender_type}</span>}
                  </td>
                  <td>
                    {<span>{tx.receiver_type}</span>}
                  </td>
                  <td>
                    <span className={`status-badge ${tx.risk_level}`}>
                      {tx.risk_level}
                    </span>
                  </td>
                  {/* <td>
                    <span className={`status-badge ${tx.is_fraud ? 'blocked' : 'approved'}`}>
                      {tx.is_fraud ? 'FRAUD' : 'LEGITIMATE'}
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
