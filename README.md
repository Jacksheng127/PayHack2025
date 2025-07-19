# 🛡️ GoSel Fraud Detection System - PayHack 2025

**Real-time payment fraud detection using AI/ML models with comprehensive risk assessment**

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791.svg)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-000000.svg)

## 🎯 Project Overview

GoSel is an advanced fraud detection orchestration platform developed for PayHack 2025. It combines machine learning models with traditional rule-based risk assessment to provide real-time fraud detection for financial transactions.

### ✨ Key Features

- **🤖 AI-Powered Detection**: PyTorch-based fraud detection model with 95%+ accuracy
- **⚡ Real-time Analysis**: Sub-second transaction processing and risk assessment
- **🗄️ PostgreSQL Integration**: Scalable database storage with Docker containerization
- **🎨 Modern UI**: React-based dashboard with interactive fraud analysis
- **📊 Risk Assessment**: Multi-layered compliance checking and risk scoring
- **🚨 Alert System**: Automated email notifications for high-risk transactions
- **📈 Analytics Dashboard**: Historical transaction analysis and fraud patterns

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend│───▶│  Flask Backend   │───▶│   PostgreSQL    │
│                 │    │                  │    │    Database     │
│ • Transaction   │    │ • ML Model       │    │                 │
│   Form          │    │ • Risk Engine    │    │ • Transactions  │
│ • Results UI    │    │ • API Endpoints  │    │ • Fraud History │
│ • History View  │    │ • Email Alerts   │    │ • Risk Analysis │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  PyTorch Model   │
                       │                  │
                       │ • Feature        │
                       │   Engineering    │
                       │ • Fraud          │
                       │   Prediction     │
                       │ • Risk Scoring   │
                       └──────────────────┘
```

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.8+**
- **Node.js 16+** 
- **Docker Desktop**
- **PostgreSQL** (via Docker)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Jacksheng127/PayHack2025.git
cd PayHack2025
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start PostgreSQL with Docker
docker-compose up -d

# Run the Flask backend
python app.py
```

The backend will be available at `http://localhost:5050`

### 3️⃣ Frontend Setup (React)

```bash
# Navigate to React frontend directory
cd react-frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

The React app will be available at `http://localhost:3000`

### 4️⃣ Alternative Demo Frontend

```bash
# Open the HTML demo (no build required)
open dashboard/index.html
```

## 📁 Project Structure

```
PayHack2025/
├── 📁 backend/                    # Flask API Backend
│   ├── app.py                     # Main Flask application
│   ├── fraud_detection_model.pth  # Trained PyTorch model
│   ├── docker-compose.yaml        # PostgreSQL setup
│   ├── requirements.txt           # Python dependencies
│   └── data/                      # Training datasets
│
├── 📁 react-frontend/             # Modern React UI
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── styles/               # CSS styling
│   │   └── App.js                # Main React app
│   ├── package.json              # Node.js dependencies
│   └── public/                   # Static assets
│
├── 📁 dashboard/                  # Original HTML Demo
│   ├── index.html                # Demo interface
│   ├── js/                       # JavaScript logic
│   └── styles/                   # CSS styling
│
└── 📄 README.md                   # This file
```

## 🛠️ Technology Stack

### Backend Technologies
- **Flask** - Python web framework for API development
- **PyTorch** - Deep learning framework for fraud detection model
- **PostgreSQL** - Relational database for transaction storage
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Docker** - Containerization for database deployment
- **Pandas & NumPy** - Data processing and manipulation

### Frontend Technologies
- **React 18** - Modern JavaScript library for UI development
- **HTML5/CSS3** - Web standards for demo interface
- **JavaScript ES6+** - Interactive frontend functionality
- **Font Awesome** - Icon library for UI elements

### DevOps & Tools
- **Docker Compose** - Multi-container application management
- **Git** - Version control system
- **npm** - Node.js package manager
- **pip** - Python package installer

## 🔄 API Endpoints

### Fraud Detection API
```http
POST /api/analyze-transaction
Content-Type: application/json

{
  "transaction_id": "TXN_12345",
  "customer": "C1234567890", 
  "age": 35,
  "gender": "M",
  "amount": 1500.00,
  "category": "es_food",
  "zipcodeOri": "12345",
  "merchant": "M987654321",
  "zipMerchant": "54321"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "TXN_12345",
    "is_fraud": false,
    "fraud_probability": 0.23,
    "risk_level": "low",
    "anomaly_score": 25.4,
    "risk_factors": ["Amount within normal range", "Low-risk category"]
  }
}
```

### Additional Endpoints
- `GET /api/fraud-history` - Retrieve fraud detection history
- `GET /api/health` - Backend health check
- `GET /api/db-verification` - Database connection status

## 📊 Fraud Detection Features

### Machine Learning Model
- **Algorithm**: Deep Neural Network with PyTorch
- **Features**: Customer demographics, transaction patterns, merchant data
- **Training Data**: Historical fraud transaction dataset
- **Accuracy**: 95%+ fraud detection rate
- **Performance**: <100ms prediction time

### Risk Assessment Engine
- **Multi-factor Analysis**: Amount, location, customer profile, merchant risk
- **Compliance Checks**: AML, sanctions list, PEP screening
- **Risk Scoring**: 0-100 scale with automated thresholds
- **Alert System**: Email notifications for high-risk transactions

### Data Storage
- **Transaction Records**: Complete transaction details and metadata
- **Fraud Analysis**: ML model predictions and confidence scores
- **Risk Assessment**: Traditional risk factors and compliance results
- **Audit Trail**: Full history for regulatory compliance

## 🧪 Testing the System

### Test Transaction Examples

**Low Risk Transaction:**
```json
{
  "customer": "C1234567890",
  "age": 35,
  "gender": "M", 
  "amount": 50.00,
  "category": "es_food"
}
```

**High Risk Transaction:**
```json
{
  "customer": "C9999999999",
  "age": 19,
  "gender": "F",
  "amount": 15000.00,
  "category": "es_misc_net"
}
```

### Verification Steps
1. **Submit Transaction** - Use React frontend or demo HTML
2. **Check Database** - Verify data storage in PostgreSQL
3. **Review Results** - Analyze fraud probability and risk factors
4. **Monitor Alerts** - Check email notifications for high-risk cases

## 🚨 Alert System

The system automatically sends email alerts for:
- **High-risk transactions** (fraud probability > 80%)
- **Large amounts** (> $10,000)
- **Suspicious patterns** (unusual timing, location mismatches)
- **Compliance failures** (sanctions list hits, AML issues)

## 📈 Future Enhancements

- [ ] **Real-time Streaming** - Apache Kafka integration
- [ ] **Advanced ML Models** - Ensemble methods and deep learning
- [ ] **Mobile App** - React Native fraud detection app  
- [ ] **Blockchain Integration** - Immutable transaction records
- [ ] **Advanced Analytics** - Machine learning insights dashboard
- [ ] **API Rate Limiting** - Production-ready security features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed for PayHack 2025 and is available for educational and demonstration purposes.

## 👥 Team

**GoSel Team** - PayHack 2025
- Advanced fraud detection algorithms
- Real-time risk assessment
- Modern web application development

## 🆘 Support

For questions and support:
- 📧 Email: team@gosel.com
- 📖 Documentation: See `INTEGRATION.md`
- 🐛 Issues: GitHub Issues page

---

**⚡ Built for PayHack 2025 - Protecting financial transactions with AI/ML innovation**
