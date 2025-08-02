// Transaction data types
export interface TransactionData {
  transaction_id: string;
  customer: string;
  age: number;
  gender: 'M' | 'F';
  zipcodeOri: string;
  merchant: string;
  zipMerchant: string;
  amount: number;
  category: string;
  timestamp?: string;
}

// Raw form input data (before parsing)
export interface RawTransactionInput {
  transaction_id?: string;
  customer?: string;
  age?: string | number;
  gender?: string;
  zipcodeOri?: string;
  merchant?: string;
  zipMerchant?: string;
  amount?: string | number;
  category?: string;
}

// Fraud analysis results
export interface FraudAnalysisResult {
  transaction_id: string;
  is_fraud: boolean;
  fraud_probability: number;
  risk_level: 'low' | 'medium' | 'high';
  anomaly_score: number;
  risk_factors: string[];
  timestamp?: string;
  traditional_risk_score?: number;
  compliance_status?: string;
  compliance_checks?: Record<string, boolean>;
  processing_time?: number;
}

// API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Transaction history item
export interface TransactionHistoryItem {
  id: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  amount: number;
  transaction_type: string;
  is_fraud: boolean;
  risk_level: 'L0' | 'L1' | 'L2' | 'L3';
}

// Component prop types
export interface TransactionFormProps {
  onSubmit: (data: TransactionData) => void;
  generateTransactionId: () => string;
}

export interface ResultsProps {
  data: FraudAnalysisResult;
}

export interface TransactionHistoryProps {
  transactions: TransactionHistoryItem[];
}

export interface AlertModalProps {
  data: FraudAnalysisResult;
  onClose: () => void;
}

export interface LoadingOverlayProps {
  // No props needed for loading overlay
}

// Transaction categories
export type TransactionCategory = 
  | 'es_transportation'
  | 'es_food'
  | 'es_grocery_pos'
  | 'es_gas'
  | 'es_entertainment'
  | 'es_health'
  | 'es_home'
  | 'es_misc_net'
  | 'es_misc_pos'
  | 'es_travel'
  | 'es_wellnessandbeauty'
  | 'es_fashion'
  | 'es_contents'
  | 'es_hotelservices'
  | 'es_hyper'
  | 'es_leisure'
  | 'es_otherservices'
  | 'es_sportsandtoys'
  | 'es_tech';

// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high';

// Gender types
export type Gender = 'M' | 'F';
