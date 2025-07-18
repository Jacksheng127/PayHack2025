import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const mockFxRates = [
  { provider: 'Maybank', corridor: 'MYR/THB', buy: 8.05, sell: 8.07, lastUpdated: 'Just now' },
  { provider: 'HSBC', corridor: 'MYR/THB', buy: 8.04, sell: 8.06, lastUpdated: '1 min ago' },
  { provider: 'Wise', corridor: 'MYR/THB', buy: 8.055, sell: 8.06, lastUpdated: 'Just now' },
  { provider: 'Citibank', corridor: 'USD/MYR', buy: 4.68, sell: 4.70, lastUpdated: '2 mins ago' },
  { provider: 'Stripe', corridor: 'USD/MYR', buy: 4.67, sell: 4.69, lastUpdated: '30 secs ago' },
];

const FxRateProviderList: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Live FX Rates by Provider
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="fx rates table">
            <TableHead>
              <TableRow>
                <TableCell>Provider</TableCell>
                <TableCell>Corridor</TableCell>
                <TableCell align="right">Buy</TableCell>
                <TableCell align="right">Sell</TableCell>
                <TableCell>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockFxRates.map((row) => (
                <TableRow key={row.provider}>
                  <TableCell component="th" scope="row">
                    {row.provider}
                  </TableCell>
                  <TableCell>{row.corridor}</TableCell>
                  <TableCell align="right">{row.buy.toFixed(4)}</TableCell>
                  <TableCell align="right">{row.sell.toFixed(4)}</TableCell>
                  <TableCell>{row.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default FxRateProviderList; 