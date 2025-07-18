import React from 'react'

const StatsCard = ({ icon, title, value, change, isPositive }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        <p className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {change} <i className={`fas fa-arrow-${isPositive ? 'up' : 'up'}`}></i>
        </p>
      </div>
    </div>
  )
}

export default StatsCard
