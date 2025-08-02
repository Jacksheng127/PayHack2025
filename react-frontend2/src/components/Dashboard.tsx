import React, { useState } from 'react';
import '../styles/Dashboard.css';
import NetworkGraphVis from './NetworkGraphVis';
import NetworkGraphCytoscape from './NetworkGraphCytoscape';
import TransactionDetails from './TransactionDetails';

interface DashboardProps {
  onBackToFraudDetection: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBackToFraudDetection }) => {
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
            <NetworkGraphCytoscape onNodeClick={handleNodeClick} />
            {/* <NetworkGraphVis onNodeClick={handleNodeClick} /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
