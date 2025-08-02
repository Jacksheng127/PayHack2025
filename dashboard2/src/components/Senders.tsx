import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

const Senders: React.FC = () => {
    const [data, setData] = useState([
        { name: 'Sender A', value: 400 },
        { name: 'Sender B', value: 300 },
        { name: 'Sender C', value: 300 },
        { name: 'Sender D', value: 200 },
        { name: 'Sender E', value: 278 },
        { name: 'Sender F', value: 189 },
    ]);
    
    return (
        <div className="senders-section">
            <h2 className="section-title">Senders Overview</h2>
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