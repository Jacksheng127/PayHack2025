import React from 'react';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  timestamp: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionDetailsProps {
  selectedNode: string | null;
  onClose?: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ selectedNode, onClose }) => {
  // Generate mock transaction data based on selected node
  const generateTransactions = (nodeId: string): Transaction[] => {
    const transactionTypes = ['credit', 'debit'] as const;
    const statuses = ['completed', 'pending', 'failed'] as const;
    const descriptions = [
      'ATM Withdrawal',
      'Online Purchase',
      'Transfer to Account',
      'Bill Payment',
      'Deposit',
      'Fee Charge',
      'Refund',
      'Interest Payment'
    ];

    return Array.from({ length: 8 }, (_, i) => ({
      id: `TXN_${nodeId}_${String(i + 1).padStart(3, '0')}`,
      amount: Math.floor(Math.random() * 5000) + 10,
      type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, type: 'credit' | 'debit'): string => {
    const formatted = `$${amount.toLocaleString()}`;
    return type === 'credit' ? `+${formatted}` : `-${formatted}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#2AA775';
      case 'pending':
        return '#FFD265';
      case 'failed':
        return '#E8544E';
      default:
        return '#ffffff';
    }
  };

  if (!selectedNode) {
    return onClose ? null : (
      <div className="transaction-details">
        <div className="transaction-placeholder">
          <div className="placeholder-content">
            <i className="fas fa-network-wired"></i>
            <h3>Select a Node</h3>
            <p>Click on any node in the network graph to view related transaction details.</p>
          </div>
        </div>
      </div>
    );
  }

  const transactions = generateTransactions(selectedNode);

  // Modal style when onClose is provided
  const modalStyle = onClose ? {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    width: '400px',
    height: '100vh',
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 1000,
    overflow: 'auto',
    padding: '20px',
    boxSizing: 'border-box' as const
  } : {};

  return (
    <div className="transaction-details" style={modalStyle}>
      {onClose && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '15px'
        }}>
          <h3 style={{ color: '#ffffff', margin: 0 }}>Transaction Details</h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕ Close
          </button>
        </div>
      )}
      
      <div className="transaction-header">
        <h3>
          <i className="fas fa-exchange-alt"></i>
          {selectedNode} Transactions
        </h3>
        <span className="transaction-count">{transactions.length} recent transactions</span>
      </div>

      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-main">
              <div className="transaction-info">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-id">ID: {transaction.id}</div>
                <div className="transaction-timestamp">{formatDate(transaction.timestamp)}</div>
              </div>
              <div className="transaction-amount-section">
                <div 
                  className={`transaction-amount ${transaction.type}`}
                >
                  {formatAmount(transaction.amount, transaction.type)}
                </div>
                <div 
                  className="transaction-status"
                  style={{ color: getStatusColor(transaction.status) }}
                >
                  <i className={`fas fa-circle status-${transaction.status}`}></i>
                  {transaction.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="transaction-summary">
        <div className="summary-item">
          <span className="summary-label">Total Credit:</span>
          <span className="summary-value credit">
            +${transactions
              .filter(t => t.type === 'credit')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Debit:</span>
          <span className="summary-value debit">
            -${transactions
              .filter(t => t.type === 'debit')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
