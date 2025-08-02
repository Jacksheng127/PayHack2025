"""
GOSEL Backend API - Main application interface
Handles API endpoints for fraud detection system
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json

# Import database and model components
from db import init_database_config
from fraud_model import fraud_model
from model import process_transaction, parse_and_process_data, reset_state

app = Flask(__name__)
CORS(app)

# Initialize database
db_manager = init_database_config(app)


@app.route('/api/analyze-transaction', methods=['POST'])
def analyze_transaction():
    """
    Main API endpoint to analyze transactions for fraud detection

    Expected input:
    {
        "transaction_id": "TXN123",
        "sender": "Alice Smith", 
        "receiver": "Bob Johnson",
        "timestamp": "2025-08-02T10:30:00Z",
        "amount": 1500.00,
        "transaction_type": "transfer"
        "sender_type": "personal",  # Optional
        "receiver_type": "business"  # Optional
    }
    """
    try:
        print("\n===== INCOMING TRANSACTION ANALYSIS REQUEST =====")
        data = request.get_json()
        print(f"Request data: {json.dumps(data, indent=2)}")

        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        # # Validate required fields
        # required_fields = ['transaction_id', 'sender',
        #                    'receiver', 'amount', 'transaction_type']
        # missing_fields = [
        #     field for field in required_fields if field not in data]

        # if missing_fields:
        #     return jsonify({
        #         'success': False,
        #         'message': f'Missing required fields: {", ".join(missing_fields)}'
        #     }), 400

        # print(
        #     f"✅ Data validation passed for transaction: {data['transaction_id']}")

        # Perform fraud detection analysis
        print("🔍 Running fraud detection model...")
        fraud_result = parse_and_process_data(data)
        print(f"📊 Fraud analysis result: {json.dumps(fraud_result, indent=2)}")

        # Save transaction and analysis to database
        # print("💾 Saving to database...")
        # try:
        #     saved_transaction = db_manager.save_fraud_transaction(
        #         data, fraud_result)
        #     print(
        #         f"✅ Transaction saved successfully: {saved_transaction.transaction_id}")
        # except Exception as db_error:
        #     print(f"❌ Database error: {str(db_error)}")
        #     return jsonify({
        #         'success': False,
        #         'message': f'Database error: {str(db_error)}'
        #     }), 500

        # Prepare response
        response_data = {
            'transaction_id': data['transaction_id'],
            'sender': data['sender'],
            'receiver': data['receiver'],
            'amount': data['amount'],
            'transaction_type': data['transaction_type'],
            'timestamp': data.get('timestamp', datetime.now().isoformat()),
            'analysis': {
                'is_fraud': fraud_result['is_fraud'],
                'fraud_probability': fraud_result['fraud_probability'],
                'risk_level': fraud_result['risk_level'],
                'anomaly_score': fraud_result['anomaly_score']
            },
            'status': 'blocked' if fraud_result['is_fraud'] else 'approved'
        }

        print("📤 Sending response to frontend...")
        print(f"Response: {json.dumps(response_data, indent=2)}")
        print("✅ Transaction analysis complete!\n")

        return jsonify({'success': True, 'data': response_data})

    except Exception as e:
        print(f"❌ Error analyzing transaction: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Internal server error: {str(e)}'
        }), 500


@app.route('/api/analyze-transactions-batch', methods=['POST'])
def analyze_transactions_batch():
    """
    New endpoint to handle raw data string format and process multiple transactions

    Expected input:
    {
        "raw_data": "Has234,jon,yy,2025-08-03 00:54:15.441904,1500.00,transfer,personal,business;wrett2435,jin,auyong,2025-08-02 00:54:15.441904,1500.00,transfer,personal,business"
    }
    """
    try:
        print("\n===== INCOMING BATCH TRANSACTION ANALYSIS REQUEST =====")
        data = request.get_json()
        print(f"Request data received")

        if not data or 'raw_data' not in data:
            return jsonify({'success': False, 'message': 'No raw_data provided'}), 400

        raw_data_string = data['raw_data']
        print(f"Raw data string: {raw_data_string}")

        # Process the raw data using the model
        print("🔍 Processing raw data through model...")
        processed_results = parse_and_process_data(raw_data_string)
        print(f"📊 Processed {len(processed_results)} transactions")

        # Format results for frontend
        formatted_transactions = []
        for result in processed_results:
            # Determine risk level from risk score
            risk_score = result['risk_score']
            if risk_score < 0.25:
                risk_level = 'L0'
            elif risk_score < 0.5:
                risk_level = 'L1'
            elif risk_score < 0.75:
                risk_level = 'L2'
            else:
                risk_level = 'L3'

            # Convert to frontend format
            formatted_transaction = {
                'transaction_id': result['transaction_id'],
                'sender': result['sender'],
                'receiver': result['receiver'],
                'amount': result['amount'],
                'transaction_type': result['type'],
                'timestamp': result['timestamp'],
                'sender_type': result['ofi_type'],
                'receiver_type': result['rfi_type'],
                'analysis': {
                    'is_fraud': risk_score > 0.5,
                    'fraud_probability': risk_score,
                    'risk_level': risk_level,
                    'anomaly_score': risk_score * 100
                },
                'status': 'blocked' if risk_score > 0.5 else 'approved',
                'risk_score': risk_score
            }
            formatted_transactions.append(formatted_transaction)

        response_data = {
            'transactions': formatted_transactions,
            'count': len(formatted_transactions),
            'summary': {
                'total_transactions': len(formatted_transactions),
                'high_risk_count': len([t for t in formatted_transactions if t['analysis']['risk_level'] in ['L2', 'L3']]),
                'fraud_count': len([t for t in formatted_transactions if t['analysis']['is_fraud']]),
                'average_risk_score': sum([t['risk_score'] for t in formatted_transactions]) / len(formatted_transactions) if formatted_transactions else 0
            }
        }

        print("📤 Sending batch response to frontend...")
        print(f"Processed {len(formatted_transactions)} transactions")
        print("✅ Batch transaction analysis complete!\n")

        return jsonify({'success': True, 'data': response_data})

    except Exception as e:
        print(f"❌ Error processing batch transactions: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Internal server error: {str(e)}'
        }), 500


@app.route('/api/reset-database', methods=['POST'])
def reset_database():
    """
    Endpoint to reset the database by dropping all tables and reinitializing
    """
    try:
        print("🔄 Resetting database...")
        reset_state()
        print("✅ Database reset successfully")

        return jsonify({
            'success': True,
            'message': 'Database reset successfully',
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        print(f"❌ Error resetting database: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Failed to reset database: {str(e)}'
        }), 500


# @app.route('/api/transaction-history', methods=['GET'])
# def get_transaction_history():
#     """Get transaction history with fraud analysis results"""
#     try:
#         limit = request.args.get('limit', 50, type=int)
#         transactions = db_manager.get_transaction_history(limit=limit)

#         return jsonify({
#             'success': True,
#             'transactions': transactions,
#             'count': len(transactions)
#         })

#     except Exception as e:
#         print(f"Error fetching transaction history: {str(e)}")
#         return jsonify({
#             'success': False,
#             'message': 'Failed to fetch transaction history'
#         }), 500


# @app.route('/api/fraud-statistics', methods=['GET'])
# def get_fraud_statistics():
#     """Get fraud detection statistics"""
#     try:
#         stats = db_manager.get_fraud_statistics()
#         return jsonify({'success': True, 'statistics': stats})

#     except Exception as e:
#         print(f"Error fetching fraud statistics: {str(e)}")
#         return jsonify({
#             'success': False,
#             'message': 'Failed to fetch statistics'
#         }), 500


# @app.route('/api/transaction/<transaction_id>', methods=['GET'])
# def get_transaction_by_id(transaction_id):
#     """Get specific transaction by ID"""
#     try:
#         transaction = db_manager.get_transaction_by_id(transaction_id)

#         if transaction:
#             return jsonify({
#                 'success': True,
#                 'transaction': transaction.to_dict()
#             })
#         else:
#             return jsonify({
#                 'success': False,
#                 'message': 'Transaction not found'
#             }), 404

#     except Exception as e:
#         print(f"Error fetching transaction {transaction_id}: {str(e)}")
#         return jsonify({
#             'success': False,
#             'message': 'Failed to fetch transaction'
#         }), 500


# @app.route('/api/health', methods=['GET'])
# def health_check():
#     """Health check endpoint"""
#     return jsonify({
#         'status': 'healthy',
#         'service': 'GOSEL Fraud Detection API',
#         'timestamp': datetime.now().isoformat(),
#         'version': '1.0.0'
#     })


# @app.route('/', methods=['GET'])
# def index():
#     """API information endpoint"""
#     return jsonify({
#         'service': 'GOSEL Fraud Detection API',
#         'version': '1.0.0',
#         'endpoints': {
#             'POST /api/analyze-transaction': 'Analyze transaction for fraud',
#             'GET /api/transaction-history': 'Get transaction history',
#             'GET /api/fraud-statistics': 'Get fraud detection statistics',
#             'GET /api/transaction/<id>': 'Get specific transaction',
#             'GET /api/health': 'Health check'
#         },
#         'timestamp': datetime.now().isoformat()
#     })


if __name__ == '__main__':
    # This should not be used in production - use main.py instead
    print("⚠️  Warning: Running app.py directly. Use main.py for production.")
    app.run(debug=True, host='0.0.0.0', port=5050)
