import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Tooltip, IconButton } from '@mui/material';
import { ContentCopy, OpenInNew } from '@mui/icons-material';
import BlockExplorer from '../components/BlockExplorer';
import './BlockExplorerPage.css';

// Mock stats for the summary section
const ledgerStats = {
  totalBlocks: 35,
  totalTransactions: 42,
  lastBlockTime: '5:42:26 PM',
  avgBlockTime: '2.3s',
  networkHashRate: '1.2 TH/s',
};

// Enhanced mock blockchain data
const blockChain = [
  { 
    number: 3, 
    hash: 'b085a702ef24c9f8d2a8b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
    timestamp: '2024-01-15 14:35:20',
    txCount: 7,
    size: '2.3 KB',
    gasUsed: '84,532',
    validator: 'Validator_Node_1',
    difficulty: '15.2T'
  },
  { 
    number: 2, 
    hash: '6e212633a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
    timestamp: '2024-01-15 14:35:18',
    txCount: 12,
    size: '4.1 KB',
    gasUsed: '156,734',
    validator: 'Validator_Node_2',
    difficulty: '15.1T'
  },
  { 
    number: 1, 
    hash: '886d9960f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    timestamp: '2024-01-15 14:35:16',
    txCount: 5,
    size: '1.8 KB',
    gasUsed: '67,891',
    validator: 'Validator_Node_3',
    difficulty: '15.0T'
  },
];

const BlockExplorerPage: React.FC = () => {
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash: string) => `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;

  return (
    <Box>
      {/* Enhanced Summary Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ bgcolor: '#23272f', color: '#fff', flex: '1 1 200px', minWidth: 180 }}>
          <CardContent>
            <Typography variant="subtitle2" color="#bbb">Total Blocks</Typography>
            <Typography variant="h5" fontWeight={700}>{ledgerStats.totalBlocks}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#23272f', color: '#fff', flex: '1 1 200px', minWidth: 180 }}>
          <CardContent>
            <Typography variant="subtitle2" color="#bbb">Total Transactions</Typography>
            <Typography variant="h5" fontWeight={700}>{ledgerStats.totalTransactions}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#23272f', color: '#fff', flex: '1 1 200px', minWidth: 180 }}>
          <CardContent>
            <Typography variant="subtitle2" color="#bbb">Last Block Time</Typography>
            <Typography variant="h5" fontWeight={700}>{ledgerStats.lastBlockTime}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#23272f', color: '#fff', flex: '1 1 200px', minWidth: 180 }}>
          <CardContent>
            <Typography variant="subtitle2" color="#bbb">Avg Block Time</Typography>
            <Typography variant="h5" fontWeight={700}>{ledgerStats.avgBlockTime}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#23272f', color: '#fff', flex: '1 1 200px', minWidth: 180 }}>
          <CardContent>
            <Typography variant="subtitle2" color="#bbb">Network Hash Rate</Typography>
            <Typography variant="h5" fontWeight={700}>{ledgerStats.networkHashRate}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Enhanced Blockchain Visualization */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 3, color: 'white', fontWeight: 700 }}>
            Latest Blocks
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 3,
            flexWrap: 'wrap',
            py: 2
          }}>
            {blockChain.map((block, idx) => (
              <React.Fragment key={block.hash}>
                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Block #{block.number}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Hash: {truncateHash(block.hash)}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Timestamp: {block.timestamp}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Transactions: {block.txCount}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Size: {block.size}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Gas Used: {block.gasUsed}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Validator: {block.validator}
                      </Typography>
                      <Typography variant="body2">
                        Difficulty: {block.difficulty}
                      </Typography>
                    </Box>
                  }
                  placement="top"
                  arrow
                >
                  <Card
                    sx={{
                      bgcolor: hoveredBlock === block.number ? '#4dabf7' : '#ffffff',
                      color: hoveredBlock === block.number ? '#fff' : '#333',
                      minWidth: 280,
                      maxWidth: 300,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: hoveredBlock === block.number ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: hoveredBlock === block.number ? 
                        '0 8px 32px rgba(0,0,0,0.3)' : 
                        '0 4px 16px rgba(0,0,0,0.1)',
                      border: '2px solid',
                      borderColor: hoveredBlock === block.number ? '#fff' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredBlock(block.number)}
                    onMouseLeave={() => setHoveredBlock(null)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" fontWeight={700}>
                          Block #{block.number}
                        </Typography>
                        <Chip 
                          label={`${block.txCount} TXs`} 
                          size="small"
                          sx={{ 
                            bgcolor: hoveredBlock === block.number ? 'rgba(255,255,255,0.2)' : '#e3f2fd',
                            color: hoveredBlock === block.number ? '#fff' : '#1976d2'
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ 
                          fontFamily: 'monospace', 
                          fontSize: '0.75rem',
                          flex: 1,
                          opacity: 0.8
                        }}>
                          {truncateHash(block.hash)}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(block.hash)}
                          sx={{ ml: 1, color: 'inherit' }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.8 }}>
                        {block.timestamp}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Size: {block.size}
                        </Typography>
                        <IconButton size="small" sx={{ color: 'inherit' }}>
                          <OpenInNew fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Tooltip>
                
                {idx < blockChain.length - 1 && (
                                    <Box 
                    className="pulse-animation"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: '#ffffff',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    →
                  </Box>
                )}
              </React.Fragment>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Block Explorer Table */}
      <BlockExplorer />
      

    </Box>
  );
};

export default BlockExplorerPage; 