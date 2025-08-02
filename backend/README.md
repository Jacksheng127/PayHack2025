# GOSEL Fraud Detection Backend - Refactored

## Architecture Overview

The backend has been refactored into a clean, modular structure with clear separation of concerns:

### 📁 File Structure

```
backend/
├── main.py           # Application entry point - starts the server
├── app.py            # API endpoint interface - handles HTTP requests  
├── db.py             # Database operations and models
├── fraud_model.py    # Fraud detection model logic
├── requirements.txt  # Python dependencies
└── README.md         # This file
```

### 🔧 Core Components

#### 1. **main.py** - Application Entry Point
- Initializes the application and database
- Starts the Flask server
- Handles environment configuration
- **Usage**: `python main.py` to start the backend

#### 2. **app.py** - API Interface
- Clean REST API endpoints
- Request validation and response formatting
- Error handling and logging
- **Main endpoint**: `POST /api/analyze-transaction`

#### 3. **db.py** - Database Layer
- `FraudTransaction` model with simplified schema
- `DatabaseManager` class for all database operations
- Database initialization and configuration
- **Fields**: id, transaction_id, sender, receiver, timestamp, amount, transaction_type + fraud analysis results

#### 4. **fraud_model.py** - Fraud Detection
- `FraudDetectionModel` class
- Supports both ML model and rule-based detection
- Simple feature extraction from basic transaction data
- **Input**: Basic transaction fields only

## 🚀 API Usage

### Transaction Analysis Endpoint

**POST** `/api/analyze-transaction`

**Input Format:**
```json
{
  "transaction_id": "TXN123",
  "sender": "Alice Smith",
  "receiver": "Bob Johnson", 
  "timestamp": "2025-08-02T10:30:00Z",
  "amount": 1500.00,
  "transaction_type": "transfer"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "TXN123",
    "sender": "Alice Smith",
    "receiver": "Bob Johnson",
    "amount": 1500.00,
    "transaction_type": "transfer",
    "timestamp": "2025-08-02T10:30:00Z",
    "analysis": {
      "is_fraud": false,
      "fraud_probability": 0.1234,
      "risk_level": "low",
      "anomaly_score": 15.67
    },
    "status": "approved"
  }
}
```

### Other Endpoints

- `GET /api/transaction-history` - Get transaction history
- `GET /api/fraud-statistics` - Get fraud statistics  
- `GET /api/transaction/<id>` - Get specific transaction
- `GET /api/health` - Health check

## 🔄 Process Flow

1. **Frontend** sends transaction data to `/api/analyze-transaction`
2. **app.py** validates the request and extracts data
3. **fraud_model.py** analyzes the transaction for fraud
4. **db.py** saves both transaction data and fraud analysis results
5. **app.py** returns the analysis results to frontend

## 🎯 Key Improvements

- **Simplified Data Model**: Only essential fields from frontend
- **Clean Separation**: API, database, and model logic are separate
- **Modular Design**: Easy to maintain and extend
- **Clear Interfaces**: Well-defined inputs and outputs
- **Error Handling**: Comprehensive error management
- **Production Ready**: main.py for proper application startup

## 🏃‍♂️ Quick Start

1. Install dependencies: `pip install -r requirements.txt`
2. Set up PostgreSQL database
3. Set environment variables (DATABASE_URL, etc.)
4. Run: `python main.py`
5. API will be available at `http://localhost:5050`

## Quick Setup

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix/MacOS
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables by copying `.env.example` to `.env`:
```bash
cp .env.example .env
```

5. Configure your `.env` file

6. Activate FastAPI backend server:
```bash
python main.py
```