import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEntryById, getAllEntries } from '../utils/mockLedger'
import LedgerViewer from '../components/LedgerViewer'

const Ledger = () => {
  const { id } = useParams()
  const [entry, setEntry] = useState(null)
  const [allEntries, setAllEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('single') // 'single' or 'all'

  useEffect(() => {
    const timer = setTimeout(() => {
      if (id) {
        const foundEntry = getEntryById(id)
        setEntry(foundEntry)
        setViewMode('single')
      } else {
        setViewMode('all')
      }
      
      const entries = getAllEntries()
      setAllEntries(entries)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [id])

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'passport':
        return 'bg-blue-100 text-blue-800'
      case 'payment':
        return 'bg-green-100 text-green-800'
      case 'integration':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'passport':
        return '🛂'
      case 'payment':
        return '💳'
      case 'integration':
        return '🔗'
      default:
        return '📄'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-lg text-gray-600">Loading ledger data...</p>
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
            📦 Blockchain Ledger
          </h1>
          <p className="text-lg text-gray-600">
            Immutable record of all GOSEL network activities
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-1 flex">
            <button
              onClick={() => setViewMode('single')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'single'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Single Entry
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Entries
            </button>
          </div>
        </div>

        {/* Single Entry View */}
        {viewMode === 'single' && (
          <div>
            {id && !entry ? (
              <div className="text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Entry Not Found</h2>
                <p className="text-lg text-gray-600 mb-8">
                  The ledger entry with ID "{id}" could not be found.
                </p>
                <button
                  onClick={() => setViewMode('all')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  View All Entries
                </button>
              </div>
            ) : entry ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getTypeIcon(entry.type)}</span>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Ledger Entry Details
                    </h2>
                  </div>
                  <button
                    onClick={() => setViewMode('all')}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View All Entries
                  </button>
                </div>
                <LedgerViewer entry={entry} showFullDetails={true} />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select an Entry</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Choose an entry from the list below to view its details.
                </p>
                <button
                  onClick={() => setViewMode('all')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  View All Entries
                </button>
              </div>
            )}
          </div>
        )}

        {/* All Entries View */}
        {viewMode === 'all' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                All Ledger Entries ({allEntries.length})
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Latest block: #{allEntries[0]?.blockNumber || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Network Active
                </div>
              </div>
            </div>

            {allEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Entries Yet</h3>
                <p className="text-lg text-gray-600 mb-8">
                  Start by onboarding a merchant to create your first ledger entry.
                </p>
                <Link
                  to="/onboard"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Start Onboarding
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {allEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getTypeIcon(entry.type)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {entry.type === 'passport' && `Merchant: ${entry.data.merchantName}`}
                            {entry.type === 'payment' && `Payment: ${entry.data.amount} ${entry.data.currency}`}
                            {entry.type === 'integration' && `Integration: ${entry.data.pspName}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {formatTimestamp(entry.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(entry.type)}`}>
                          {entry.type}
                        </div>
                        <div className="text-sm text-gray-500">
                          Block #{entry.blockNumber}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Entry ID:</span>
                        <div className="font-mono text-sm text-gray-900 truncate">
                          {entry.id}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Transaction Hash:</span>
                        <div className="font-mono text-sm text-gray-900 truncate">
                          {entry.transactionHash}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Signature:</span>
                        <div className="font-mono text-sm text-gray-900 truncate">
                          {entry.signature}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Verified
                          </div>
                          <div className="text-sm text-gray-500">
                            Immutable Record
                          </div>
                        </div>
                        <Link
                          to={`/ledger/${entry.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ledger Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Ledger Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {allEntries.filter(e => e.type === 'passport').length}
              </div>
              <div className="text-sm text-gray-600">Merchant Passports</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {allEntries.filter(e => e.type === 'payment').length}
              </div>
              <div className="text-sm text-gray-600">Payment Transactions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {allEntries.filter(e => e.type === 'integration').length}
              </div>
              <div className="text-sm text-gray-600">PSP Integrations</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {allEntries.length}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
          </div>
        </div>

        {/* Blockchain Info */}
        <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            🔗 Blockchain Network Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="opacity-75">Network:</span>
              <div className="font-semibold">GOSEL Testnet</div>
            </div>
            <div>
              <span className="opacity-75">Consensus:</span>
              <div className="font-semibold">Proof of Authority</div>
            </div>
            <div>
              <span className="opacity-75">Block Time:</span>
              <div className="font-semibold">~2 seconds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ledger 