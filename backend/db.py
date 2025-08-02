"""
Database operations and models for GOSEL fraud detection system
"""

import os
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from decimal import Decimal

db = SQLAlchemy()

# Database Models for Fraud Detection


class FraudTransaction(db.Model):
    __tablename__ = 'fraud_transactions'

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(50), unique=True, nullable=False)
    sender = db.Column(db.String(100), nullable=False)
    receiver = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    amount = db.Column(db.Numeric(15, 2), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)

    # Fraud analysis results (added by the model)
    is_fraud = db.Column(db.Boolean, nullable=False, default=False)
    fraud_probability = db.Column(db.Numeric(5, 4))
    risk_level = db.Column(db.String(20))
    anomaly_score = db.Column(db.Numeric(5, 2))

    # Audit fields
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<FraudTransaction {self.transaction_id}: {self.is_fraud}>'

    def to_dict(self):
        """Convert transaction to dictionary for API responses"""
        return {
            'id': self.transaction_id,
            'transaction_id': self.transaction_id,
            'sender': self.sender,
            'receiver': self.receiver,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'amount': float(self.amount) if self.amount else 0,
            'transaction_type': self.transaction_type,
            'is_fraud': self.is_fraud,
            'fraud_probability': float(self.fraud_probability) if self.fraud_probability else 0,
            'risk_level': self.risk_level,
            'anomaly_score': float(self.anomaly_score) if self.anomaly_score else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class DatabaseManager:
    """Database operations manager"""

    def __init__(self, db_instance):
        self.db = db_instance

    def init_database(self):
        """Initialize database tables"""
        try:
            self.db.create_all()
            print("Database tables created successfully")
        except Exception as e:
            print(f"Error creating database tables: {str(e)}")

    def save_fraud_transaction(self, transaction_data, fraud_result):
        """
        Save transaction data and fraud analysis results to database

        Args:
            transaction_data (dict): Transaction data from frontend
            fraud_result (dict): Fraud analysis results from model

        Returns:
            FraudTransaction: Saved transaction object
        """
        try:
            # Parse transaction timestamp
            timestamp_str = transaction_data.get(
                'timestamp', datetime.utcnow().isoformat())
            if 'Z' in timestamp_str:
                timestamp_str = timestamp_str.replace('Z', '+00:00')
            timestamp = datetime.fromisoformat(timestamp_str)

            # Create FraudTransaction object
            fraud_transaction = FraudTransaction(
                transaction_id=transaction_data.get('transaction_id'),
                sender=transaction_data.get('sender', ''),
                receiver=transaction_data.get('receiver', ''),
                timestamp=timestamp,
                amount=Decimal(str(transaction_data.get('amount', 0))),
                transaction_type=transaction_data.get(
                    'transaction_type', 'transfer'),

                # Fraud analysis results
                is_fraud=fraud_result.get('is_fraud', False),
                fraud_probability=Decimal(
                    str(fraud_result.get('fraud_probability', 0))),
                risk_level=fraud_result.get('risk_level', 'low'),
                anomaly_score=Decimal(
                    str(fraud_result.get('anomaly_score', 0)))
            )

            # Save to database
            self.db.session.add(fraud_transaction)
            self.db.session.commit()

            print(
                f"Transaction {fraud_transaction.transaction_id} saved successfully")
            return fraud_transaction

        except Exception as e:
            print(f"Error saving transaction: {str(e)}")
            self.db.session.rollback()
            raise e

    def get_transaction_history(self, limit=50):
        """
        Get recent transaction history

        Args:
            limit (int): Number of transactions to retrieve

        Returns:
            list: List of transaction dictionaries
        """
        try:
            transactions = FraudTransaction.query.order_by(
                FraudTransaction.created_at.desc()
            ).limit(limit).all()

            return [transaction.to_dict() for transaction in transactions]

        except Exception as e:
            print(f"Error retrieving transaction history: {str(e)}")
            return []

    def get_transaction_by_id(self, transaction_id):
        """
        Get transaction by ID

        Args:
            transaction_id (str): Transaction ID

        Returns:
            FraudTransaction: Transaction object or None
        """
        try:
            return FraudTransaction.query.filter_by(
                transaction_id=transaction_id
            ).first()

        except Exception as e:
            print(f"Error retrieving transaction {transaction_id}: {str(e)}")
            return None

    def get_fraud_statistics(self):
        """
        Get fraud detection statistics

        Returns:
            dict: Statistics about fraud transactions
        """
        try:
            total_transactions = FraudTransaction.query.count()
            fraud_transactions = FraudTransaction.query.filter_by(
                is_fraud=True).count()

            if total_transactions > 0:
                fraud_rate = (fraud_transactions / total_transactions) * 100
            else:
                fraud_rate = 0

            # Get recent transactions (last 24 hours)
            from datetime import timedelta
            recent_time = datetime.utcnow() - timedelta(hours=24)
            recent_transactions = FraudTransaction.query.filter(
                FraudTransaction.created_at >= recent_time
            ).count()

            recent_fraud = FraudTransaction.query.filter(
                FraudTransaction.created_at >= recent_time,
                FraudTransaction.is_fraud == True
            ).count()

            return {
                'total_transactions': total_transactions,
                'fraud_transactions': fraud_transactions,
                'fraud_rate': round(fraud_rate, 2),
                'recent_transactions_24h': recent_transactions,
                'recent_fraud_24h': recent_fraud,
                'success_rate': round(100 - fraud_rate, 2) if total_transactions > 0 else 100
            }

        except Exception as e:
            print(f"Error getting fraud statistics: {str(e)}")
            return {
                'total_transactions': 0,
                'fraud_transactions': 0,
                'fraud_rate': 0,
                'recent_transactions_24h': 0,
                'recent_fraud_24h': 0,
                'success_rate': 100
            }


def init_database_config(app):
    """Initialize database configuration"""
    DATABASE_URL = os.environ.get(
        'DATABASE_URL', 'postgresql://db_user:db_password@localhost:5432/db')
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize SQLAlchemy with app
    db.init_app(app)

    return DatabaseManager(db)
