import React, { useState } from 'react'

const LedgerViewer = ({ entry, showFullDetails = false }) => {
  const [copied, setCopied] = useState(false)
  
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

  if (!entry) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No entry found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getTypeIcon(entry.type)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ledger Entry
              </h3>
              <p className="text-sm text-gray-600">
                {formatTimestamp(entry.timestamp)}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(entry.type)}`}>
            {entry.type}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry ID
            </label>
            <div className="flex items-center">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 mr-2">
                {entry.id}
              </code>
              <button
                onClick={() => copyToClipboard(entry.id)}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                {copied ? '✅' : '📋'}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Block Number
            </label>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded block">
              #{entry.blockNumber}
            </code>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Hash
          </label>
          <div className="flex items-center">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 mr-2 break-all">
              {entry.transactionHash}
            </code>
            <button
              onClick={() => copyToClipboard(entry.transactionHash)}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              {copied ? '✅' : '📋'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Digital Signature
          </label>
          <div className="flex items-center">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1 mr-2 break-all">
              {entry.signature}
            </code>
            <button
              onClick={() => copyToClipboard(entry.signature)}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              {copied ? '✅' : '📋'}
            </button>
          </div>
        </div>

        {showFullDetails && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Data
            </label>
            <div className="code-block overflow-x-auto">
              <pre className="text-sm">
                {JSON.stringify(entry.data, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">📦</span>
              Simulated Blockchain Entry
            </div>
            <div className="flex items-center text-sm text-green-600">
              <span className="mr-2">✅</span>
              Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LedgerViewer 