import React, { useEffect, useState } from 'react'
import StatsCard from './StatsCard'
import ChartCard from './ChartCard'
import TransactionVolumeChart from './charts/TransactionVolumeChart'
import SuccessRateChart from './charts/SuccessRateChart'
import FallbackRateChart from './charts/FallbackRateChart'

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const statsData = [
    {
      icon: 'fas fa-exchange-alt',
      title: 'Total Transactions (24h)',
      value: '24,857',
      change: '+12.5%',
      isPositive: true
    },
    {
      icon: 'fas fa-dollar-sign',
      title: 'Transaction Value (24h)',
      value: '$4.28M',
      change: '+8.3%',
      isPositive: true
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Success Rate',
      value: '99.7%',
      change: '+0.2%',
      isPositive: true
    },
    {
      icon: 'fas fa-bolt',
      title: 'Avg. Transaction Speed',
      value: '1.2s',
      change: '+0.1s',
      isPositive: false
    }
  ]

  const uptimeBars = [
    'up', 'up', 'up', 'up', 'up', 'partial', 'up', 'up', 'up', 'up', 'up', 'up', 'up', 'up'
  ]

  return (
    <div className="page">
      <h2>System Overview</h2>
      <div className="date-time">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
      
      <div className="stats-cards">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="charts-container">
        <ChartCard title="Transaction Volume (24h)">
          <TransactionVolumeChart />
        </ChartCard>
        <ChartCard title="Success Rate by Origin">
          <SuccessRateChart />
        </ChartCard>
      </div>

      <div className="charts-container">
        <ChartCard title="Fallback Rerouting Rate">
          <div className="metric-display">
            <div className="metric-value">2.3%</div>
            <div className="metric-chart">
              <FallbackRateChart />
            </div>
          </div>
        </ChartCard>
        <ChartCard title="System Uptime">
          <div className="metric-display">
            <div className="metric-value">99.998%</div>
            <div className="uptime-bars">
              {uptimeBars.map((status, index) => (
                <div key={index} className={`uptime-bar ${status}`}></div>
              ))}
            </div>
            <div className="uptime-legend">
              <span>Last 14 days</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}

export default Dashboard
