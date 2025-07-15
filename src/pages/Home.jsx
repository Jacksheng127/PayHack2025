import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      icon: '🛂',
      title: 'Merchant Passport',
      description: 'Digital identity verification with blockchain-backed attestations',
      link: '/onboard',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: '🔗',
      title: 'Smart Integration',
      description: 'Seamless onboarding with multiple PSPs using verified credentials',
      link: '/integrate',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: '💳',
      title: 'Payment Orchestration',
      description: 'Intelligent routing with automatic fallback mechanisms',
      link: '/payments',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: '📦',
      title: 'Audit Trail',
      description: 'Immutable ledger for compliance and transparency',
      link: '/ledger/sample-passport-001',
      color: 'bg-gray-50 text-gray-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              🧩 GOSEL Platform
            </h1>
            <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
              Next-generation payment orchestration layer with merchant onboarding innovation, 
              smart routing, and blockchain-backed audit trails.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboard"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Onboarding
              </Link>
              <Link
                to="/passport"
                className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
              >
                View Passport
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Payment Infrastructure
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive solution for merchant onboarding, 
            payment processing, and compliance management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 card-hover"
            >
              <div className={`w-16 h-16 rounded-lg ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Demo Flow Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Demo Flow
            </h2>
            <p className="text-lg text-gray-600">
              Experience the complete merchant journey from onboarding to payment processing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                📝
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Onboard</h3>
              <p className="text-sm text-gray-600">Create merchant profile with bank verification</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🛂
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Passport</h3>
              <p className="text-sm text-gray-600">Generate digital passport with blockchain attestation</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🔗
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Integrate</h3>
              <p className="text-sm text-gray-600">Connect with PSPs using verified credentials</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                💳
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Process</h3>
              <p className="text-sm text-gray-600">Execute payments with smart routing</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                📦
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">5. Audit</h3>
              <p className="text-sm text-gray-600">Track all activities on immutable ledger</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-300">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50ms</div>
              <div className="text-gray-300">Average Latency</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">Global Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 