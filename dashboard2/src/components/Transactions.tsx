import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

const Transactions: React.FC = () => {
    const [data, setData] = useState([
        { name: 'Transaction A', value: 400 },
        { name: 'Transaction B', value: 300 },
        { name: 'Transaction C', value: 300 },
        { name: 'Transaction D', value: 200 },
        { name: 'Transaction E', value: 278 },
        { name: 'Transaction F', value: 189 },
    ]);
    
    return (
        <div className="transactions-section">
            <h2 className="section-title">Transactions Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#ffc658'} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Transactions;