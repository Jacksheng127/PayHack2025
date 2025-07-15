import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLatestEntry, addLedgerEntry } from '../utils/mockLedger'
import { generateSignature } from '../utils/generateSignature'
import PSPCard from '../components/PSPCard'

const Integrate = () => {
  const [passport, setPassport] = useState(null)
  const [psps, setPsps] = useState([])
  const [loading, setLoading] = useState(true)
  const [connectingPsp, setConnectingPsp] = useState(null)

  useEffect(() => {
    // Load passport and PSPs
    const timer = setTimeout(() => {
      const latestPassport = getLatestEntry('passport')
      setPassport(latestPassport)
      
      // Mock PSP data
      const mockPsps = [
        {
          id: 'psp-a',
          name: 'PayFlow PSP',
          icon: '💳',
          description: 'Global payment processing with 99.9% uptime',
          successRate: 98.5,
          latency: 120,
          fxRate: '1.02',
          features: ['Card Processing', 'Digital Wallets', 'Bank Transfers', 'Crypto'],
          status: null
        },
        {
          id: 'psp-b',
          name: 'SwiftPay Network',
          icon: '⚡',
          description: 'Lightning-fast transactions across 180+ countries',
          successRate: 97.8,
          latency: 85,
          fxRate: '1.01',
          features: ['SWIFT', 'Real-time Payments', 'FX Services', 'Compliance'],
          status: null
        },
        {
          id: 'psp-c',
          name: 'CryptoBridge',
          icon: '₿',
          description: 'Bridge between traditional and crypto payments',
          successRate: 96.2,
          latency: 200,
          fxRate: '1.03',
          features: ['Crypto Payments', 'DeFi Integration', 'Staking', 'NFTs'],
          status: null
        },
        {
          id: 'psp-d',
          name: 'RegionPay Africa',
          icon: '🌍',
          description: 'Specialized in African payment methods and compliance',
          successRate: 94.1,
          latency: 300,
          fxRate: '1.05',
          features: ['Mobile Money', 'Bank Transfers', 'Cash Payments', 'Remittance'],
          status: null
        }
      ]
      
      setPsps(mockPsps)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleConnect = async (psp) => {
    if (!passport) {
      alert('Please complete onboarding first')
      return
    }

    setConnectingPsp(psp.id)
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Randomly determine connection outcome
      const outcomes = ['connected', 'pending', 'failed']
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)]
      
      // Update PSP status
      setPsps(prevPsps => 
        prevPsps.map(p => 
          p.id === psp.id 
            ? { ...p, status: randomOutcome }
            : p
        )
      )
      
      // Create integration record
      const integrationData = {
        pspId: psp.id,
        pspName: psp.name,
        merchantId: passport.data.goselId,
        merchantName: passport.data.merchantName,
        passportId: passport.id,
        status: randomOutcome,
        features: psp.features,
        connectionType: 'passport_verification'
      }
      
      // Generate signature and add to ledger
      const signature = generateSignature(integrationData)
      addLedgerEntry({
        type: 'integration',
        data: integrationData,
        signature
      })
      
      console.log(`Integration with ${psp.name}: ${randomOutcome}`)
      
    } catch (error) {
      console.error('Connection failed:', error)
      
      // Update PSP status to failed
      setPsps(prevPsps => 
        prevPsps.map(p => 
          p.id === psp.id 
            ? { ...p, status: 'failed' }
            : p
        )
      )
    } finally {
      setConnectingPsp(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-lg text-gray-600">Loading PSP integrations...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!passport) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Passport Required</h1>
            <p className="text-lg text-gray-600 mb-8">
              You need to complete onboarding before connecting to PSPs.
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔗 PSP Integration
          </h1>
          <p className="text-lg text-gray-600">
            Connect with Payment Service Providers using your verified GOSEL passport
          </p>
        </div>

        {/* Passport Status */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                {passport.data.merchantName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {passport.data.merchantName}
                </h3>
                <p className="text-sm text-gray-600">
                  GOSEL ID: {passport.data.goselId}
                </p>
                <div className="flex items-center mt-1">
                  <span className="status-chip status-verified">
                    ✅ Verified
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/passport"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View Passport →
            </Link>
          </div>
        </div>

        {/* Integration Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Benefits of Using Your GOSEL Passport
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-3">
                ⚡
              </div>
              <span className="text-sm font-medium text-gray-700">
                Instant verification with PSPs
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm mr-3">
                🔐
              </div>
              <span className="text-sm font-medium text-gray-700">
                Secure credential sharing
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm mr-3">
                📄
              </div>
              <span className="text-sm font-medium text-gray-700">
                No repetitive KYB processes
              </span>
            </div>
          </div>
        </div>

        {/* PSP Cards */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Available Payment Service Providers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {psps.map((psp) => (
              <PSPCard
                key={psp.id}
                psp={psp}
                onConnect={handleConnect}
                isConnecting={connectingPsp === psp.id}
              />
            ))}
          </div>
        </div>

        {/* Connection Status Summary */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Connection Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {psps.filter(p => p.status === 'connected').length}
              </div>
              <div className="text-sm text-gray-600">Connected</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {psps.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {psps.filter(p => p.status === 'failed').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {psps.filter(p => !p.status).length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {psps.some(p => p.status === 'connected') && (
          <div className="mt-8 bg-success-50 border border-success-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-success-800 mb-2">
              🎉 Ready to Process Payments!
            </h3>
            <p className="text-success-700 mb-4">
              You've successfully connected to payment service providers. 
              You can now start processing payments with smart routing.
            </p>
            <Link
              to="/payments"
              className="bg-success-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-success-700 transition-colors"
            >
              Start Processing Payments
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Integrate 