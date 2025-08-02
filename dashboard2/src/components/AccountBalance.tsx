import React from 'react';
import {AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

interface AccountBalanceProps {
    chartTitle: string;
    chartValue: number;
    balanceData: any[];
}

const AccountBalance: React.FC<AccountBalanceProps> = ({ chartTitle, chartValue, balanceData }) => {
    return(
        <div className="chart-card">
            <div className="chart-header">
                <span className="chart-title">{chartTitle}</span>
                <span className="chart-value">${chartValue}</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={balanceData}>
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4285f4" 
                    fill="rgba(66, 133, 244, 0.1)"
                    strokeWidth={4}
                />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                />
                <YAxis hide />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
};

export default AccountBalance;