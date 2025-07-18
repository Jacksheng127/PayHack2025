import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  changeColor: 'green' | 'red';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeColor }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: changeColor, fontWeight: 'bold' }}>
            {change}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KpiCard; 