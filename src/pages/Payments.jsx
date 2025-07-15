import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLatestEntry, addLedgerEntry } from '../utils/mockLedger'
import { generateSignature, generateTransactionId } from '../utils/generateSignature'

const Payments = () => {
  const [passport, setPassport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [paymentResult, setPaymentResult] = useState(null)
  const [paymentData, setPaymentData] = useState({
    amount: '',
    currency: 'USD',
    description: '',
    customerEmail: '',
    paymentMethod: 'card'
  })

  const mockRoutes = [
    {
      id: 'route-1',
      psp: 'PayFlow PSP',
      icon: '💳',
      successRate: 98.5,
      latency: 120,
      fxRate: 1.02,
      cost: 2.9,
      features: ['Low latency', 'High success rate', 'Global coverage']
    },
    {
      id: 'route-2',
      psp: 'SwiftPay Network',
      icon: '⚡',
      successRate: 97.8,
      latency: 85,
      fxRate: 1.01,
      cost: 3.1,
      features: ['Ultra-fast', 'Real-time settlement', 'FX optimization']
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      const latestPassport = getLatestEntry('passport')
      setPassport(latestPassport)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const simulatePayment = async () => {
    setProcessing(true)
    setCurrentStep('Analyzing routes...')
    setPaymentResult(null)

    try {
      // Step 1: Route analysis
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCurrentStep('Attempting primary route...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate primary route failure (60% chance)
      const primarySuccess = Math.random() > 0.6
      
      if (primarySuccess) {
        // Primary route succeeded
        setCurrentStep('Payment successful!')
        
        const transactionData = {
          transactionId: generateTransactionId(),
          merchantId: passport.data.goselId,
          merchantName: passport.data.merchantName,
          amount: parseFloat(paymentData.amount),
          currency: paymentData.currency,
          description: paymentData.description,
          customerEmail: paymentData.customerEmail,
          paymentMethod: paymentData.paymentMethod,
          route: mockRoutes[0],
          status: 'completed',
          failoverUsed: false,
          processingTime: 1200,
          fee: parseFloat(paymentData.amount) * 0.029
        }
        
        setPaymentResult(transactionData)
        
        // Add to ledger
        const signature = generateSignature(transactionData)
        addLedgerEntry({
          type: 'payment',
          data: transactionData,
          signature
        })
        
      } else {
        // Primary route failed - try fallback
        setCurrentStep('Primary route failed. Trying fallback...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Fallback route (90% success rate)
        const fallbackSuccess = Math.random() > 0.1
        
        if (fallbackSuccess) {
          setCurrentStep('Fallback successful!')
          
          const transactionData = {
            transactionId: generateTransactionId(),
            merchantId: passport.data.goselId,
            merchantName: passport.data.merchantName,
            amount: parseFloat(paymentData.amount),
            currency: paymentData.currency,
            description: paymentData.description,
            customerEmail: paymentData.customerEmail,
            paymentMethod: paymentData.paymentMethod,
            route: mockRoutes[1],
            status: 'completed',
            failoverUsed: true,
            processingTime: 2800,
            fee: parseFloat(paymentData.amount) * 0.031
          }
          
          setPaymentResult(transactionData)
          
          // Add to ledger
          const signature = generateSignature(transactionData)
          addLedgerEntry({
            type: 'payment',
            data: transactionData,
            signature
          })
          
        } else {
          // Both routes failed
          setCurrentStep('Payment failed')
          
          const transactionData = {
            transactionId: generateTransactionId(),
            merchantId: passport.data.goselId,
            merchantName: passport.data.merchantName,
            amount: parseFloat(paymentData.amount),
            currency: paymentData.currency,
            description: paymentData.description,
            customerEmail: paymentData.customerEmail,
            paymentMethod: paymentData.paymentMethod,
            route: null,
            status: 'failed',
            failoverUsed: true,
            processingTime: 3000,
            fee: 0,
            error: 'All routes failed'
          }
          
          setPaymentResult(transactionData)
          
          // Add to ledger
          const signature = generateSignature(transactionData)
          addLedgerEntry({
            type: 'payment',
            data: transactionData,
            signature
          })
        }
      }
      
    } catch (error) {
      console.error('Payment processing error:', error)
      setCurrentStep('Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    simulatePayment()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-lg text-gray-600">Loading payment system...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!passport) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Passport Required</h1>
            <p className="text-lg text-gray-600 mb-8">
              You need to complete onboarding before processing payments.
            </p>
            <Link
              to="/onboard"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Onboarding
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💳 Payment Processing
          </h1>
          <p className="text-lg text-gray-600">
            Smart routing with automatic fallback mechanisms
          </p>
        </div>

        {/* Merchant Info */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
              {passport.data.merchantName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {passport.data.merchantName}
              </h3>
              <p className="text-sm text-gray-600">
                Processing as: {passport.data.goselId}
              </p>
            </div>
          </div>
        </div>

        {/* Available Routes */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🛣️ Available Routes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRoutes.map((route, index) => (
              <div
                key={route.id}
                className={`border rounded-lg p-4 ${
                  index === 0 ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{route.icon}</span>
                    <h4 className="font-semibold text-gray-900">{route.psp}</h4>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    index === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {index === 0 ? 'Primary' : 'Fallback'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Success:</span>
                    <div className="font-medium">{route.successRate}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Latency:</span>
                    <div className="font-medium">{route.latency}ms</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Fee:</span>
                    <div className="font-medium">{route.cost}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Process Payment
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="100.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={paymentData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={paymentData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Payment for services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Email
              </label>
              <input
                type="email"
                name="customerEmail"
                value={paymentData.customerEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="customer@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={paymentData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="wallet">Digital Wallet</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={processing || !paymentData.amount}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                processing || !paymentData.amount
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {processing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="mr-2">💳</span>
                  Process Payment
                </>
              )}
            </button>
          </form>
        </div>

        {/* Processing Status */}
        {processing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="animate-spin text-2xl mr-3">⏳</div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Processing Payment</h3>
                <p className="text-blue-800">{currentStep}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Result */}
        {paymentResult && (
          <div className={`rounded-lg p-6 mb-8 ${
            paymentResult.status === 'completed' 
              ? 'bg-success-50 border border-success-200' 
              : 'bg-error-50 border border-error-200'
          }`}>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">
                {paymentResult.status === 'completed' ? '✅' : '❌'}
              </span>
              <h3 className={`text-lg font-semibold ${
                paymentResult.status === 'completed' ? 'text-success-800' : 'text-error-800'
              }`}>
                Payment {paymentResult.status === 'completed' ? 'Successful' : 'Failed'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="font-mono text-sm">{paymentResult.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold">{paymentResult.amount} {paymentResult.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Processing Time</p>
                <p className="font-semibold">{paymentResult.processingTime}ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fee</p>
                <p className="font-semibold">{paymentResult.fee.toFixed(2)} {paymentResult.currency}</p>
              </div>
            </div>
            
            {paymentResult.failoverUsed && (
              <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-800">
                  ⚠️ Fallback route was used due to primary route failure
                </p>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <Link
                to={`/ledger/${paymentResult.transactionId}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View Transaction on Ledger →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments 