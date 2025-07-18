import React from 'react';
import { Card, Typography, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
    <Card sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      mb: 4, 
      color: 'white',
      background: 'linear-gradient(135deg, #845eee 0%, #63a4ff 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -70,
        left: -30,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.15)',
      }} />

      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', position: 'relative' }}>
        Phase 1: Orchestration Dashboard
      </Typography>
      <Typography variant="body1" sx={{ position: 'relative' }}>
        Welcome to the Global Orchestration & Settlement Layer
      </Typography>
    </Card>
  );
};

export default Header; 