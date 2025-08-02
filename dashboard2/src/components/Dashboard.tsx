import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';
import Card from './Card';
import GeographicDistribution from './GeographicDistribution';
import AccountBalance from './AccountBalance';
import AvailableFunds from './AvailableFunds';
import BalanceOverview from './BalanceOverview';
import PayIn from './PayIn';
import PayOut from './PayOut';

// Sample data for charts
const balanceData = [
  { name: 'Feb', value: 234000 },
  { name: 'Mar', value: 298000 },
  { name: 'Apr', value: 356000 },
  { name: 'May', value: 412000 },
  { name: 'Jun', value: 456000 },
  { name: 'Jul', value: 589000 },
  { name: 'Aug', value: 847392 },
];

const payInData = [
  { name: 'W1', value: 85 },
  { name: 'W2', value: 120 },
  { name: 'W3', value: 145 },
  { name: 'W4', value: 180 },
  { name: 'W5', value: 200 },
];

const payOutData = [
  { name: 'W1', value: 65 },
  { name: 'W2', value: 85 },
  { name: 'W3', value: 110 },
  { name: 'W4', value: 135 },
  { name: 'W5', value: 160 },
];

const geographicData = [
  { name: 'W1', value: 45 },
  { name: 'W2', value: 52 },
  { name: 'W3', value: 68 },
  { name: 'W4', value: 85 },
  { name: 'W5', value: 95 },
];

const fundsData = [
  { name: 'Available', value: 1200000, color: '#4285f4' },
  { name: 'Reserved', value: 800000, color: '#1a73e8' },
  { name: 'Pending', value: 400000, color: '#0d47a1' },
];

const balanceOverviewData = [
  { name: 'Jan', checking: 180000, savings: 320000, investment: 120000 },
  { name: 'Feb', checking: 200000, savings: 340000, investment: 140000 },
  { name: 'Mar', checking: 220000, savings: 380000, investment: 150000 },
  { name: 'Apr', checking: 234000, savings: 420000, investment: 157000 },
  { name: 'May', checking: 234000, savings: 456000, investment: 157000 },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Financial');

  // Navigate back to fraud detection app
  const viewFraudDetection = (): void => {
    window.open('http://localhost:3001', '_blank');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <input 
            type="date" 
            className="date-selector"
            defaultValue="2024-01-15"
          />
          <button className="btn-back" onClick={viewFraudDetection}>
            <i className="fas fa-arrow-left"></i> Back to Fraud Detection
          </button>
        </div>
        <nav className="nav-tabs">
          {['Financial', 'Operational', 'Compliance'].map((tab) => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <Card title="TOTAL TRANSACTIONS" value="98,234" label="Transactions" />
        <Card title="DAILY VOLUME" value="$2.4M" label="USD" />
        <Card title="SUCCESS RATE" value="99.2%" label="Processed" />
        <Card title="ACTIVE ACCOUNTS" value="4,567" label="Accounts" />
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div>
          {/* Account Balance Chart */}
          <AccountBalance
            chartTitle="Account Balance"
            chartValue={847392}
            balanceData={balanceData}
          />
          {/* <div className="chart-card">
            <div className="chart-header">
              <span className="chart-title">Account Balance</span>
              <span className="chart-value">$847,392</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={balanceData}>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4285f4" 
                  fill="rgba(66, 133, 244, 0.1)"
                  strokeWidth={4}
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                />
                <YAxis hide />
              </AreaChart>
            </ResponsiveContainer> */}
            
            {/* Account Details */}
            <div className="accounts-grid">
              <div className="account-item">
                <div className="account-value">$234K</div>
                <div className="account-label">Checking</div>
              </div>
              <div className="account-item">
                <div className="account-value">$456K</div>
                <div className="account-label">Savings</div>
              </div>
              <div className="account-item">
                <div className="account-value">$157K</div>
                <div className="account-label">Investment</div>
              </div>
            </div>
            
            <div className="total-accounts">
              <div className="total-label">Total Balance</div>
              <div className="total-value">$847,392</div>
            </div>
          {/* </div> */}

          {/* Entities Card */}
          <div className="entity-card">
            <div className="entity-value">2,347</div>
            <div className="entity-label">Total Entities</div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Available Funds with Pie Chart */}
          <AvailableFunds
            chartTitle="Available Funds"
            chartValue="$1,200,000"
            fundsData={fundsData}
          />


          {/* Balance Overview */}
          <BalanceOverview
            balanceTitle="Balance Overview"
            balanceAmount="$2,847,392"
            balanceOverviewData={balanceOverviewData}
          />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="bottom-grid">
        {/* Pay In */}
        <PayIn
          title="Pay In"
          count={1234}
          payInData={payInData}
        />

        {/* Pay Out */}
        <PayOut
            title="Pay Out"
            count={987}
            payOutData={payOutData}
        />
          {/* FX Section */}
          <div className="fx-section">
            <div className="fx-header">
              <span className="fx-title">FX</span>
            </div>
            <div className="fx-metrics">
              <div className="fx-item">
                <div className="fx-value">$12K</div>
                <div className="fx-label">VOLUME</div>
              </div>
              <div className="fx-item">
                <div className="fx-value">0.8%</div>
                <div className="fx-label">MARGIN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <GeographicDistribution
          payTitle="Geographic Distribution"
          payCount={45}
          geographicData={geographicData}
        />
    </div>
  );
};

export default Dashboard;
