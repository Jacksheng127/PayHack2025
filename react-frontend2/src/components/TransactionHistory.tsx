import React, { useState } from 'react';
import { TransactionHistoryProps, TransactionHistoryItem } from '../types';

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredTransactions = transactions.filter((transaction: TransactionHistoryItem) => {
    if (!statusFilter) return true;
    return transaction.risk_level === statusFilter;
  });

  const transactionLabelsTable = {
    'L0': 'Low Risk',
    'L1': 'Medium Risk',
    'L2': 'High Risk',
    'L3': 'Critical Risk'
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="demo-section" id="history-section">
      <div className="section-header">
        <h2><i className="fas fa-history"></i> Transaction History</h2>
        <p>Recent transaction analysis results</p>
      </div>

      <div className="history-filters">
        <select 
          id="status-filter" 
          value={statusFilter}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="legitimate">Legitimate</option>
          <option value="fraud">Fraud</option>
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
