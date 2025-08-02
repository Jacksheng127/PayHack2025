import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

interface PayOutProps {
    title: string;
    count: number;
    payOutData: any[];
}

const PayOut: React.FC<PayOutProps> = ({ title, count, payOutData }) => {
    return (
        <div className="pay-card">
            <div className="pay-header">
            <span className="pay-title">{title}</span>
            <span className="pay-count">{count}</span>
            </div>
            <div className="pay-chart">
            <ResponsiveContainer width="100%" height={80}>
                <LineChart data={payOutData}>
                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4285f4" 
                    strokeWidth={3}
                    dot={false}
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
                <YAxis hide />
                </LineChart>
            </ResponsiveContainer>
            </div>
            <div className="flow-metrics">
            <div className="flow-item">
                <div className="flow-value">$321K</div>
                <div className="flow-label">VOLUME</div>
            </div>
            <div className="flow-item">
                <div className="flow-value">-1.3%</div>
                <div className="flow-label">CHANGE</div>
            </div>
            <div className="flow-item">
                <div className="flow-value">99.1%</div>
                <div className="flow-label">SUCCESS</div>
            </div>
            </div>
        </div>
    )
}

export default PayOut;