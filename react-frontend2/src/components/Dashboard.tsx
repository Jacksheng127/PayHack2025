import React, { useState } from 'react';
import '../styles/Dashboard.css';
import NetworkGraphVis from './NetworkGraphVis';
import NetworkGraphCytoscape from './NetworkGraphCytoscape';
import TransactionDetails from './TransactionDetails';
import { DashboardProps } from '../types';

const Dashboard: React.FC<DashboardProps> = ({ onBackToFraudDetection, newTransaction, allTransactions, onTransactionAdded }) => {
  console.log('🎛️ Dashboard component rendered with props:', {
    newTransaction: newTransaction ? `${newTransaction.id} (${newTransaction.customer} → ${newTransaction.merchant}, $${newTransaction.amount})` : 'null',
    allTransactions: allTransactions ? `${allTransactions.length} transactions` : 'null',
    onTransactionAdded: !!onTransactionAdded,
    transactionIds: allTransactions?.map(t => t.id).join(', ') || 'none'
  });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      {/* <div className="dashboard-header">
        <div className="header-left">
          <button className="btn-back" onClick={onBackToFraudDetection}>
            <i className="fas fa-arrow-left"></i> Back to Fraud Detection
          </button>
        </div>
      </div> */}

      {/* Main Layout - Left Side Transactions and Right Side Network Graph */}
      <div className="right-dashboard-area">
        <div className="network-graph-section">
            <NetworkGraphCytoscape 
              key={`graph-${allTransactions?.length || 0}-${newTransaction?.id || 'none'}`} // Better key to force updates
              onNodeClick={handleNodeClick} 
              newTransaction={newTransaction}
              allTransactions={allTransactions}
              onTransactionAdded={onTransactionAdded}
              buildNewGraph={true}
            />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
