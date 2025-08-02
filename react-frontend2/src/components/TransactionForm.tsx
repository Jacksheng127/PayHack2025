import React, { useState } from 'react';
import { TransactionFormProps, TransactionData, RawTransactionInput } from '../types';

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, generateTransactionId }) => {
  const [rawData, setRawData] = useState<string>('');
  const [parseError, setParseError] = useState<string>('');

  const parseInputData = (input: string): string | null => {
    try {
      setParseError('');
      
      const cleanInput = input.trim();
      if (!cleanInput) {
        throw new Error('Please enter some data');
      }

      // Check if input contains semicolons (multiple transactions)
      if (cleanInput.includes(';')) {
        // Handle multiple transactions - pass the input as is since it's already in the correct format
        // The backend parse_and_process_data function expects: id,sender,receiver,timestamp,amount,type,ofi_type,rfi_type
        return cleanInput;
      }

      // Handle single transaction - split by comma
      const dataArray = cleanInput.split(',').map(item => item.trim()).filter(item => item.length > 0);

      if (dataArray.length === 0) {
        throw new Error('No valid data found');
      }

      // For single transaction, convert to the model's expected format
      // If the input is already in the correct format (8 fields), use it as is
      if (dataArray.length >= 8) {
        // Input is already in correct format: id,sender,receiver,timestamp,amount,type,ofi_type,rfi_type
        return cleanInput;
      }

      // Otherwise, convert from old format to new format
      // Expected frontend order: [transaction_id, customer, age, gender, zipcodeOri, merchant, zipMerchant, amount, category]
      // Model expects: id,sender,receiver,timestamp,amount,type,ofi_type,rfi_type
      
      const transaction_id = dataArray[0] || generateTransactionId();
      const sender = dataArray[1] || `C${Math.random().toString().substr(2, 10)}`;
      const receiver = dataArray[5] || `M${Math.random().toString().substr(2, 10)}`;
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const amount = parseFloat(dataArray[7]) || 100.00;
      const type = dataArray[8] || 'transfer';
      const ofi_type = 'personal'; // Default for now
      const rfi_type = 'business'; // Default for now

      // Validation
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount provided');
      }

      // Format as model expects: id,sender,receiver,timestamp,amount,type,ofi_type,rfi_type
      const modelFormatData = `${transaction_id},${sender},${receiver},${timestamp},${amount},${type},${ofi_type},${rfi_type}`;
      
      return modelFormatData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setParseError(errorMessage);
      return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setRawData(e.target.value);
    setParseError(''); // Clear error when user starts typing
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const modelFormatData = parseInputData(rawData);
    if (modelFormatData) {
      // Pass the raw data string to the parent component
      // The parent will handle the API call to the batch endpoint
      onSubmit({ raw_data: modelFormatData } as any);
    }
  };

  const clearForm = (): void => {
    setRawData('');
    setParseError('');
  };

  // Generate sample data for user reference
  const generateSampleData = (): void => {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const sampleData = [
      'TXN_12345',           // transaction_id
      'C1093826151',         // sender (customer)
      'M348934600',          // receiver (merchant)
      timestamp,             // timestamp
      '156.50',              // amount
      'transfer',            // transaction type
      'personal',            // sender type (ofi_type)
      'business'             // receiver type (rfi_type)
    ].join(',');
    
    setRawData(sampleData);
    setParseError('');
  };

  return (
    <div className="demo-section">
      <div className="section-header">
        <h2><i className="fas fa-input"></i> Data Input</h2>
        <p>Enter transaction data separated by semicolons (;), commas (,), or new lines</p>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="raw-data">Transaction Data</label>
          <textarea 
            id="raw-data"
            name="rawData"
            value={rawData}
            onChange={handleInputChange}
            placeholder="Enter data in this order: transaction_id,sender,receiver,timestamp,amount,type,sender_type,receiver_type&#10;&#10;Example:&#10;TXN_12345,C1093826151,M348934600,2025-08-03 00:54:15,156.50,transfer,personal,business&#10;&#10;Multiple transactions separated by semicolons (;)..."
            rows={6}
            style={{ 
              width: '100%', 
              minHeight: '120px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}
            required 
          />
          {parseError && (
            <div style={{ 
              color: '#ea4335', 
              fontSize: '14px', 
              marginTop: '8px',
              padding: '12px',
              backgroundColor: 'rgba(234, 67, 53, 0.1)',
              border: '1px solid rgba(234, 67, 53, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-exclamation-triangle"></i> {parseError}
            </div>
          )}
        </div>

        {/* Data Format Help */}
        <div className="data-format-help" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#4285f4', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-info-circle"></i> Data Format Guide
          </h4>
          <p style={{ margin: '0 0 8px 0', color: 'rgba(255, 255, 255, 0.7)' }}>
            <strong>Expected order:</strong> transaction_id, sender, receiver, timestamp, amount, type, sender_type, receiver_type
          </p>
          <p style={{ margin: '0', color: 'rgba(255, 255, 255, 0.7)' }}>
            <strong>Format:</strong> Use comma (,) to separate fields, semicolon (;) to separate multiple transactions
          </p>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn sample" 
            onClick={generateSampleData}
            style={{ width: '100%', marginBottom: '12px' }}
          >
            <i className="fas fa-magic"></i> Generate Sample Data
          </button>
          
          <button type="submit" className="btn primary" disabled={!rawData.trim()}>
            <i className="fas fa-paper-plane"></i> Analyze Transaction
          </button>
          
          <button 
            type="button" 
            className="btn outline" 
            onClick={clearForm}
            style={{ marginTop: '10px', width: '100%' }}
          >
            <i className="fas fa-refresh"></i> Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
