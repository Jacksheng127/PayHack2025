import React, { useState } from 'react';

const TransactionHistory = ({ transactions, onRefresh }) => {
  const [statusFilter, setStatusFilter] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    if (!statusFilter) return true;
    const status = transaction.is_fraud ? 'fraud' : 'legitimate';
    return status.includes(statusFilter);
  });

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
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="legitimate">Legitimate</option>
          <option value="fraud">Fraud</option>
        </select>
        <button className="btn outline" onClick={onRefresh}>
          <i className="fas fa-refresh"></i> Refresh
        </button>
      </div>

      <div id="history-content">
        {!filteredTransactions || filteredTransactions.length === 0 ? (
          <p>No transaction history available.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Timestamp</th>
                <th>Amount</th>
                <th>Customer</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Fraud Probability</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx.id}</td>
                  <td>{new Date(tx.timestamp).toLocaleString()}</td>
                  <td>${parseFloat(tx.amount).toLocaleString()}</td>
                  <td>{tx.customer}</td>
                  <td>{tx.merchant}</td>
                  <td>{tx.category.replace('es_', '').replace('_', ' ')}</td>
                  <td>{Math.round(tx.fraud_probability * 100)}%</td>
                  <td>
                    <span className={`status-badge ${tx.is_fraud ? 'blocked' : 'approved'}`}>
                      {tx.is_fraud ? 'FRAUD' : 'LEGITIMATE'}
                    </span>
                  </td>
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
