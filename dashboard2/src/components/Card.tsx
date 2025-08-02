import React from 'react';
import '../styles/Dashboard.css';

const Card: React.FC<{ title: string; value: string; label: string }> = ({ title, value, label }) => {
    return(
        <div className="metric-card">
            <h3>{title}</h3>
            <div className="metric-value">{value}</div>
            <div className="metric-label">{label}</div>
        </div>
    )
};

export default Card;