import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLatestEntry } from '../utils/mockLedger'
import LedgerViewer from '../components/LedgerViewer'

const Passport = () => {
  const [passport, setPassport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const latestPassport = getLatestEntry('passport')
      setPassport(latestPassport)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const getBankIcon = (bankId) => {
    const bankIcons = {
      'digital-bank-a': '🏦',
      'fintech-bank-b': '💳',
      'crypto-bank-c': '₿',
      'traditional-bank-d': '🏛️'
    }
    return bankIcons[bankId] || '🏦'
  }

  const getBankName = (bankId) => {
    const bankNames = {
      'digital-bank-a': 'Digital Bank A',
      'fintech-bank-b': 'FinTech Bank B',
      'crypto-bank-c': 'Crypto Bank C',
      'traditional-bank-d': 'Traditional Bank D'
    }
    return bankNames[bankId] || bankId
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-lg text-gray-600">Loading your merchant passport...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Passport Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              You haven't completed the onboarding process yet.
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
            🛂 Merchant Passport
          </h1>
          <p className="text-lg text-gray-600">
            Your verified digital identity on the GOSEL network
          </p>
        </div>

        {/* Passport Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {passport.data.merchantName.charAt(0)}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-900">{passport.data.merchantName}</h2>
                  <p className="text-gray-600">{passport.data.businessType}</p>
                  <div className="flex items-center mt-2">
                    <span className="status-chip status-verified">
                      ✅ Verified
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatTimestamp(passport.timestamp)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GOSEL ID
                </label>
                <div className="flex items-center">
                  <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono flex-1">
                    {passport.data.goselId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(passport.data.goselId)}
                    className="ml-2 text-primary-600 hover:text-primary-700"
                  >
                    {copied ? '✅' : '📋'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                  {passport.data.registrationNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verifying Bank
                </label>
                <div className="flex items-center">
                  <span className="text-xl mr-2">
                    {getBankIcon(passport.data.verifyingBank)}
                  </span>
                  <span className="text-sm font-medium">
                    {getBankName(passport.data.verifyingBank)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Level
                </label>
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                  {passport.data.verificationLevel}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                  {passport.data.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
                  {passport.data.phone}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/ledger/${passport.id}`}
                  className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="mr-2">🔍</span>
                  View on Ledger
                </Link>
                <Link
                  to="/integrate"
                  className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <span className="mr-2">🔗</span>
                  Connect to PSPs
                </Link>
                <Link
                  to="/payments"
                  className="flex items-center justify-center px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
                >
                  <span className="mr-2">💳</span>
                  Start Processing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Preview */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            📦 Blockchain Record
          </h3>
          <LedgerViewer entry={passport} />
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Benefits of Your GOSEL Passport
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                ⚡
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Verification</h4>
              <p className="text-sm text-gray-600">
                No need to repeat KYB process with different PSPs
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                🔐
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure & Trusted</h4>
              <p className="text-sm text-gray-600">
                Blockchain-backed credentials that can't be forged
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                🌐
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Universal Access</h4>
              <p className="text-sm text-gray-600">
                Use your passport across the entire GOSEL network
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Passport 