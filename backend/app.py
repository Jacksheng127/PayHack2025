# GOSEL Demo Backend API
# Flask server with PostgreSQL integration and fraud detection model

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import smtplib
import json
import random
import torch
import numpy as np
import pandas as pd
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

app = Flask(__name__)
CORS(app)

# Database configuration - Updated to use docker-compose settings
DATABASE_URL = os.environ.get(
    'DATABASE_URL', 'postgresql://db_user:db_password@localhost:5432/db')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email configuration
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USER = os.environ.get('EMAIL_USER', 'alerts@gosel.com')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', 'your-app-password')
ALERT_RECIPIENTS = os.environ.get(
    'ALERT_RECIPIENTS', 'compliance@gosel.com,risk@gosel.com').split(',')

db = SQLAlchemy(app)

# Database Models for Fraud Detection


class FraudTransaction(db.Model):
    __tablename__ = 'fraud_transactions'

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(50), unique=True, nullable=False)
    customer = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(1), nullable=False)  # M/F
    zipcode_ori = db.Column(db.String(10), nullable=False)
    merchant = db.Column(db.String(100), nullable=False)
    zip_merchant = db.Column(db.String(10), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)

    # Model predictions
    is_fraud = db.Column(db.Boolean, nullable=False)
    fraud_probability = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(10), nullable=False)  # low, medium, high
    anomaly_score = db.Column(db.Float)

    # Metadata
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(50), unique=True, nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    currency_from = db.Column(db.String(3), nullable=False)
    currency_to = db.Column(db.String(3), nullable=False)
    sender_name = db.Column(db.String(100), nullable=False)
    sender_country = db.Column(db.String(2), nullable=False)
    sender_id = db.Column(db.String(50), nullable=False)
    sender_account = db.Column(db.String(50), nullable=False)
    receiver_name = db.Column(db.String(100), nullable=False)
    receiver_country = db.Column(db.String(2), nullable=False)
    receiver_id = db.Column(db.String(50), nullable=False)
    receiver_account = db.Column(db.String(50), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    purpose = db.Column(db.Text, nullable=False)
    ip_address = db.Column(db.String(45))
    risk_factors = db.Column(db.Text)  # JSON string
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class TransactionAnalysis(db.Model):
    __tablename__ = 'transaction_analysis'

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(50), db.ForeignKey(
        'transactions.transaction_id'), nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)
    risk_level = db.Column(db.String(10), nullable=False)  # low, medium, high
    # approved, flagged, blocked
    status = db.Column(db.String(20), nullable=False)
    compliance_checks = db.Column(db.Text)  # JSON string
    risk_factors_identified = db.Column(db.Text)  # JSON string
    recommendation = db.Column(db.Text)
    processing_time = db.Column(db.Float)
    alert_sent = db.Column(db.Boolean, default=False)
    model_version = db.Column(db.String(20), default='1.0')
    analyzed_at = db.Column(db.DateTime, default=datetime.utcnow)


# Fraud Detection Model Integration
class FraudDetectionModel:
    def __init__(self, model_path='fraud_detection_model.pth'):
        self.model_path = model_path
        self.model = None
        self.device = torch.device(
            'cuda' if torch.cuda.is_available() else 'cpu')
        self.load_model()

        # Category mapping for encoding
        self.category_mapping = {
            'es_barsandrestaurants': 0, 'es_contents': 1, 'es_fashion': 2,
            'es_food': 3, 'es_gas': 4, 'es_health': 5, 'es_home': 6,
            'es_hotelservices': 7, 'es_hyper': 8, 'es_leisure': 9,
            'es_otherservices': 10, 'es_sportsandtoys': 11, 'es_tech': 12,
            'es_transportation': 13, 'es_travel': 14, 'es_wellnessandbeauty': 15,
            'es_entertainment': 16, 'es_misc_net': 17, 'es_misc_pos': 18
        }

    def load_model(self):
        """Load the PyTorch model"""
        try:
            if os.path.exists(self.model_path):
                self.model = torch.load(
                    self.model_path, map_location=self.device)
                self.model.eval()
                print(
                    f"Fraud detection model loaded successfully from {self.model_path}")
            else:
                print(
                    f"Model file not found at {self.model_path}, using rule-based approach")
                self.model = None
        except Exception as e:
            print(
                f"Error loading model: {str(e)}, falling back to rule-based approach")
            self.model = None

    def preprocess_data(self, transaction_data):
        """Preprocess transaction data for model input"""
        try:
            # Extract features in the order expected by the model
            features = []

            # Customer age
            features.append(float(transaction_data.get('age', 30)))

            # Amount
            features.append(float(transaction_data.get('amount', 0)))

            # Gender encoding (M=1, F=0)
            gender = transaction_data.get('gender', 'M')
            features.append(1.0 if gender == 'M' else 0.0)

            # Zipcode distance (simplified calculation)
            zip_ori = transaction_data.get('zipcodeOri', '00000')
            zip_merchant = transaction_data.get('zipMerchant', '00000')
            # Simple distance approximation based on zipcode difference
            try:
                zip_distance = abs(int(zip_ori) - int(zip_merchant))
                # Cap at reasonable max
                features.append(float(min(zip_distance, 99999)))
            except (ValueError, TypeError):
                features.append(0.0)

            # Category encoding
            category = transaction_data.get('category', 'es_misc_pos')
            category_encoded = self.category_mapping.get(
                category, 17)  # Default to es_misc_pos
            features.append(float(category_encoded))

            return np.array(features, dtype=np.float32)

        except Exception as e:
            print(f"Error in preprocessing: {str(e)}")
            # Return default safe values
            return np.array([30.0, 100.0, 1.0, 0.0, 17.0], dtype=np.float32)

    def predict(self, transaction_data):
        """Make fraud prediction"""
        try:
            if self.model is not None:
                # Use actual PyTorch model
                features = self.preprocess_data(transaction_data)

                # Convert to tensor and add batch dimension
                input_tensor = torch.tensor(
                    features).unsqueeze(0).to(self.device)

                with torch.no_grad():
                    prediction = self.model(input_tensor)

                    # Handle different model output formats
                    if isinstance(prediction, torch.Tensor):
                        # Binary classification with 2 outputs
                        if prediction.shape[-1] == 2:
                            fraud_prob = torch.softmax(
                                prediction, dim=-1)[0][1].item()
                        else:  # Single output (probability or logit)
                            fraud_prob = torch.sigmoid(prediction[0]).item()
                    else:
                        fraud_prob = 0.5  # Default

                is_fraud = fraud_prob > 0.5
                anomaly_score = fraud_prob * 100

            else:
                # Fallback to rule-based approach
                prediction_result = self._rule_based_prediction(
                    transaction_data)
                fraud_prob = prediction_result['fraud_probability']
                is_fraud = prediction_result['is_fraud']
                anomaly_score = prediction_result['anomaly_score']

            # Determine risk level
            if fraud_prob > 0.8:
                risk_level = 'high'
            elif fraud_prob > 0.4:
                risk_level = 'medium'
            else:
                risk_level = 'low'

            return {
                'is_fraud': is_fraud,
                'fraud_probability': round(fraud_prob, 4),
                'risk_level': risk_level,
                'anomaly_score': round(anomaly_score, 2)
            }

        except Exception as e:
            print(f"Error in prediction: {str(e)}")
            # Return safe default prediction
            return {
                'is_fraud': False,
                'fraud_probability': 0.1,
                'risk_level': 'low',
                'anomaly_score': 10.0
            }

    def _rule_based_prediction(self, transaction_data):
        """Fallback rule-based fraud detection"""
        score = 0
        factors = 0

        # Amount-based risk
        amount = float(transaction_data.get('amount', 0))
        factors += 1
        if amount > 10000:
            score += 0.4
        elif amount > 5000:
            score += 0.3
        elif amount > 1000:
            score += 0.2
        else:
            score += 0.1

        # Age-based risk
        age = int(transaction_data.get('age', 30))
        factors += 1
        if age < 18 or age > 70:
            score += 0.3
        elif age < 25 or age > 60:
            score += 0.2
        else:
            score += 0.1

        # High-risk categories
        category = transaction_data.get('category', '')
        factors += 1
        high_risk_categories = ['es_misc_net', 'es_entertainment', 'es_travel']
        if category in high_risk_categories:
            score += 0.3
        else:
            score += 0.1

        # Distance-based risk
        zip_ori = transaction_data.get('zipcodeOri', '00000')
        zip_merchant = transaction_data.get('zipMerchant', '00000')
        factors += 1
        try:
            distance = abs(int(zip_ori) - int(zip_merchant))
            if distance > 50000:
                score += 0.3
            elif distance > 10000:
                score += 0.2
            else:
                score += 0.1
        except:
            score += 0.1

        # Add randomness for more realistic demo
        factors += 1
        score += random.uniform(0.05, 0.25)

        fraud_prob = min(score / factors, 1.0)

        return {
            'is_fraud': fraud_prob > 0.5,
            'fraud_probability': fraud_prob,
            'anomaly_score': fraud_prob * 100
        }


# Initialize fraud detection model
fraud_model = FraudDetectionModel()


# Risk Assessment Engine


class RiskAssessmentEngine:
    def __init__(self):
        self.high_risk_countries = ['CN', 'RU', 'IR', 'KP', 'AF', 'SY']
        self.sanctions_list = ['suspicious_entity', 'blocked_individual']

    def analyze_transaction(self, transaction_data):
        """Analyze transaction and return risk assessment"""
        start_time = datetime.now()

        risk_score = self._calculate_risk_score(transaction_data)
        risk_level = self._determine_risk_level(risk_score)
        status = self._determine_status(risk_score)
        compliance_checks = self._perform_compliance_checks(transaction_data)
        risk_factors = self._identify_risk_factors(transaction_data)
        recommendation = self._get_recommendation(status, risk_score)

        processing_time = (datetime.now() - start_time).total_seconds()

        return {
            'risk_score': risk_score,
            'risk_level': risk_level,
            'status': status,
            'compliance_checks': compliance_checks,
            'risk_factors': risk_factors,
            'recommendation': recommendation,
            'processing_time': processing_time,
            'alert_sent': status in ['flagged', 'blocked']
        }

    def _calculate_risk_score(self, data):
        """Calculate risk score based on various factors"""
        score = 0

        # Amount-based risk
        amount = float(data.get('amount', 0))
        if amount > 100000:
            score += 40
        elif amount > 50000:
            score += 25
        elif amount > 10000:
            score += 15
        elif amount > 5000:
            score += 5

        # Country-based risk
        sender_country = data.get('senderCountry', '')
        receiver_country = data.get('receiverCountry', '')

        if sender_country in self.high_risk_countries:
            score += 20
        if receiver_country in self.high_risk_countries:
            score += 20

        # Cross-border transaction
        if sender_country != receiver_country:
            score += 5

        # Payment method risk
        payment_method = data.get('paymentMethod', '')
        if payment_method == 'crypto':
            score += 25
        elif payment_method == 'cash':
            score += 15
        elif payment_method == 'digital_wallet':
            score += 5

        # Transaction type risk
        transaction_type = data.get('transactionType', '')
        if transaction_type in ['investment', 'trade']:
            score += 10

        # Risk factors from form
        risk_factors = data.get('riskFactors', [])
        if isinstance(risk_factors, list):
            score += len(risk_factors) * 8

        # Random component to simulate model uncertainty
        score += random.uniform(-5, 5)

        return max(0, min(100, round(score)))

    def _determine_risk_level(self, score):
        """Determine risk level based on score"""
        if score >= 70:
            return 'high'
        elif score >= 40:
            return 'medium'
        else:
            return 'low'

    def _determine_status(self, score):
        """Determine transaction status based on score"""
        if score >= 80:
            return 'blocked'
        elif score >= 60:
            return 'flagged'
        else:
            return 'approved'

    def _perform_compliance_checks(self, data):
        """Perform various compliance checks"""
        checks = {
            'sanctions_list': True,
            'aml_check': True,
            'pep_check': True,
            'country_risk': True,
            'amount_threshold': True
        }

        # Simulate checks based on data
        if data.get('senderCountry') in self.high_risk_countries or \
           data.get('receiverCountry') in self.high_risk_countries:
            checks['country_risk'] = False

        if float(data.get('amount', 0)) > 10000:
            checks['amount_threshold'] = False

        risk_factors = data.get('riskFactors', [])
        if 'pep' in risk_factors:
            checks['pep_check'] = False

        # Simulate random failures for demo
        if random.random() < 0.1:  # 10% chance of sanctions list hit
            checks['sanctions_list'] = False

        if random.random() < 0.05:  # 5% chance of AML check failure
            checks['aml_check'] = False

        return checks

    def _identify_risk_factors(self, data):
        """Identify specific risk factors"""
        factors = []

        amount = float(data.get('amount', 0))
        if amount > 50000:
            factors.append('Very high value transaction')
        elif amount > 10000:
            factors.append('High value transaction')

        if data.get('senderCountry') in self.high_risk_countries:
            factors.append('High risk sender jurisdiction')

        if data.get('receiverCountry') in self.high_risk_countries:
            factors.append('High risk receiver jurisdiction')

        if data.get('paymentMethod') == 'crypto':
            factors.append('Cryptocurrency payment method')
        elif data.get('paymentMethod') == 'cash':
            factors.append('Cash-based transaction')

        risk_factors = data.get('riskFactors', [])
        if isinstance(risk_factors, list):
            factor_mapping = {
                'high_value': 'High value transaction',
                'new_customer': 'New customer profile',
                'high_risk_country': 'High risk country involvement',
                'cash_intensive': 'Cash intensive business',
                'unusual_pattern': 'Unusual transaction pattern',
                'pep': 'Politically exposed person'
            }

            for factor in risk_factors:
                mapped_factor = factor_mapping.get(
                    factor, factor.replace('_', ' ').title())
                factors.append(mapped_factor)

        return factors

    def _get_recommendation(self, status, score):
        """Get recommendation based on status and score"""
        recommendations = {
            'approved': 'Transaction approved for processing. Continue with standard procedures.',
            'flagged': 'Manual review required. Enhanced due diligence recommended before processing.',
            'blocked': 'Transaction blocked due to high risk. Compliance investigation required.'
        }

        base_rec = recommendations.get(status, 'Unknown status')

        if score > 90:
            base_rec += ' Immediate escalation to senior compliance officer recommended.'
        elif score > 70:
            base_rec += ' Consider additional documentation and verification.'

        return base_rec


# Initialize risk engine
risk_engine = RiskAssessmentEngine()

# Email notification service


def send_alert_email(transaction_data, analysis_result):
    """Send email alert for flagged/blocked transactions"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = ', '.join(ALERT_RECIPIENTS)
        msg['Subject'] = f"GOSEL Alert: {analysis_result['status'].upper()} Transaction - {transaction_data['transactionId']}"

        # Email body
        body = f"""
GOSEL Transaction Risk Alert

Transaction Details:
- Transaction ID: {transaction_data['transactionId']}
- Amount: {transaction_data['amount']} {transaction_data['currencyFrom']} → {transaction_data['currencyTo']}
- Sender: {transaction_data['senderName']} ({transaction_data['senderCountry']})
- Receiver: {transaction_data['receiverName']} ({transaction_data['receiverCountry']})
- Status: {analysis_result['status'].upper()}
- Risk Score: {analysis_result['risk_score']}%
- Risk Level: {analysis_result['risk_level'].upper()}

Risk Factors Identified:
{chr(10).join(['- ' + factor for factor in analysis_result['risk_factors']])}

Compliance Checks:
- Sanctions List: {'PASS' if analysis_result['compliance_checks']['sanctions_list'] else 'FAIL'}
- AML Check: {'PASS' if analysis_result['compliance_checks']['aml_check'] else 'FAIL'}
- PEP Check: {'PASS' if analysis_result['compliance_checks']['pep_check'] else 'FAIL'}
- Country Risk: {'PASS' if analysis_result['compliance_checks']['country_risk'] else 'FAIL'}

Recommendation:
{analysis_result['recommendation']}

Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}

This is an automated alert from the GOSEL risk assessment system.
Please review and take appropriate action.
        """

        msg.attach(MIMEText(body, 'plain'))

        # Send email
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_USER, ALERT_RECIPIENTS, text)
        server.quit()

        return True
    except Exception as e:
        print(f"Error sending email alert: {str(e)}")
        return False

# API Routes


@app.route('/api/analyze-transaction', methods=['POST'])
def analyze_transaction():
    """Analyze a transaction for fraud detection and risk assessment"""
    try:
        # Log the raw incoming data
        print("\n===== INCOMING TRANSACTION DATA =====")
        data = request.get_json()
        print(f"Raw data from frontend: {json.dumps(data, indent=2)}")

        if not data:
            print("ERROR: No data provided in the request")
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        # Validate required fields for fraud detection
        fraud_required_fields = ['transaction_id',
                                 'amount', 'customer', 'age', 'gender']
        missing_fields = [
            field for field in fraud_required_fields if field not in data]
        if missing_fields:
            print(f"ERROR: Missing required fields: {missing_fields}")
            return jsonify({'success': False, 'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        print(
            f"Data validation passed. Processing transaction: {data['transaction_id']}")

        # Perform fraud detection using ML model
        print("Running fraud detection model...")
        fraud_prediction = fraud_model.predict(data)
        print(
            f"Fraud prediction result: {json.dumps(fraud_prediction, indent=2)}")

        # Also perform risk analysis if additional fields are present
        risk_analysis = None
        if 'senderName' in data and 'receiverName' in data:
            risk_analysis = risk_engine.analyze_transaction(data)

        # Store fraud transaction in database
        fraud_transaction = FraudTransaction(
            transaction_id=data['transaction_id'],
            customer=data['customer'],
            age=int(data['age']),
            gender=data['gender'],
            zipcode_ori=data.get('zipcodeOri', ''),
            merchant=data.get('merchant', ''),
            zip_merchant=data.get('zipMerchant', ''),
            category=data.get('category', 'es_misc_pos'),
            amount=float(data['amount']),
            is_fraud=fraud_prediction['is_fraud'],
            fraud_probability=fraud_prediction['fraud_probability'],
            risk_level=fraud_prediction['risk_level'],
            anomaly_score=fraud_prediction['anomaly_score'],
            timestamp=datetime.fromisoformat(
                data.get('timestamp', datetime.now().isoformat()).replace('Z', '+00:00'))
        )

        # Store in database
        try:
            print("\n===== STORING IN DATABASE =====")
            print(
                f"Saving fraud transaction to database: {data['transaction_id']}")
            print(
                f"Transaction details: customer={data['customer']}, amount={data['amount']}, is_fraud={fraud_prediction['is_fraud']}")

            db.session.add(fraud_transaction)

            # Also store traditional risk analysis if available
            if risk_analysis:
                print(
                    f"Saving traditional risk analysis to database: {data['transaction_id']}")
                print(
                    f"Risk score: {risk_analysis['risk_score']}, risk level: {risk_analysis['risk_level']}")

                transaction = Transaction(
                    transaction_id=data['transaction_id'],
                    amount=float(data['amount']),
                    currency_from=data.get('currencyFrom', 'USD'),
                    currency_to=data.get('currencyTo', 'USD'),
                    sender_name=data.get('senderName', data['customer']),
                    sender_country=data.get('senderCountry', 'US'),
                    sender_id=data.get('senderId', ''),
                    sender_account=data.get('senderAccount', ''),
                    receiver_name=data.get(
                        'receiverName', data.get('merchant', '')),
                    receiver_country=data.get('receiverCountry', 'US'),
                    receiver_id=data.get('receiverId', ''),
                    receiver_account=data.get('receiverAccount', ''),
                    transaction_type=data.get('transactionType', 'purchase'),
                    payment_method=data.get('paymentMethod', 'card'),
                    purpose=data.get(
                        'purpose', f"Purchase at {data.get('merchant', 'merchant')}"),
                    ip_address=data.get('ipAddress', ''),
                    risk_factors=json.dumps(data.get('riskFactors', [])),
                    timestamp=datetime.fromisoformat(
                        data.get('timestamp', datetime.now().isoformat()).replace('Z', '+00:00'))
                )

                analysis = TransactionAnalysis(
                    transaction_id=data['transaction_id'],
                    risk_score=risk_analysis['risk_score'],
                    risk_level=risk_analysis['risk_level'],
                    status=risk_analysis['status'],
                    compliance_checks=json.dumps(
                        risk_analysis['compliance_checks']),
                    risk_factors_identified=json.dumps(
                        risk_analysis['risk_factors']),
                    recommendation=risk_analysis['recommendation'],
                    processing_time=risk_analysis['processing_time'],
                    alert_sent=risk_analysis['alert_sent']
                )

                db.session.add(transaction)
                db.session.add(analysis)

            # Commit the transaction to the database
            db.session.commit()
            print("✅ Database commit successful!")

            # Verify transaction was saved correctly
            print("\n===== VERIFYING DATABASE STORAGE =====")
            transaction_saved = check_transaction_in_db(data['transaction_id'])
            if transaction_saved:
                print("✅ Transaction verification successful - found in database!")
            else:
                print("❌ Transaction verification failed - not found in database!")

        except Exception as db_error:
            print(f"❌ Database error: {str(db_error)}")
            db.session.rollback()

        # Send email alert if high risk fraud detected
        if fraud_prediction['is_fraud'] and fraud_prediction['risk_level'] == 'high':
            email_data = {
                'transactionId': data['transaction_id'],
                'amount': data['amount'],
                'currencyFrom': 'USD',
                'currencyTo': 'USD',
                'senderName': data['customer'],
                'senderCountry': 'US',
                'receiverName': data.get('merchant', 'Unknown Merchant'),
                'receiverCountry': 'US'
            }

            alert_data = {
                'status': 'blocked' if fraud_prediction['fraud_probability'] > 0.8 else 'flagged',
                'risk_score': int(fraud_prediction['fraud_probability'] * 100),
                'risk_level': fraud_prediction['risk_level'],
                'risk_factors': [f"Fraud probability: {fraud_prediction['fraud_probability']:.2%}",
                                 f"Anomaly score: {fraud_prediction['anomaly_score']:.1f}"],
                'compliance_checks': {'fraud_model': not fraud_prediction['is_fraud']},
                'recommendation': 'Manual review required due to high fraud probability.'
            }

            try:
                send_alert_email(email_data, alert_data)
            except Exception as email_error:
                print(f"Failed to send email alert: {str(email_error)}")

        # Prepare response
        response_data = {
            'transaction_id': data['transaction_id'],
            'is_fraud': fraud_prediction['is_fraud'],
            'fraud_probability': fraud_prediction['fraud_probability'],
            'risk_level': fraud_prediction['risk_level'],
            'anomaly_score': fraud_prediction['anomaly_score'],
            'timestamp': data.get('timestamp'),
            'risk_factors': [
                f"Fraud probability: {fraud_prediction['fraud_probability']:.2%}",
                f"Risk level: {fraud_prediction['risk_level']}",
                f"Amount: ${data['amount']}"
            ]
        }

        # Add risk analysis data if available
        if risk_analysis:
            response_data.update({
                'traditional_risk_score': risk_analysis['risk_score'],
                'compliance_status': risk_analysis['status'],
                'compliance_checks': risk_analysis['compliance_checks'],
                'processing_time': risk_analysis['processing_time']
            })

        print("\n===== SENDING RESPONSE TO FRONTEND =====")
        print(f"Response data: {json.dumps(response_data, indent=2)}")
        print("Transaction processing complete!\n")

        return jsonify({'success': True, 'data': response_data})

    except Exception as e:
        print(f"Error analyzing transaction: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500


@app.route('/api/fraud-history', methods=['GET'])
def get_fraud_history():
    """Get fraud detection history"""
    try:
        transactions = FraudTransaction.query.order_by(
            FraudTransaction.created_at.desc()
        ).limit(50).all()

        history = []
        for transaction in transactions:
            history.append({
                'id': transaction.transaction_id,
                'timestamp': transaction.timestamp.isoformat(),
                'customer': transaction.customer,
                'amount': float(transaction.amount),
                'merchant': transaction.merchant,
                'category': transaction.category,
                'is_fraud': transaction.is_fraud,
                'fraud_probability': transaction.fraud_probability,
                'risk_level': transaction.risk_level,
                'anomaly_score': transaction.anomaly_score
            })

        return jsonify({'success': True, 'transactions': history})

    except Exception as e:
        print(f"Error fetching fraud history: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500


@app.route('/api/transaction-history', methods=['GET'])
def get_transaction_history():
    """Get transaction history with analysis results"""
    try:
        # Query transactions with their analysis results
        query = db.session.query(Transaction, TransactionAnalysis).join(
            TransactionAnalysis, Transaction.transaction_id == TransactionAnalysis.transaction_id
        ).order_by(Transaction.created_at.desc()).limit(50)

        transactions = []
        for transaction, analysis in query:
            transactions.append({
                'id': transaction.transaction_id,
                'timestamp': transaction.timestamp.isoformat(),
                'amount': float(transaction.amount),
                'senderName': transaction.sender_name,
                'receiverName': transaction.receiver_name,
                'status': analysis.status,
                'riskScore': analysis.risk_score,
                'riskLevel': analysis.risk_level,
                'alertSent': analysis.alert_sent
            })

        return jsonify({'success': True, 'transactions': transactions})

    except Exception as e:
        print(f"Error fetching transaction history: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})


@app.route('/api/db-verification', methods=['GET'])
def db_verification():
    """Verify database tables and record counts"""
    try:
        # Count records in each table
        fraud_count = FraudTransaction.query.count()
        transaction_count = Transaction.query.count()
        analysis_count = TransactionAnalysis.query.count()

        # Get the most recent entries
        latest_fraud = FraudTransaction.query.order_by(
            FraudTransaction.created_at.desc()).first()
        latest_transaction = Transaction.query.order_by(
            Transaction.created_at.desc()).first()

        fraud_latest = None
        if latest_fraud:
            fraud_latest = {
                'transaction_id': latest_fraud.transaction_id,
                'customer': latest_fraud.customer,
                'amount': float(latest_fraud.amount),
                'is_fraud': latest_fraud.is_fraud,
                'fraud_probability': latest_fraud.fraud_probability,
                'timestamp': latest_fraud.timestamp.isoformat()
            }

        transaction_latest = None
        if latest_transaction:
            transaction_latest = {
                'transaction_id': latest_transaction.transaction_id,
                'sender_name': latest_transaction.sender_name,
                'receiver_name': latest_transaction.receiver_name,
                'amount': float(latest_transaction.amount),
                'timestamp': latest_transaction.timestamp.isoformat()
            }

        return jsonify({
            'success': True,
            'database_status': 'connected',
            'record_counts': {
                'fraud_transactions': fraud_count,
                'transactions': transaction_count,
                'transaction_analysis': analysis_count
            },
            'latest_records': {
                'fraud_transaction': fraud_latest,
                'transaction': transaction_latest
            }
        })
    except Exception as e:
        print(f"Error in DB verification: {str(e)}")
        return jsonify({'success': False, 'message': 'Database verification failed', 'error': str(e)}), 500


@app.route('/')
def index():
    """Serve the demo frontend"""
    return app.send_static_file('index.html')


# Database initialization function
def init_database():
    """Initialize database tables"""
    try:
        with app.app_context():
            db.create_all()
            print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {str(e)}")


def check_transaction_in_db(transaction_id):
    """Helper function to check if a transaction is in the database"""
    try:
        # Check in fraud_transactions table
        fraud_tx = FraudTransaction.query.filter_by(
            transaction_id=transaction_id).first()
        if fraud_tx:
            print(f"✅ Found in fraud_transactions: {transaction_id}")
            print(
                f"   Amount: {fraud_tx.amount}, Customer: {fraud_tx.customer}")
            print(
                f"   Fraud Probability: {fraud_tx.fraud_probability}, Risk Level: {fraud_tx.risk_level}")
        else:
            print(f"❌ Not found in fraud_transactions: {transaction_id}")

        # Check in transactions table
        tx = Transaction.query.filter_by(transaction_id=transaction_id).first()
        if tx:
            print(f"✅ Found in transactions: {transaction_id}")
            print(
                f"   Amount: {tx.amount}, Sender: {tx.sender_name}, Receiver: {tx.receiver_name}")
        else:
            print(f"❌ Not found in transactions: {transaction_id}")

        return bool(fraud_tx or tx)
    except Exception as e:
        print(f"Error checking transaction: {str(e)}")
        return False


if __name__ == '__main__':
    # Initialize database
    init_database()

    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5050)
