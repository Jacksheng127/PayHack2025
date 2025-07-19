# Fraud Detection React Frontend

This is a React-based frontend for the GoSel fraud detection system, converted from the original HTML/JavaScript/CSS demo while maintaining the same design and functionality.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd react-frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Backend Requirements

Make sure the Flask backend is running on port 5050:
```bash
cd ../backend
python app.py
```

## Features

- **Transaction Form**: Input transaction details for fraud analysis
- **Real-time Results**: Display fraud probability, risk level, and analysis metrics
- **Transaction History**: View and filter previous transactions
- **Alert Modal**: Automatic alerts for high-risk transactions
- **Loading States**: Visual feedback during analysis

## Components Structure

- `App.js` - Main application component with state management
- `TransactionForm.js` - Form component for transaction input
- `Results.js` - Display fraud detection results
- `TransactionHistory.js` - List and filter transaction history
- `AlertModal.js` - Modal for high-risk transaction alerts
- `LoadingOverlay.js` - Loading spinner during analysis

## Styling

The CSS has been preserved from the original demo to maintain the exact same visual design and layout. All styles are contained in `src/styles/App.css`.

## API Integration

The frontend connects to the Flask backend at `http://localhost:5050` and uses the following endpoints:
- `POST /analyze_transaction` - Submit transaction for fraud analysis
- `GET /fraud-history` - Retrieve transaction history
