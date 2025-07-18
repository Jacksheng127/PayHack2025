import React from 'react'

const ChartCard = ({ title, children }) => {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div className="chart-container">
        {children}
      </div>
    </div>
  )
}

export default ChartCard
