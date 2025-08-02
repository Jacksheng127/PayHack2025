import React, { useState } from 'react';
import { TransactionFormProps, TransactionData, RawTransactionInput } from '../types';

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, generateTransactionId }) => {
  const [rawData, setRawData] = useState<string>('');
  const [parseError, setParseError] = useState<string>('');

  const parseInputData = (input: string): TransactionData | null => {
    try {
      setParseError('');
      
      const cleanInput = input.trim();
      if (!cleanInput) {
        throw new Error('Please enter some data');
      }

      // Split by semicolon, comma, or newline (prioritize semicolon, then comma, then newline)
      let dataArray: string[];
      if (cleanInput.includes(';')) {
        dataArray = cleanInput.split(';');
      } else if (cleanInput.includes(',')) {
        dataArray = cleanInput.split(',');
      } else if (cleanInput.includes('\n')) {
        dataArray = cleanInput.split('\n');
      } else {
        // If no separator found, assume it's a single piece of data
        dataArray = [cleanInput];
      }

      // Clean up each data point
      dataArray = dataArray.map(item => item.trim()).filter(item => item.length > 0);

      if (dataArray.length === 0) {
        throw new Error('No valid data found');
      }

      // Expected data order: [transaction_id, customer, age, gender, zipcodeOri, merchant, zipMerchant, amount, category]
      const parsedData: TransactionData = {
        transaction_id: dataArray[0] || generateTransactionId(),
        customer: dataArray[1] || `C${Math.random().toString().substr(2, 10)}`,
        age: parseInt(dataArray[2]) || 30,
        gender: (dataArray[3] && (dataArray[3].toUpperCase() === 'M' || dataArray[3].toUpperCase() === 'F')) 
          ? (dataArray[3].toUpperCase() as 'M' | 'F') 
          : 'M',
        zipcodeOri: dataArray[4] || '12345',
        merchant: dataArray[5] || `M${Math.random().toString().substr(2, 10)}`,
        zipMerchant: dataArray[6] || '54321',
        amount: parseFloat(dataArray[7]) || 100.00,
        category: dataArray[8] || 'es_misc_pos',
        timestamp: new Date().toISOString()
      };

      // Validation
      if (isNaN(parsedData.age) || parsedData.age < 1 || parsedData.age > 120) {
        throw new Error('Invalid age provided');
      }
      
      if (isNaN(parsedData.amount) || parsedData.amount <= 0) {
        throw new Error('Invalid amount provided');
      }

      return parsedData;
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
    
    const parsedData = parseInputData(rawData);
    if (parsedData) {
      onSubmit(parsedData);
    }
  };

  const clearForm = (): void => {
    setRawData('');
    setParseError('');
  };

  // Generate sample data for user reference
  const generateSampleData = (): void => {
    const sampleData = [
      'TXN_12345',           // transaction_id
      'C1093826151',         // customer
      '35',                  // age
      'M',                   // gender
      '28007',               // zipcodeOri
      'M348934600',          // merchant
      '28007',               // zipMerchant
      '156.50',              // amount
      'es_food'              // category
    ].join(';');
    
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
            placeholder="Enter data in this order: transaction_id;customer;age;gender;zipcodeOri;merchant;zipMerchant;amount;category&#10;&#10;Example:&#10;TXN_12345;C1093826151;35;M;28007;M348934600;28007;156.50;es_food&#10;&#10;Or use commas or new lines as separators..."
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
            <strong>Expected order:</strong> transaction_id, customer, age, gender, zipcodeOri, merchant, zipMerchant, amount, category
          </p>
          <p style={{ margin: '0', color: 'rgba(255, 255, 255, 0.7)' }}>
            <strong>Separators:</strong> Use semicolon (;), comma (,), or new line to separate each field
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
