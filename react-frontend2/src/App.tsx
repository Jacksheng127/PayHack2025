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
        sender_type: 'Personal',
        receiver_type: 'Business',
        is_fraud: false,
        risk_level: 'L1',
      },
    //   {
    //     id: 'TXN_12344',
    //     sender_id: 'C2047391825',
    //     receiver_id: 'M759482016',
    //     timestamp: new Date(Date.now() - 7200000).toISOString(),
    //     amount: 15000.00,
    //     transaction_type: 'es_misc_net',
    //     sender_type: 'Personal',
    //     receiver_type: 'Unknown',
    //     is_fraud: true,
    //     risk_level: 'L3',
    //   },
    //   {
    //     id: 'TXN_12343',
    //     sender_id: 'C8372649103',
    //     receiver_id: 'M527839461',
    //     timestamp: new Date(Date.now() - 10800000).toISOString(),
    //     amount: 750.25,
    //     transaction_type: 'es_grocery_pos',
    //     sender_type: 'Personal',
    //     receiver_type: 'Business',
    //     is_fraud: false,
    //     risk_level: 'L0',
    //   }
    ];
  };

  // Submit transaction to backend
  const submitTransaction = async (data: any): Promise<ApiResponse<any>> => {
    try {
      // Check if this is raw data format
      if (data.raw_data) {
        const response = await fetch(`${API_BASE_URL}/api/analyze-transactions-batch`, {
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
      } else {
        // Original single transaction format
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
      }
    } catch (error) {
      console.error('API Error:', error);
      // For demo purposes, return mock data if API is not available
      if (data.raw_data) {
        return generateMockBatchResponse(data.raw_data);
      } else {
        return generateMockResponse(data);
      }
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

  // Generate mock batch response for demo purposes
  const generateMockBatchResponse = (rawData: string): ApiResponse<any> => {
    const transactions = rawData.split(';').map((txData, index) => {
      const fields = txData.split(',');
      const amount = parseFloat(fields[4]) || 100;
      const riskScore = Math.random() * 0.8; // Random risk score for demo
      
      return {
        transaction_id: fields[0] || `TXN_${index}`,
        sender: fields[1] || 'Unknown',
        receiver: fields[2] || 'Unknown',
        amount: amount,
        transaction_type: fields[5] || 'transfer',
        timestamp: new Date().toISOString(),
        sender_type: fields[6] || 'personal',
        receiver_type: fields[7] || 'business',
        analysis: {
          is_fraud: riskScore > 0.5,
          fraud_probability: riskScore,
          risk_level: riskScore < 0.25 ? 'L0' : riskScore < 0.5 ? 'L1' : riskScore < 0.75 ? 'L2' : 'L3',
          anomaly_score: riskScore * 100
        },
        status: riskScore > 0.5 ? 'blocked' : 'approved',
        risk_score: riskScore
      };
    });

    return {
      success: true,
      data: {
        transactions: transactions,
        count: transactions.length,
        summary: {
          total_transactions: transactions.length,
          high_risk_count: transactions.filter(t => t.analysis.risk_level === 'L2' || t.analysis.risk_level === 'L3').length,
          fraud_count: transactions.filter(t => t.analysis.is_fraud).length,
          average_risk_score: transactions.reduce((sum, t) => sum + t.risk_score, 0) / transactions.length
        }
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
    
    // Transaction type risk
    factors++;
    const highRiskTypes = ['wire', 'international', 'crypto'];
    if (highRiskTypes.includes(data.transaction_type)) {
      score += 0.25;
    } else {
      score += 0.05;
    }
    
    // Entity type risk
    factors++;
    if (data.sender_type === 'business' && data.receiver_type === 'business') {
      score += 0.1; // Business to business
    } else if (data.sender_type === 'personal' && data.receiver_type === 'business') {
      score += 0.15; // Personal to business
    } else {
      score += 0.05; // Personal to personal
    }
    
    // Time-based risk (if timestamp is recent)
    factors++;
    const transactionTime = new Date(data.timestamp);
    const now = new Date();
    const timeDiff = now.getTime() - transactionTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 1) {
      score += 0.1; // Very recent transaction
    } else if (hoursDiff < 24) {
      score += 0.05; // Recent transaction
    } else {
      score += 0.02; // Older transaction
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
    
    const highRiskTypes = ['wire', 'international', 'crypto'];
    if (highRiskTypes.includes(data.transaction_type)) {
      factors.push('High risk transaction type');
    }

    if (data.sender_type === 'personal' && data.receiver_type === 'business') {
      factors.push('Personal to business transaction');
    }
    
    // Time-based risk
    const transactionTime = new Date(data.timestamp);
    const now = new Date();
    const timeDiff = now.getTime() - transactionTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 1) {
      factors.push('Very recent transaction');
    } else if (hoursDiff < 24) {
      factors.push('Recent transaction');
    }
    
    if (Math.random() > 0.7) {
      factors.push('Unusual transaction timing');
    }
    
    return factors;
  };

  // Handle form submission
  const handleFormSubmit = async (transactionData: any): Promise<void> => {
    setLoading(true);
    
    try {
      const response = await submitTransaction(transactionData);
      
      if (response.success && response.data) {
        console.log('Transaction analysis result:', response.data);
        // Check if this is a batch response or single transaction
        if (response.data.transactions) {
          // Batch response - handle multiple transactions
          const batchData = response.data;
          console.log(`Processed ${batchData.count} transactions`);
          
          // For demo, show the first transaction result
          if (batchData.transactions.length > 0) {
            const firstTransaction = batchData.transactions[0];
            const singleResult: FraudAnalysisResult = {
              transaction_id: firstTransaction.transaction_id,
              is_fraud: firstTransaction.analysis.is_fraud,
              fraud_probability: firstTransaction.analysis.fraud_probability,
              risk_level: firstTransaction.analysis.risk_level as RiskLevel,
              anomaly_score: firstTransaction.analysis.anomaly_score,
              risk_factors: [`Risk Score: ${firstTransaction.risk_score.toFixed(4)}`],
              timestamp: firstTransaction.timestamp
            };
            
            setResults(singleResult);
            setShowResults(true);
            
            // Show alert modal if fraud is detected
            if (firstTransaction.analysis.is_fraud || firstTransaction.analysis.risk_level === 'L3') {
              setAlertData(singleResult);
              setShowAlert(true);
            }
          }
          
          // Update transaction history with batch results
          const historyItems: TransactionHistoryItem[] = batchData.transactions.map((tx: any) => ({
            id: tx.transaction_id,
            sender_id: tx.sender,
            receiver_id: tx.receiver,
            timestamp: tx.timestamp,
            amount: tx.amount,
            transaction_type: tx.transaction_type,
            sender_type: tx.sender_type,
            receiver_type: tx.receiver_type,
            is_fraud: tx.analysis.is_fraud,
            risk_level: tx.analysis.risk_level
          }));
          
          setTransactionHistory(prev => [...historyItems, ...prev]);
          
        } else {
          // Single transaction response
          setResults(response.data);
          setShowResults(true);
          
          // Show alert modal if fraud is detected
          if (response.data.is_fraud || response.data.risk_level === 'high') {
            setAlertData(response.data);
            setShowAlert(true);
          }
          
          // Refresh history
          loadTransactionHistory();
        }
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

  const resetDatabase = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to reset the database? This will delete all transaction history.')) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/reset-database`, {
          method: 'POST',
        });
        
        if (response.ok) {
          alert('Database reset successfully.');
          setTransactionHistory([]);
          setResults(null);
          setShowResults(false);
          setShowHistory(false);
        } else {
          alert('Failed to reset database: ' + response.statusText);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert('Error resetting database: ' + errorMessage);
      } finally {
        setLoading(false);
      }
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
            <button className="btn secondary" onClick={resetDatabase}>
                <i className="fas fa-database"></i> Reset
              </button>
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
            {/* {showResults && results && (
              <Results data={results} />
            )} */}

            {/* Transaction History */}
            <TransactionHistory 
                transactions={transactionHistory}
            />
          </div>

          {/* Loading Overlay */}
          {loading && <LoadingOverlay />}

          {/* Dashboard */}
          <Dashboard 
            onBackToFraudDetection={backToFraudDetection}
            newTransaction={results ? {
              id: results.transaction_id,
              customer: results.transaction_id.split('_')[1] || 'Unknown', // Extract from ID or use placeholder
              merchant: 'Merchant_' + results.transaction_id.split('_')[1] || 'Unknown', // Generate merchant name
              amount: 1000, // Default amount since it's not stored in results
              category: 'transfer', // Default category
              isFraud: results.is_fraud,
              riskLevel: results.risk_level
            } : null}
            allTransactions={transactionHistory.length > 0 ? transactionHistory.map(tx => ({
              id: tx.id,
              customer: tx.sender_id,
              merchant: tx.receiver_id,
              amount: Number(tx.amount),
              category: tx.transaction_type || 'transfer',
              isFraud: tx.is_fraud,
              riskLevel: tx.risk_level || 'low'
            })) : []}
            onTransactionAdded={() => {
              console.log('🔄 Transaction added to graph, clearing results');
              // Clear the results after transaction is added to graph
              setResults(null);
              setShowResults(false);
            }}
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
