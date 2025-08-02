import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

interface GeographicDistributionProps {
    payTitle: string;
    payCount: number;
    geographicData: any[];
}

const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ payTitle, payCount, geographicData }) => {
    return (
        <div className="pay-card">
            <div className="pay-header">
            <span className="pay-title">{payTitle}</span>
            <span className="pay-count">{payCount}</span>
            </div>
            <div className="pay-chart">
            <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={geographicData}>
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4285f4" 
                    fill="rgba(66, 133, 244, 0.3)"
                    strokeWidth={2}
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                <YAxis hide />
                </AreaChart>
            </ResponsiveContainer>
            </div>
            
            <div className="city-metrics">
            <div className="city-item">
                <span className="city-name">London</span>
                <span className="city-value">2,345</span>
            </div>
            <div className="city-item">
                <span className="city-name">New York</span>
                <span className="city-value">1,876</span>
            </div>
            <div className="city-item">
                <span className="city-name">Singapore</span>
                <span className="city-value">1,234</span>
            </div>
            <div className="city-item">
                <span className="city-name">Tokyo</span>
                <span className="city-value">987</span>
            </div>
            </div>
        </div>
    )
}

export default GeographicDistribution;