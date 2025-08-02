import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

interface PayInProps {
    title: string;
    count: number;
    payInData: any[];
}

const PayIn: React.FC<PayInProps> = ({ title, count, payInData }) => {
    return (
         <div className="pay-card">
            <div className="pay-header">
            <span className="pay-title">{title}</span>
            <span className="pay-count">{count.toLocaleString()}</span>
            </div>
            <div className="pay-chart">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                data={payInData} 
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barCategoryGap="10%"
                barGap={2}
                >
                <Bar 
                    dataKey="value" 
                    fill="#4285f4" 
                    radius={[2, 2, 0, 0]}
                />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    hide 
                />
                <YAxis hide />
                </BarChart>
            </ResponsiveContainer>
            </div>
            <div className="flow-metrics">
            <div className="flow-item">
                <div className="flow-value">$456K</div>
                <div className="flow-label">VOLUME</div>
            </div>
            <div className="flow-item">
                <div className="flow-value">2.1%</div>
                <div className="flow-label">CHANGE</div>
            </div>
            <div className="flow-item">
                <div className="flow-value">98.5%</div>
                <div className="flow-label">SUCCESS</div>
            </div>
            </div>
        </div>
    )
}
        
export default PayIn;