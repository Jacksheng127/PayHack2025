import React, { useState, useEffect, useCallback } from 'react';
import './styles/App.css';
import TransactionForm from './components/TransactionForm';
import Results from './components/Results';
import TransactionHistory from './components/TransactionHistory';
import AlertModal from './components/AlertModal';
import LoadingOverlay from './components/LoadingOverlay';
import Dashboard from './components/Dashboard';
import { 
  TransactionData, 
  FraudAnalysisResult, 
  TransactionHistoryItem, 
  ApiResponse,
  RiskLevel 
} from './types';

type AppView = 'fraud-detection' | 'dashboard';

const API_BASE_URL = 'http://localhost:5050';

function App(): JSX.Element {
  const [currentView, setCurrentView] = useState<AppView>('fraud-detection');
  const [results, setResults] = useState<FraudAnalysisResult | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertData, setAlertData] = useState<FraudAnalysisResult | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistoryItem[]>([]);

  // Generate random transaction ID
  const generateTransactionId = (): string => {
    const prefix = 'TXN_';
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return prefix + randomNum;
  };

  // View dashboard
  const viewDashboard = (): void => {
    setCurrentView('dashboard');
  };

  // Back to fraud detection
  const backToFraudDetection = (): void => {
    setCurrentView('fraud-detection');
  };

  // Load transaction history
  const loadTransactionHistory = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/fraud-history`);
      
      if (response.ok) {
        const data: ApiResponse<{ transactions: TransactionHistoryItem[] }> = await response.json();
        setTransactionHistory(data.data?.transactions || []);
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
  const getMockTransactionHistory = (): TransactionHistoryItem[] => {
    return [
      {
        id: 'TXN_12345',
        sender_id: 'C1093826151',
        receiver_id: 'M348934600',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        amount: 2500.50,
        transaction_type: 'es_food',
        is_fraud: false,
        risk_level: 'L0',
      },
      {
        id: 'TXN_12344',
        sender_id: 'C2047391825',
        receiver_id: 'M759482016',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        amount: 15000.00,
        transaction_type: 'es_misc_net',
        is_fraud: true,
        risk_level: 'L3',
      },
      {
        id: 'TXN_12343',
        sender_id: 'C8372649103',
        receiver_id: 'M527839461',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        amount: 750.25,
        transaction_type: 'es_grocery_pos',
        is_fraud: false,
        risk_level: 'L0',
      }
    ];
  };

  // Submit transaction to backend
  const submitTransaction = async (data: TransactionData): Promise<ApiResponse<FraudAnalysisResult>> => {
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
  const generateMockResponse = (data: TransactionData): ApiResponse<FraudAnalysisResult> => {
    const fraudProbability = calculateMockFraudProbability(data);
    const isFraud = fraudProbability > 0.5;
    const riskLevel: RiskLevel = fraudProbability > 0.8 ? 'high' : fraudProbability > 0.4 ? 'medium' : 'low';
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
  const calculateMockFraudProbability = (data: TransactionData): number => {
    let score = 0;
    let factors = 0;
    
    // Amount-based risk
    const amount = parseFloat(data.amount.toString());
    factors++;
    if (amount > 10000) score += 0.3;
    else if (amount > 5000) score += 0.2;
    else if (amount > 1000) score += 0.1;
    else score += 0.05;
    
    // Age-based risk
    const age = parseInt(data.age.toString());
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
  const identifyRiskFactors = (data: TransactionData): string[] => {
    const factors: string[] = [];
    
    if (parseFloat(data.amount.toString()) > 5000) {
      factors.push('High value transaction');
    }
    
    if (parseInt(data.age.toString()) < 25) {
      factors.push('Young customer profile');
    } else if (parseInt(data.age.toString()) > 65) {
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
  const handleFormSubmit = async (transactionData: TransactionData): Promise<void> => {
    setLoading(true);
    
    try {
      const response = await submitTransaction(transactionData);
      
      if (response.success && response.data) {
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Error submitting transaction: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // View history
  const handleViewHistory = (): void => {
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
            {/* <button className="btn secondary" onClick={viewDashboard}>
                <i className="fas fa-chart-bar"></i> Dashboard
              </button> */}
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
              <Results data={results} />
            )}

            {/* Transaction History */}
            {showHistory && (
              <TransactionHistory 
                transactions={transactionHistory}
              />
            )}
          </div>

          {/* Loading Overlay */}
          {loading && <LoadingOverlay />}

          {/* Dashboard */}
          <Dashboard 
            onBackToFraudDetection={backToFraudDetection}
          />

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
