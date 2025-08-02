import React from 'react';

interface Transaction {
  id: string;
  customer: string;
  merchant: string;
  amount: number;
  category: string;
  isFraud: boolean;
  riskLevel: string;
  timestamp?: string;
  transaction_type?: string;
  sender_type?: string;
  receiver_type?: string;
}

interface TransactionDetailsProps {
  selectedNode: string | null;
  allTransactions?: Transaction[];
  nodeData?: any; // Data from the selected node
  onClose?: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ selectedNode, allTransactions = [], nodeData, onClose }) => {
  
  console.log('🔍 TransactionDetails rendered:', {
    selectedNode,
    allTransactionsCount: allTransactions.length,
    allTransactionIds: allTransactions.map(t => t.id).join(', '),
    nodeData
  });
  
  // Get transactions related to the selected node
  const getRelatedTransactions = (nodeId: string): Transaction[] => {
    if (!allTransactions || allTransactions.length === 0) {
      console.log('❌ No transactions available');
      return [];
    }
    
    // Filter transactions where the node is either sender or receiver
    const related = allTransactions.filter(transaction => 
      transaction.customer === nodeId || 
      transaction.merchant === nodeId
    ).sort((a, b) => {
      // Sort by timestamp if available, otherwise by ID
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA; // Most recent first
    });
    
    console.log(`🔎 Found ${related.length} transactions for node ${nodeId}:`, 
      related.map(t => `${t.id} (${t.customer} → ${t.merchant}, $${t.amount})`));
    
    return related;
  };

  const formatDate = (timestamp?: string): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, isOutgoing: boolean): string => {
    const formatted = `$${amount.toLocaleString()}`;
    return isOutgoing ? `-${formatted}` : `+${formatted}`;
  };

  const getRiskLevelColor = (riskLevel: string): string => {
    switch (riskLevel.toLowerCase()) {
      case 'l1':
      case 'high':
        return '#E8544E';
      case 'l2':
      case 'medium':
        return '#FFD265';
      case 'l3':
      case 'low':
        return '#2AA775';
      case 'l4':
      case 'l0':
      default:
        return '#2AA775';
    }
  };

  const getTransactionType = (transaction: Transaction, selectedNodeId: string): 'outgoing' | 'incoming' => {
    return transaction.customer === selectedNodeId ? 'outgoing' : 'incoming';
  };

  const getTransactionDescription = (transaction: Transaction, selectedNodeId: string): string => {
    const isOutgoing = transaction.customer === selectedNodeId;
    const otherParty = isOutgoing ? transaction.merchant : transaction.customer;
    const direction = isOutgoing ? 'to' : 'from';
    const category = transaction.category || transaction.transaction_type || 'transfer';
    
    return `${category.replace('_', ' ').replace('es_', '')} ${direction} ${otherParty}`;
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

  const transactions = getRelatedTransactions(selectedNode);

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
        <span className="transaction-count">{transactions.length} transactions found</span>
      </div>

      {transactions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <i className="fas fa-info-circle" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
          <p>No transactions found for this entity.</p>
        </div>
      ) : (
        <>
          <div className="transaction-list">
            {transactions.map((transaction: Transaction) => {
              const isOutgoing = getTransactionType(transaction, selectedNode) === 'outgoing';
              const description = getTransactionDescription(transaction, selectedNode);
              
              return (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-main">
                    <div className="transaction-info">
                      <div className="transaction-description">{description}</div>
                      <div className="transaction-id">ID: {transaction.id}</div>
                      <div className="transaction-timestamp">{formatDate(transaction.timestamp)}</div>
                    </div>
                    <div className="transaction-amount-section">
                      <div 
                        className={`transaction-amount ${isOutgoing ? 'debit' : 'credit'}`}
                      >
                        {formatAmount(transaction.amount, isOutgoing)}
                      </div>
                      <div 
                        className="transaction-status"
                        style={{ color: getRiskLevelColor(transaction.riskLevel) }}
                      >
                        <i className="fas fa-circle"></i>
                        {transaction.isFraud ? 'FRAUD' : transaction.riskLevel}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="transaction-summary">
            <div className="summary-item">
              <span className="summary-label">Total Incoming:</span>
              <span className="summary-value credit">
                +${transactions
                  .filter((t: Transaction) => getTransactionType(t, selectedNode) === 'incoming')
                  .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Outgoing:</span>
              <span className="summary-value debit">
                -${transactions
                  .filter((t: Transaction) => getTransactionType(t, selectedNode) === 'outgoing')
                  .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionDetails;
