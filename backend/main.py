"""
GOSEL Backend Main Application
Entry point for the fraud detection system
"""

import os
from app import app, db_manager


def initialize_application():
    """Initialize the application and database"""
    print("🚀 Starting GOSEL Fraud Detection Backend...")

    # Initialize database tables
    print("📊 Initializing database...")
    try:
        with app.app_context():
            db_manager.init_database()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {str(e)}")
        return False

    print("✅ Application initialization complete")
    return True


def main():
    """Main application entry point"""
    print("=" * 50)
    print("GOSEL Fraud Detection System")
    print("Backend API Server")
    print("=" * 50)

    # # Initialize application
    # if not initialize_application():
    #     print("❌ Application initialization failed. Exiting.")
    #     return

    # Get configuration from environment
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5050))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'

    print(f"🌐 Starting server on {host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    print("🔗 API endpoints:")
    print("   POST /api/analyze-transaction - Analyze transaction for fraud")
    print("   GET  /api/transaction-history - Get transaction history")
    print("   GET  /api/fraud-statistics   - Get fraud statistics")
    print("   GET  /api/health            - Health check")
    print("-" * 50)

    try:
        app.run(debug=debug, host=host, port=port)
    except KeyboardInterrupt:
        print("\n👋 Shutting down gracefully...")
    except Exception as e:
        print(f"❌ Server error: {str(e)}")


if __name__ == '__main__':
    main()
