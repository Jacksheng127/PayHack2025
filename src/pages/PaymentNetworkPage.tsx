import React from 'react';
import ReactFlow, { Background, Node, Edge, Position, MarkerType, useNodesState, useEdgesState, addEdge, Connection, Edge as EdgeType, NodeProps, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, Typography, Box, Chip, Paper, LinearProgress, Stack } from '@mui/material';
import { Circle, SignalCellular4Bar, SignalCellularConnectedNoInternet0Bar } from '@mui/icons-material';

// Custom Node Component with Health Indicators
const CustomNode: React.FC<NodeProps> = ({ id, data, selected, sourcePosition, targetPosition }) => {
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return '#4caf50';
    if (uptime >= 99.0) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box
      sx={{
        padding: 1,
        borderRadius: 1,
        border: selected ? '2px solid #1976d2' : '1px solid #ccc',
        backgroundColor: data.backgroundColor || '#fff',
        color: data.textColor || '#000',
        minWidth: 120,
        position: 'relative',
        boxShadow: selected ? '0 0 10px rgba(25, 118, 210, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Default Handles for non-hub nodes */}
      {id !== 'gosel' && (
        <>
          <Handle type="target" position={targetPosition || Position.Left} style={{ zIndex: 10, background: '#555' }} />
          <Handle type="source" position={sourcePosition || Position.Right} style={{ zIndex: 10, background: '#555' }} />
        </>
      )}

      {/* GOSEL Hub Specific Handles */}
      {id === 'gosel' && (
        <>
          <Handle type="target" position={Position.Left} id="duitnow-target" style={{ top: '33%', zIndex: 10, background: '#555' }} />
          <Handle type="target" position={Position.Left} id="fps-target" style={{ top: '66%', zIndex: 10, background: '#555' }} />
          <Handle type="target" position={Position.Right} id="promptpay-target" style={{ top: '50%', zIndex: 10, background: '#555' }} />
        </>
      )}
      
      {/* Health Status Indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <Circle 
          sx={{ 
            fontSize: 12, 
            color: getHealthColor(data.health || 'unknown'),
            animation: data.health === 'healthy' ? 'pulse 2s infinite' : 'none'
          }} 
        />
        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
          {data.health || 'Unknown'}
        </Typography>
      </Box>

      {/* Node Label */}
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 'bold', 
          textAlign: 'center',
          fontSize: '0.8rem'
        }}
      >
        {data.label}
      </Typography>

      {/* Uptime Indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
        {data.uptime >= 99.9 ? (
          <SignalCellular4Bar sx={{ fontSize: 14, color: getUptimeColor(data.uptime) }} />
        ) : (
          <SignalCellularConnectedNoInternet0Bar sx={{ fontSize: 14, color: getUptimeColor(data.uptime) }} />
        )}
        <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
          {data.uptime ? `${data.uptime}%` : 'N/A'}
        </Typography>
      </Box>

      {/* Additional Status Info */}
      {data.status && (
        <Chip 
          label={data.status} 
          size="small" 
          sx={{ 
            mt: 0.5, 
            fontSize: '0.6rem',
            height: 16,
            backgroundColor: data.status === 'Active' ? '#4caf50' : '#f44336',
            color: 'white'
          }} 
        />
      )}
    </Box>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  // Core Hub
  { 
    id: 'gosel', 
    position: { x: 400, y: 200 }, 
    data: { 
      label: 'GOSEL Hub',
      health: 'healthy',
      uptime: 99.99,
      status: 'Active',
      backgroundColor: '#00d4aa',
      textColor: '#000'
    }, 
    type: 'custom'
  },
  
  // National Networks
  { 
    id: 'duitnow', 
    position: { x: 200, y: 100 }, 
    data: { 
      label: 'DuitNow (MY)',
      health: 'healthy',
      uptime: 99.8,
      status: 'Active',
      backgroundColor: '#ff4757',
      textColor: '#fff'
    }, 
    type: 'custom', 
    sourcePosition: Position.Right, 
    targetPosition: Position.Left
  },
  { 
    id: 'promptpay', 
    position: { x: 600, y: 100 }, 
    data: { 
      label: 'PromptPay (TH)',
      health: 'warning',
      uptime: 99.2,
      status: 'Active',
      backgroundColor: '#3742fa',
      textColor: '#fff'
    }, 
    type: 'custom', 
    sourcePosition: Position.Left, 
    targetPosition: Position.Right
  },
  { 
    id: 'fps', 
    position: { x: 200, y: 300 }, 
    data: { 
      label: 'FPS (HK)',
      health: 'healthy',
      uptime: 99.9,
      status: 'Active',
      backgroundColor: '#ffa502',
      textColor: '#000'
    }, 
    type: 'custom', 
    sourcePosition: Position.Right, 
    targetPosition: Position.Left
  },
  
  // Malaysian Banks
  { 
    id: 'cimb', 
    position: { x: 0, y: 80 }, 
    data: { 
      label: 'CIMB',
      health: 'healthy',
      uptime: 99.7,
      status: 'Active',
      backgroundColor: '#ff6b6b',
      textColor: '#fff'
    }, 
    type: 'custom', 
    sourcePosition: Position.Right, 
    targetPosition: Position.Left
  },
  { 
    id: 'public_bank', 
    position: { x: 0, y: 130 }, 
    data: { 
      label: 'Public Bank',
      health: 'warning',
      uptime: 98.9,
      status: 'Active',
      backgroundColor: '#ff6b6b',
      textColor: '#fff'
    }, 
    type: 'custom', 
    sourcePosition: Position.Right, 
    targetPosition: Position.Left
  },
  
  // Thai Banks
  { 
    id: 'kasikorn', 
    position: { x: 800, y: 50 }, 
    data: { 
      label: 'Kasikorn Bank',
      health: 'healthy',
      uptime: 99.5,
      status: 'Active',
      backgroundColor: '#5f27cd',
      textColor: '#fff'
    }, 
    type: 'custom', 
    sourcePosition: Position.Left, 
    targetPosition: Position.Right
  },
  { 
    id: 'scb', 
    position: { x: 800, y: 150 }, 
    data: { 
      label: 'SCB',
      health: 'critical',
      uptime: 97.2,
      status: 'Maintenance',
      backgroundColor: '#5f27cd',
      textColor: '#fff'
    }, 
    type: 'custom', 
    sourcePosition: Position.Left, 
    targetPosition: Position.Right
  },
  
  // Hong Kong Banks
  { 
    id: 'hsbc_hk', 
    position: { x: 0, y: 350 }, 
    data: { 
      label: 'HSBC HK',
      health: 'healthy',
      uptime: 99.8,
      status: 'Active',
      backgroundColor: '#ff9ff3',
      textColor: '#000'
    }, 
    type: 'custom', 
    sourcePosition: Position.Right, 
    targetPosition: Position.Left
  }, 
];

const initialEdges: EdgeType[] = [
  { id: 'e-duitnow-gosel', source: 'duitnow', target: 'gosel', targetHandle: 'duitnow-target', type: 'smoothstep', animated: true, style: { stroke: '#ff4757', strokeWidth: 3 } },
  { id: 'e-promptpay-gosel', source: 'promptpay', target: 'gosel', targetHandle: 'promptpay-target', type: 'smoothstep', animated: true, style: { stroke: '#3742fa', strokeWidth: 3 } },
  { id: 'e-fps-gosel', source: 'fps', target: 'gosel', targetHandle: 'fps-target', type: 'smoothstep', animated: true, style: { stroke: '#ffa502', strokeWidth: 3 } },

  // Malaysian Banks to DuitNow
  { id: 'e-cimb-duitnow', source: 'cimb', target: 'duitnow', type: 'smoothstep', animated: true, style: { stroke: '#e63946', strokeWidth: 2, strokeDasharray: '4' } },
  { id: 'e-public-duitnow', source: 'public_bank', target: 'duitnow', type: 'smoothstep', animated: true, style: { stroke: '#e63946', strokeWidth: 2, strokeDasharray: '4' } },

  // Thai Banks to PromptPay
  { id: 'e-kasikorn-promptpay', source: 'kasikorn', target: 'promptpay', type: 'smoothstep', animated: true, style: { stroke: '#3b2eff', strokeWidth: 2, strokeDasharray: '4' } },
  { id: 'e-scb-promptpay', source: 'scb', target: 'promptpay', type: 'smoothstep', animated: true, style: { stroke: '#3b2eff', strokeWidth: 2, strokeDasharray: '4' } },

  // Hong Kong Banks to FPS
  { id: 'e-hsbc-fps', source: 'hsbc_hk', target: 'fps', type: 'smoothstep', animated: true, style: { stroke: '#ff6bcb', strokeWidth: 2, strokeDasharray: '4' } },
];

const mockRouteRanking = [
  { route: 'CIMB → DuitNow → GOSEL Hub', count: 1200 },
  { route: 'Public Bank → DuitNow → GOSEL Hub', count: 950 },
  { route: 'Kasikorn → PromptPay → GOSEL Hub', count: 800 },
  { route: 'SCB → PromptPay → GOSEL Hub', count: 600 },
  { route: 'HSBC HK → FPS → GOSEL Hub', count: 400 },
];
const maxCount = Math.max(...mockRouteRanking.map(r => r.count));

const PaymentNetworkPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Payment Network Visualization
        </Typography>
        <div style={{ height: 'calc(100vh - 300px)', background: '#f5f5f5' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectOnClick={true}
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Shift"
            fitView
            nodeTypes={nodeTypes}
          >
            <Background color="#c0c0c0" gap={15} size={2} />
          </ReactFlow>
        </div>
        {/* Payment Route Ranking Section */}
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Top Payment Routes (by usage)
          </Typography>
          <Stack spacing={2}>
            {mockRouteRanking.map((route, idx) => (
              <Box key={route.route}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {idx + 1}. {route.route}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(route.count / maxCount) * 100}
                  sx={{ height: 10, borderRadius: 5, mb: 0.5, background: '#eee', '& .MuiLinearProgress-bar': { backgroundColor: '#6a5af9' } }}
                />
                <Typography variant="caption" color="text.secondary">
                  {route.count} uses
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default PaymentNetworkPage; 