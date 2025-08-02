import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

interface AvailableFundsProps {
    chartTitle: string;
    chartValue: string;
    fundsData: { name: string; value: number; color: string; }[];
}

const AvailableFunds: React.FC<AvailableFundsProps> = ({ chartTitle, chartValue, fundsData }) => {
    return (
        <div className="chart-card">
            <div className="chart-header">
                <span className="chart-title">{chartTitle}</span>
                <span className="chart-value">{chartValue}</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                <Pie
                    data={fundsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {fundsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
            
            <div className="safeguarding-section">
                <div className="safeguarding-percentage">94.2%</div>
                <div className="safeguarding-label">Safeguarding Compliance</div>
            </div>
            </div>
    )
};

export default AvailableFunds;