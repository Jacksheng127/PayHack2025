import React, { useState, useEffect, useCallback } from 'react';
import './styles/App.css';
import TransactionForm from './components/TransactionForm';
import Results from './components/Results';
import TransactionHistory from './components/TransactionHistory';
import AlertModal from './components/AlertModal';
import LoadingOverlay from './components/LoadingOverlay';

const API_BASE_URL = 'http://localhost:5050';

function App() {
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Generate random transaction ID
  const generateTransactionId = () => {
    const prefix = 'TXN_';
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return prefix + randomNum;
  };

  // Load transaction history
  const loadTransactionHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fraud-history`);
      
      if (response.ok) {
        const data = await response.json();
        setTransactionHistory(data.transactions || []);
      } else {
        // Use mock data for demo
        setTransactionHistory(getMockTransactionHistory());
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setTransactionHistory(getMockTransactionHistory());
    }
  }, []);

  // Get mock transaction history
  const getMockTransactionHistory = () => {
    return [
      {
        id: 'TXN_12345',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        amount: 2500.50,
        customer: 'C1093826151',
        merchant: 'M348934600',
        category: 'es_food',
        is_fraud: false,
        fraud_probability: 0.23,
        risk_level: 'low',
        anomaly_score: 25.4
      },
      {
        id: 'TXN_12344',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        amount: 15000.00,
        customer: 'C2047391825',
        merchant: 'M759482016',
        category: 'es_misc_net',
        is_fraud: true,
        fraud_probability: 0.87,
        risk_level: 'high',
        anomaly_score: 92.1
      },
      {
        id: 'TXN_12343',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        amount: 750.25,
        customer: 'C8372649103',
        merchant: 'M527839461',
        category: 'es_grocery_pos',
        is_fraud: false,
        fraud_probability: 0.12,
        risk_level: 'low',
        anomaly_score: 18.7
      }
    ];
  };

  // Submit transaction to backend
  const submitTransaction = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // For demo purposes, return mock data if API is not available
      return generateMockResponse(data);
    }
  };

  // Generate mock response for demo purposes
  const generateMockResponse = (data) => {
    const fraudProbability = calculateMockFraudProbability(data);
    const isFraud = fraudProbability > 0.5;
    const riskLevel = fraudProbability > 0.8 ? 'high' : fraudProbability > 0.4 ? 'medium' : 'low';
    const anomalyScore = Math.random() * 100;
    
    return {
      success: true,
      data: {
        transaction_id: data.transaction_id,
        is_fraud: isFraud,
        fraud_probability: Math.round(fraudProbability * 100) / 100,
        risk_level: riskLevel,
        anomaly_score: Math.round(anomalyScore * 100) / 100,
        risk_factors: identifyRiskFactors(data),
        timestamp: data.timestamp
      }
    };
  };

  // Calculate mock fraud probability based on input data
  const calculateMockFraudProbability = (data) => {
    let score = 0;
    let factors = 0;
    
    // Amount-based risk
    const amount = parseFloat(data.amount);
    factors++;
    if (amount > 10000) score += 0.3;
    else if (amount > 5000) score += 0.2;
    else if (amount > 1000) score += 0.1;
    else score += 0.05;
    
    // Age-based risk
    const age = parseInt(data.age);
    factors++;
    if (age < 25 || age > 65) score += 0.15;
    else score += 0.05;
    
    // Category-based risk
    factors++;
    const highRiskCategories = ['es_misc_net', 'es_misc_pos', 'es_entertainment'];
    if (highRiskCategories.includes(data.category)) {
      score += 0.2;
    } else {
      score += 0.05;
    }
    
    // Add some randomness for demo
    factors++;
    score += Math.random() * 0.2;
    
    return Math.min(score / factors, 1.0);
  };

  // Identify risk factors based on data
  const identifyRiskFactors = (data) => {
    const factors = [];
    
    if (parseFloat(data.amount) > 5000) {
      factors.push('High value transaction');
    }
    
    if (parseInt(data.age) < 25) {
      factors.push('Young customer profile');
    } else if (parseInt(data.age) > 65) {
      factors.push('Senior customer profile');
    }
    
    const highRiskCategories = ['es_misc_net', 'es_misc_pos', 'es_entertainment'];
    if (highRiskCategories.includes(data.category)) {
      factors.push('High risk transaction category');
    }
    
    if (data.zipcodeOri !== data.zipMerchant) {
      factors.push('Customer and merchant in different locations');
    }
    
    if (Math.random() > 0.7) {
      factors.push('Unusual transaction timing');
    }
    
    return factors;
  };

  // Handle form submission
  const handleFormSubmit = async (transactionData) => {
    setLoading(true);
    
    try {
      const response = await submitTransaction(transactionData);
      
      if (response.success) {
        setResults(response.data);
        setShowResults(true);
        
        // Show alert modal if fraud is detected
        if (response.data.is_fraud || response.data.risk_level === 'high') {
          setAlertData(response.data);
          setShowAlert(true);
        }
        
        // Refresh history
        loadTransactionHistory();
      } else {
        alert('Failed to analyze transaction: ' + response.message);
      }
    } catch (error) {
      alert('Error submitting transaction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // View history
  const handleViewHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      loadTransactionHistory();
    }
  };

  // Load transaction history on component mount
  useEffect(() => {
    loadTransactionHistory();
  }, [loadTransactionHistory]);

  return (
    <div className="demo-container">
      {/* Header */}
      <header className="demo-header">
        <div className="logo">
          <h1><i className="fas fa-shield-alt"></i> GOSEL Model Demo</h1>
          <p>Test transaction risk assessment and compliance checking</p>
        </div>
        <div className="header-actions">
          <button className="btn secondary" onClick={handleViewHistory}>
            <i className="fas fa-history"></i> View History
          </button>
          <button className="btn outline" onClick={() => setShowResults(false)}>
            <i className="fas fa-refresh"></i> Clear Results
          </button>
        </div>
      </header>

      <div className="demo-content">
        {/* Transaction Input Form */}
        <TransactionForm 
          onSubmit={handleFormSubmit}
          generateTransactionId={generateTransactionId}
        />

        {/* Results Section */}
        {showResults && results && (
          <Results results={results} />
        )}

        {/* Transaction History */}
        {showHistory && (
          <TransactionHistory 
            transactions={transactionHistory}
            onRefresh={loadTransactionHistory}
          />
        )}
      </div>

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}

      {/* Email Alert Modal */}
      {showAlert && alertData && (
        <AlertModal 
          data={alertData}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default App;
