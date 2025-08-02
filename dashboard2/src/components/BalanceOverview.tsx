import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

interface BalanceOverviewProps {
    balanceTitle: string;
    balanceAmount: string;
    balanceOverviewData: any[];
}

const BalanceOverview: React.FC<BalanceOverviewProps> = ({ balanceTitle, balanceAmount, balanceOverviewData }) => {
    return (
        <div className="chart-card">
            <div className="balance-section">
                <div className="balance-header">
                <span className="balance-title">{balanceTitle}</span>
                <span className="balance-amount">{balanceAmount}</span>
                </div>
                <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={balanceOverviewData}>
                    <Area 
                    type="monotone" 
                    dataKey="checking" 
                    stackId="1"
                    stroke="#1a4f8a" 
                    fill="#1a4f8a"
                    />
                    <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stackId="1"
                    stroke="#2e7d32" 
                    fill="#2e7d32"
                    />
                    <Area 
                    type="monotone" 
                    dataKey="investment" 
                    stackId="1"
                    stroke="#4285f4" 
                    fill="#4285f4"
                    />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                    <YAxis hide />
                </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default BalanceOverview;
