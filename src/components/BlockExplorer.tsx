import React, { useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Link } from '@mui/material';

// Mock data for the blockchain ledger
const createBlock = (height: number) => ({
  height,
  timestamp: new Date(Date.now() - height * 30000).toLocaleString(),
  txCount: Math.floor(Math.random() * 10) + 1,
  proposer: `Validator_Node_${(height % 4) + 1}`,
  hash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
});

const mockBlocks = Array.from({ length: 100 }, (_, i) => createBlock(100 - i));

const BlockExplorer: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Ledger Block Explorer
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="block explorer table">
            <TableHead>
              <TableRow>
                <TableCell>Height</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Transactions</TableCell>
                <TableCell>Proposer</TableCell>
                <TableCell>Block Hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((block) => (
                <TableRow key={block.height}>
                  <TableCell>
                    <Link href="#" underline="hover">{block.height}</Link>
                  </TableCell>
                  <TableCell>{block.timestamp}</TableCell>
                  <TableCell>{block.txCount}</TableCell>
                  <TableCell>{block.proposer}</TableCell>
                  <TableCell>
                    <Link href="#" underline="hover">{`${block.hash.substring(0, 10)}...${block.hash.substring(54)}`}</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockBlocks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default BlockExplorer; 