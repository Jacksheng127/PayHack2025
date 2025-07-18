import React from 'react'

const Security = () => {
  const complianceData = [
    {
      title: 'OFAC List',
      status: 'green',
      icon: 'fas fa-check',
      lastUpdated: '2 hours ago'
    },
    {
      title: 'EU Sanctions',
      status: 'green',
      icon: 'fas fa-check',
      lastUpdated: '4 hours ago'
    },
    {
      title: 'UN Sanctions',
      status: 'green',
      icon: 'fas fa-check',
      lastUpdated: '6 hours ago'
    },
    {
      title: 'Local Currency Controls',
      status: 'yellow',
      icon: 'fas fa-exclamation',
      lastUpdated: '2 pending updates'
    }
  ]

  const accessLogs = [
    {
      time: '14:32:18',
      user: 'admin@gosel.com',
      action: 'Login',
      resource: 'Dashboard',
      ipAddress: '192.168.1.100',
      status: 'Success'
    },
    {
      time: '14:28:05',
      user: 'operator@gosel.com',
      action: 'View Transactions',
      resource: 'Transaction History',
      ipAddress: '192.168.1.101',
      status: 'Success'
    },
    {
      time: '14:15:42',
      user: 'admin@gosel.com',
      action: 'Export Data',
      resource: 'Participant List',
      ipAddress: '192.168.1.100',
      status: 'Success'
    },
    {
      time: '14:10:37',
      user: 'unknown@external.com',
      action: 'Failed Login',
      resource: 'Dashboard',
      ipAddress: '203.45.67.89',
      status: 'Failed'
    },
    {
      time: '14:05:22',
      user: 'supervisor@gosel.com',
      action: 'Modify Settings',
      resource: 'System Configuration',
      ipAddress: '192.168.1.102',
      status: 'Success'
    }
  ]

  return (
    <div className="page">
      <h2>Security & Compliance</h2>
      
      <div className="charts-container">
        <div className="chart-card">
          <h3>Sanctions & Compliance Checks</h3>
          <div className="compliance-status">
            {complianceData.map((item, index) => (
              <div key={index} className="status-item">
                <div className={`status-icon ${item.status}`}>
                  <i className={item.icon}></i>
                </div>
                <div className="status-info">
                  <h4>{item.title}</h4>
                  <p>Last updated: {item.lastUpdated}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Data Residency & Privacy Controls</h3>
          <div 
            className="data-residency-map" 
            style={{ 
              width: '100%', 
              height: '300px', 
              backgroundColor: '#f0f4f8', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              marginBottom: '15px'
            }}
          >
            Data Residency Map (D3.js Integration)
          </div>
          <div className="data-residency-legend">
            <div className="legend-item">
              <span className="color-box primary"></span> Primary Data Storage
            </div>
            <div className="legend-item">
              <span className="color-box secondary"></span> Secondary Data Storage
            </div>
            <div className="legend-item">
              <span className="color-box transit"></span> Data in Transit
            </div>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Access Control Logs</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Resource</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.time}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.resource}</td>
                  <td>{log.ipAddress}</td>
                  <td>
                    <span className={`status ${log.status.toLowerCase()}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Security
