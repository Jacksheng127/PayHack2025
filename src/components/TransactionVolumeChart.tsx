import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const data = [
  { name: '00:00', value: 800 },
  { name: '01:00', value: 1180 },
  { name: '02:00', value: 950 },
  { name: '03:00', value: 680 },
  { name: '04:00', value: 1280 },
  { name: '05:00', value: 1350 },
  { name: '06:00', value: 700 },
  { name: '07:00', value: 1100 },
  { name: '08:00', value: 900 },
  { name: '09:00', value: 650 },
  { name: '10:00', value: 1150 },
  { name: '11:00', value: 950 },
];

const TransactionVolumeChart: React.FC = () => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Transaction Volume (Last 24 Hours)
        </Typography>
        <Box sx={{ 
          height: 300, 
          display: 'flex', 
          alignItems: 'end', 
          justifyContent: 'space-between',
          gap: 1,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 1
        }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              flex: 1,
              gap: 1
            }}>
              <Box sx={{
                width: '80%',
                height: `${(item.value / maxValue) * 250}px`,
                backgroundColor: '#6a5af9',
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#4dabf7',
                  transform: 'scale(1.1)'
                }
              }} />
              <Typography variant="caption" color="text.secondary">
                {item.name}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionVolumeChart; 