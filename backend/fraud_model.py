"""
Fraud Detection Model for GOSEL system
"""

import torch
import numpy as np
import os
import random
from datetime import datetime


class FraudDetectionModel:
    def __init__(self, model_path='fraud_detection_model.pth'):
        self.model_path = model_path
        self.model = None
        self.device = torch.device(
            'cuda' if torch.cuda.is_available() else 'cpu')
        self.load_model()

    def load_model(self):
        """Load the PyTorch model"""
        try:
            if os.path.exists(self.model_path):
                print(f"Loading fraud detection model from {self.model_path}")
                self.model = torch.load(
                    self.model_path, map_location=self.device)
                self.model.eval()
                print("✅ Fraud detection model loaded successfully")
            else:
                print("⚠️ Model file not found, using rule-based approach")
                self.model = None
        except Exception as e:
            print(
                f"Error loading model: {str(e)}, falling back to rule-based approach")
            self.model = None

    def preprocess_data(self, transaction_data):
        """Preprocess transaction data for model input"""
        try:
            # Extract basic features from transaction
            features = []

            # Amount (normalized)
            amount = float(transaction_data.get('amount', 0))
            features.append(min(amount / 100000, 1.0))  # Normalize to 0-1

            # Transaction type encoding
            ttype = transaction_data.get('transaction_type', 'transfer')
            type_mapping = {
                'transfer': 0.1,
                'payment': 0.3,
                'withdrawal': 0.5,
                'deposit': 0.2,
                'purchase': 0.4
            }
            features.append(type_mapping.get(ttype, 0.3))

            # Time-based features (hour of day)
            timestamp = transaction_data.get(
                'timestamp', datetime.now().isoformat())
            try:
                dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                hour_normalized = dt.hour / 24.0  # 0-1
                features.append(hour_normalized)
            except:
                features.append(0.5)  # Default to noon

            # Sender/receiver hash (simple risk factor)
            sender = transaction_data.get('sender', '')
            receiver = transaction_data.get('receiver', '')

            # Simple risk scoring based on entity names
            sender_risk = self._calculate_entity_risk(sender)
            receiver_risk = self._calculate_entity_risk(receiver)

            features.extend([sender_risk, receiver_risk])

            return np.array(features, dtype=np.float32)

        except Exception as e:
            print(f"Error in preprocessing: {str(e)}")
            # Return default safe values
            return np.array([0.1, 0.3, 0.5, 0.2, 0.2], dtype=np.float32)

    def _calculate_entity_risk(self, entity_name):
        """Calculate risk score for an entity based on name patterns"""
        if not entity_name:
            return 0.3

        risk_keywords = ['unknown', 'anonymous', 'temp', 'test', 'fake']
        high_risk_patterns = ['xxx', '123', 'null', 'admin']

        entity_lower = entity_name.lower()

        # Check for risk patterns
        risk_score = 0.1  # Base risk

        for keyword in risk_keywords:
            if keyword in entity_lower:
                risk_score += 0.2

        for pattern in high_risk_patterns:
            if pattern in entity_lower:
                risk_score += 0.3

        # Length-based risk (very short or very long names)
        if len(entity_name) < 3:
            risk_score += 0.2
        elif len(entity_name) > 50:
            risk_score += 0.1

        return min(risk_score, 1.0)

    def predict(self, transaction_data):
        """Make fraud prediction"""
        try:
            if self.model is not None:
                # Use ML model if available
                features = self.preprocess_data(transaction_data)
                features_tensor = torch.tensor(
                    features).unsqueeze(0).to(self.device)

                with torch.no_grad():
                    output = self.model(features_tensor)
                    fraud_prob = torch.sigmoid(output).item()

                is_fraud = fraud_prob > 0.5
                anomaly_score = fraud_prob * 100

            else:
                # Rule-based approach
                fraud_prob, anomaly_score = self._rule_based_prediction(
                    transaction_data)
                is_fraud = fraud_prob > 0.5

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
        """Rule-based fraud detection fallback"""
        risk_score = 0.0

        # Amount-based risk
        amount = float(transaction_data.get('amount', 0))
        if amount > 100000:
            risk_score += 0.4
        elif amount > 50000:
            risk_score += 0.3
        elif amount > 10000:
            risk_score += 0.2
        elif amount < 1:
            risk_score += 0.3  # Suspicious small amounts

        # Time-based risk (late night transactions)
        timestamp = transaction_data.get(
            'timestamp', datetime.now().isoformat())
        try:
            dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            hour = dt.hour
            if hour < 6 or hour > 23:  # Late night/early morning
                risk_score += 0.2
        except:
            pass

        # Entity-based risk
        sender = transaction_data.get('sender', '')
        receiver = transaction_data.get('receiver', '')

        sender_risk = self._calculate_entity_risk(sender)
        receiver_risk = self._calculate_entity_risk(receiver)

        risk_score += (sender_risk + receiver_risk) / 2

        # Transaction type risk
        ttype = transaction_data.get('transaction_type', 'transfer')
        if ttype in ['withdrawal', 'cash_out']:
            risk_score += 0.1

        # Add some randomness for demo purposes
        risk_score += random.uniform(-0.1, 0.1)

        # Ensure score is between 0 and 1
        fraud_prob = max(0.0, min(1.0, risk_score))
        anomaly_score = fraud_prob * 100

        return fraud_prob, anomaly_score


# Initialize global fraud model instance
fraud_model = FraudDetectionModel()
