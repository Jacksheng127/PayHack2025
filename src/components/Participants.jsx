import React, { useState } from 'react'

const Participants = () => {
  const [activeTab, setActiveTab] = useState('all-participants')
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: ''
  })

  const mockParticipants = [
    {
      name: 'Maybank',
      type: 'Bank',
      country: 'Malaysia',
      status: 'Active',
      integrationDate: '2023-01-15',
      successRate: '99.8%'
    },
    {
      name: 'DBS',
      type: 'Bank',
      country: 'Singapore',
      status: 'Active',
      integrationDate: '2023-02-20',
      successRate: '99.5%'
    },
    {
      name: 'Touch n Go',
      type: 'PSP',
      country: 'Malaysia',
      status: 'Active',
      integrationDate: '2023-03-10',
      successRate: '99.2%'
    },
    {
      name: 'GrabPay',
      type: 'PSP',
      country: 'Multi-region',
      status: 'Active',
      integrationDate: '2023-01-30',
      successRate: '98.9%'
    },
    {
      name: 'SWIFT',
      type: 'Network',
      country: 'Global',
      status: 'Active',
      integrationDate: '2023-01-01',
      successRate: '99.9%'
    }
  ]

  const countryData = [
    {
      country: 'Malaysia',
      flag: '🇲🇾',
      participants: [
        { name: 'Maybank', type: 'Bank', status: 'Active' },
        { name: 'AmBank', type: 'Bank', status: 'Active' },
        { name: 'Touch n Go', type: 'PSP', status: 'Active' },
        { name: 'Boost', type: 'PSP', status: 'Onboarding' }
      ]
    },
    {
      country: 'Singapore',
      flag: '🇸🇬',
      participants: [
        { name: 'DBS', type: 'Bank', status: 'Active' },
        { name: 'UOB', type: 'Bank', status: 'Active' },
        { name: 'OCBC', type: 'Bank', status: 'Active' }
      ]
    },
    {
      country: 'Thailand',
      flag: '🇹🇭',
      participants: [
        { name: 'Bangkok Bank', type: 'Bank', status: 'Active' },
        { name: 'Kasikornbank', type: 'Bank', status: 'Active' },
        { name: 'TrueMoney', type: 'PSP', status: 'Active' }
      ]
    }
  ]

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const renderAllParticipants = () => (
    <div>
      <div className="participant-filters">
        <input 
          type="text" 
          placeholder="Search participants..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <select 
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="bank">Banks</option>
          <option value="psp">PSPs</option>
          <option value="network">Payment Networks</option>
        </select>
        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="onboarding">Onboarding</option>
        </select>
      </div>

      <div className="participant-list">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Country</th>
              <th>Status</th>
              <th>Integration Date</th>
              <th>Success Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockParticipants.map((participant, index) => (
              <tr key={index}>
                <td>{participant.name}</td>
                <td>{participant.type}</td>
                <td>{participant.country}</td>
                <td>
                  <span className={`status ${participant.status.toLowerCase()}`}>
                    {participant.status}
                  </span>
                </td>
                <td>{participant.integrationDate}</td>
                <td>{participant.successRate}</td>
                <td>
                  <button className="btn outline">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderByCountry = () => (
    <div className="country-list">
      {countryData.map((country, index) => (
        <div key={index} className="country-card">
          <h3>
            <span className="country-flag">{country.flag}</span>
            {country.country}
          </h3>
          <div className="participants">
            {country.participants.map((participant, pIndex) => (
              <div key={pIndex} className="participant-item">
                <span>{participant.name}</span>
                <span className="type">{participant.type}</span>
                <span className={`status ${participant.status.toLowerCase()}`}>
                  {participant.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderPerformance = () => (
    <div className="charts-container">
      <div className="chart-card">
        <h3>Top Performing PSPs</h3>
        <div style={{ 
          height: '300px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#64748b'
        }}>
          PSP Performance Chart (Chart.js Integration)
        </div>
      </div>
      <div className="chart-card">
        <h3>Latency by Participant</h3>
        <div style={{ 
          height: '300px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#64748b'
        }}>
          Latency Chart (Chart.js Integration)
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <h2>Participants Management</h2>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'all-participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('all-participants')}
        >
          All Participants
        </button>
        <button 
          className={`tab ${activeTab === 'by-country' ? 'active' : ''}`}
          onClick={() => setActiveTab('by-country')}
        >
          By Country
        </button>
        <button 
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
      </div>

      {activeTab === 'all-participants' && renderAllParticipants()}
      {activeTab === 'by-country' && renderByCountry()}
      {activeTab === 'performance' && renderPerformance()}
    </div>
  )
}

export default Participants
