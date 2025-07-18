import React, { useState } from 'react'

const SmartRouting = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const pathMetrics = [
    {
      path: 'Maybank → DBS',
      latency: '180ms',
      successRate: '99.8%',
      reliabilityScore: '9.8',
      status: 'Active'
    },
    {
      path: 'TnG → GrabPay → DBS',
      latency: '350ms',
      successRate: '99.2%',
      reliabilityScore: '9.5',
      status: 'Active'
    },
    {
      path: 'AmBank → UOB',
      latency: '210ms',
      successRate: '99.5%',
      reliabilityScore: '9.7',
      status: 'Active'
    },
    {
      path: 'SWIFT → HSBC',
      latency: '450ms',
      successRate: '98.9%',
      reliabilityScore: '9.2',
      status: 'Fallback'
    }
  ]

  const fallbackLog = [
    {
      time: '14:32:18',
      originalPath: 'Maybank → DBS',
      fallbackPath: 'SWIFT → HSBC',
      reason: 'High latency detected',
      resolutionTime: '2.3s'
    },
    {
      time: '13:45:22',
      originalPath: 'TnG → GrabPay',
      fallbackPath: 'Maybank → DBS',
      reason: 'Connection timeout',
      resolutionTime: '1.8s'
    },
    {
      time: '12:28:15',
      originalPath: 'AmBank → UOB',
      fallbackPath: 'DBS → OCBC',
      reason: 'Rate limit exceeded',
      resolutionTime: '1.5s'
    }
  ]

  return (
    <div className="page">
      <h2>Smart Routing Engine Monitoring</h2>
      <div className="date-time">
        Last updated: {lastUpdated.toLocaleString()}
      </div>

      <div className="routing-map-container">
        <h3>Global Payment Network</h3>
        <div id="routing-map" style={{ 
          width: '100%', 
          height: '400px', 
          backgroundColor: '#f0f4f8', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: '16px'
        }}>
          Payment Network Visualization (D3.js Integration)
        </div>
        <div className="map-legend">
          <div className="legend-item">
            <span className="dot green"></span> Active PSP/Bank
          </div>
          <div className="legend-item">
            <span className="dot red"></span> Inactive PSP/Bank
          </div>
          <div className="legend-item">
            <span className="line solid"></span> Active Transaction Path
          </div>
          <div className="legend-item">
            <span className="line dashed"></span> Fallback Path
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Path Performance Metrics</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Latency</th>
                <th>Success Rate</th>
                <th>Reliability Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pathMetrics.map((metric, index) => (
                <tr key={index}>
                  <td>{metric.path}</td>
                  <td>{metric.latency}</td>
                  <td>{metric.successRate}</td>
                  <td>{metric.reliabilityScore}</td>
                  <td>
                    <span className={`status ${metric.status.toLowerCase()}`}>
                      {metric.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Fallback Events Log</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Original Path</th>
                <th>Fallback Path</th>
                <th>Reason</th>
                <th>Resolution Time</th>
              </tr>
            </thead>
            <tbody>
              {fallbackLog.map((log, index) => (
                <tr key={index}>
                  <td>{log.time}</td>
                  <td>{log.originalPath}</td>
                  <td>{log.fallbackPath}</td>
                  <td>{log.reason}</td>
                  <td>{log.resolutionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SmartRouting
