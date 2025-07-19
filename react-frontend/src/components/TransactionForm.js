import React, { useState, useEffect } from 'react';

const TransactionForm = ({ onSubmit, generateTransactionId }) => {
  const [formData, setFormData] = useState({
    transaction_id: '',
    customer: '',
    age: '',
    gender: '',
    zipcodeOri: '',
    merchant: '',
    zipMerchant: '',
    amount: '',
    category: ''
  });

  // Initialize transaction ID on component mount
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      transaction_id: generateTransactionId()
    }));
  }, [generateTransactionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numeric fields
    const processedData = {
      ...formData,
      amount: parseFloat(formData.amount),
      age: parseInt(formData.age),
      timestamp: new Date().toISOString()
    };
    
    onSubmit(processedData);
  };

  const clearForm = () => {
    setFormData({
      transaction_id: generateTransactionId(),
      customer: '',
      age: '',
      gender: '',
      zipcodeOri: '',
      merchant: '',
      zipMerchant: '',
      amount: '',
      category: ''
    });
  };

  return (
    <div className="demo-section">
      <div className="section-header">
        <h2><i className="fas fa-input"></i> Transaction Input</h2>
        <p>Enter transaction details to test the GOSEL risk assessment model</p>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-grid">
          {/* Transaction ID */}
          <div className="form-group">
            <label htmlFor="transaction-id">Transaction ID</label>
            <input 
              type="text" 
              id="transaction-id" 
              name="transaction_id" 
              value={formData.transaction_id}
              onChange={handleInputChange}
              placeholder="TXN_001" 
              required 
            />
          </div>

          {/* Customer Information */}
          <div className="form-group">
            <label htmlFor="customer">Customer ID</label>
            <input 
              type="text" 
              id="customer" 
              name="customer" 
              value={formData.customer}
              onChange={handleInputChange}
              placeholder="C1093826151" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Customer Age</label>
            <input 
              type="number" 
              id="age" 
              name="age" 
              value={formData.age}
              onChange={handleInputChange}
              placeholder="25" 
              min="18" 
              max="100" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Customer Gender</label>
            <select 
              id="gender" 
              name="gender" 
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="zipcode-ori">Customer Zipcode</label>
            <input 
              type="text" 
              id="zipcode-ori" 
              name="zipcodeOri" 
              value={formData.zipcodeOri}
              onChange={handleInputChange}
              placeholder="28007" 
              required 
            />
          </div>

          {/* Merchant Information */}
          <div className="form-group">
            <label htmlFor="merchant">Merchant ID</label>
            <input 
              type="text" 
              id="merchant" 
              name="merchant" 
              value={formData.merchant}
              onChange={handleInputChange}
              placeholder="M348934600" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="zip-merchant">Merchant Zipcode</label>
            <input 
              type="text" 
              id="zip-merchant" 
              name="zipMerchant" 
              value={formData.zipMerchant}
              onChange={handleInputChange}
              placeholder="28007" 
              required 
            />
          </div>

          {/* Transaction Details */}
          <div className="form-group">
            <label htmlFor="amount">Transaction Amount</label>
            <input 
              type="number" 
              id="amount" 
              name="amount" 
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="156.50" 
              min="0.01" 
              step="0.01" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Transaction Category</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="es_transportation">Transportation</option>
              <option value="es_food_dining">Food & Dining</option>
              <option value="es_grocery_pos">Grocery</option>
              <option value="es_gas_transport">Gas & Transport</option>
              <option value="es_entertainment">Entertainment</option>
              <option value="es_health_fitness">Health & Fitness</option>
              <option value="es_home">Home & Garden</option>
              <option value="es_kids_pets">Kids & Pets</option>
              <option value="es_misc_net">Miscellaneous Online</option>
              <option value="es_misc_pos">Miscellaneous POS</option>
              <option value="es_personal_care">Personal Care</option>
              <option value="es_shopping_net">Online Shopping</option>
              <option value="es_shopping_pos">In-store Shopping</option>
              <option value="es_travel">Travel</option>
              <option value="es_wellnessspas">Wellness & Spas</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="btn primary">
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
