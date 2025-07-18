import React from 'react';
import { Box } from '@mui/material';
import KpiCard from './KpiCard';
import TransactionVolumeChart from './TransactionVolumeChart';
import FxRateProviderList from './FxRateProviderList';
// import BlockExplorer from './BlockExplorer';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 200px' }}>
          <KpiCard title="System Uptime" value="99.99%" change="+0.01%" changeColor="green" />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <KpiCard title="Total Transactions" value="23,436" change="+5.2%" changeColor="green" />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <KpiCard title="Fallback Events" value="46" change="-2.1%" changeColor="red" />
        </Box>
        <Box sx={{ flex: '1 1 200px' }}>
          <KpiCard title="Avg. TXN Time" value="1.2s" change="+0.1s" changeColor="red" />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TransactionVolumeChart />
      </Box>
      <Box sx={{ mb: 3 }}>
        <FxRateProviderList />
      </Box>
      {/* BlockExplorer removed */}
    </Box>
  );
};

export default Dashboard; 