import React from 'react'

const PSPCard = ({ psp, onConnect, isConnecting }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-success-50 text-success-700 border-success-200'
      case 'pending':
        return 'bg-warning-50 text-warning-700 border-warning-200'
      case 'failed':
        return 'bg-error-50 text-error-700 border-error-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return '✅'
      case 'pending':
        return '⏳'
      case 'failed':
        return '❌'
      default:
        return '🔗'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">{psp.icon}</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{psp.name}</h3>
              <p className="text-sm text-gray-600">{psp.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(psp.status)}`}>
            <span className="mr-1">{getStatusIcon(psp.status)}</span>
            {psp.status || 'Available'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{psp.successRate}%</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{psp.latency}ms</div>
            <div className="text-xs text-gray-500">Avg Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{psp.fxRate}</div>
            <div className="text-xs text-gray-500">FX Rate</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Features</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {psp.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onConnect(psp)}
          disabled={isConnecting || psp.status === 'connected'}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            psp.status === 'connected'
              ? 'bg-success-100 text-success-700 cursor-not-allowed'
              : isConnecting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500'
          }`}
        >
          {isConnecting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Connecting...
            </>
          ) : psp.status === 'connected' ? (
            <>
              <span className="mr-2">✅</span>
              Connected
            </>
          ) : (
            <>
              <span className="mr-2">🔗</span>
              Connect
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default PSPCard 