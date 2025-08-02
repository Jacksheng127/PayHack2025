import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import TransactionDetails from './TransactionDetails';

interface NetworkGraphVisProps {
  onNodeClick: (nodeId: string) => void;
}

const NetworkGraphVis: React.FC<NetworkGraphVisProps> = ({ onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isStabilized, setIsStabilized] = useState(false);
  const [nodesData, setNodesData] = useState<any[]>([]);
  const [edgesData, setEdgesData] = useState<any[]>([]);
  const isStabilizedRef = useRef(false);

  // Function to add new nodes and edges dynamically
  const addNodeAndEdge = (newNode: any, newEdges: any[] = []) => {
    if (!networkRef.current || !isStabilized) return;

    // Add new node with fixed position (you can customize the position logic)
    const newNodeWithPosition = {
      ...newNode,
      fixed: { x: true, y: true },
      x: Math.random() * 400 - 200, // Random position, customize as needed
      y: Math.random() * 400 - 200
    };

    // Update state and network data
    const updatedNodes = [...nodesData, newNodeWithPosition];
    const updatedEdges = [...edgesData, ...newEdges];
    
    setNodesData(updatedNodes);
    setEdgesData(updatedEdges);

    // Update the network with new data
    networkRef.current.setData({
      nodes: updatedNodes,
      edges: updatedEdges
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Color definitions for different node types
    const dirDist50 = "#E8544E";   // High transaction volume
    const dirDist10 = "#FFD265";   // Medium transaction volume
    const dirDistLess10 = "#2AA775"; // Low transaction volume

    // Define nodes data
    const nodes = [
      { 
        id: 'Main Bank', 
        label: 'Main Bank', 
        color: { background: dirDist50, border: 'rgba(255, 255, 255, 0.3)' },
        size: 30,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Branch A', 
        label: 'Branch A', 
        color: { background: dirDistLess10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 15,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Branch B', 
        label: 'Branch B', 
        color: { background: dirDist50, border: 'rgba(255, 255, 255, 0.3)' },
        size: 30,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'ATM Network', 
        label: 'ATM Network', 
        color: { background: dirDist10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 20,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Credit Dept', 
        label: 'Credit Dept', 
        color: { background: dirDist50, border: 'rgba(255, 255, 255, 0.3)' },
        size: 30,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Retail Store', 
        label: 'Retail Store', 
        color: { background: dirDistLess10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 15,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Gas Station', 
        label: 'Gas Station', 
        color: { background: dirDistLess10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 15,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Pharmacy', 
        label: 'Pharmacy', 
        color: { background: dirDistLess10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 15,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Grocery', 
        label: 'Grocery', 
        color: { background: dirDistLess10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 15,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Restaurant', 
        label: 'Restaurant', 
        color: { background: dirDist10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 20,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Online Shop', 
        label: 'Online Shop', 
        color: { background: dirDistLess10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 15,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Mobile App', 
        label: 'Mobile App', 
        color: { background: dirDistLess10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 15,
        font: { color: '#ffffff', size: 11 }
      },
      { 
        id: 'Insurance Co', 
        label: 'Insurance Co', 
        color: { background: dirDist10, border: 'rgba(255, 255, 255, 0.3)' },
        size: 20,
        font: { color: '#ffffff', size: 11 }
      }
    ];

    // Define edges data
    const edges = [
      { from: 'Main Bank', to: 'Branch A', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Main Bank', to: 'Branch B', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Branch B', to: 'ATM Network', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Branch B', to: 'Mobile App', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Branch A', to: 'ATM Network', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Branch A', to: 'Credit Dept', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'ATM Network', to: 'Retail Store', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'ATM Network', to: 'Gas Station', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'ATM Network', to: 'Pharmacy', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'ATM Network', to: 'Grocery', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'ATM Network', to: 'Restaurant', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Retail Store', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Online Shop', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Mobile App', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Branch A', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Gas Station', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Pharmacy', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Grocery', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Branch B', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 },
      { from: 'Credit Dept', to: 'Insurance Co', color: { color: 'rgba(66, 133, 244, 0.4)' }, width: 2 }
    ];

    // Initialize state with initial data
    setNodesData(nodes);
    setEdgesData(edges);

    // Network options
    const options = {
      layout: {
        improvedLayout: true,
        hierarchical: false
      },
      physics: {
        enabled: true,
        stabilization: { 
          iterations: 200,
          onlyDynamicEdges: false,
          fit: false // Disable automatic fitting
        },
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1
        }
      },
      nodes: {
        borderWidth: 2,
        shadow: true,
        borderWidthSelected: 3,
        shape: 'circle',
        fixed: false // Initially allow movement for stabilization
      },
      edges: {
        shadow: true,
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5
        }
      },
      interaction: {
        hover: true,
        dragNodes: false, // Disable node dragging
        dragView: true,   // Keep view dragging for panning
        zoomView: true,   // Keep zoom functionality
        selectConnectedEdges: false, // Prevent edge selection affecting layout
        multiselect: false,
        navigationButtons: false,
        keyboard: false // Disable keyboard interactions that might affect layout
      },
      configure: {
        enabled: false
      }
    } as any;

    // Create network
    const network = new Network(containerRef.current, { nodes, edges }, options);
    networkRef.current = network;

    // Disable physics and fix nodes after stabilization
    network.once('stabilizationIterationsDone', () => {
      // Completely disable physics to prevent any layout changes
      network.setOptions({
        physics: { 
          enabled: false,
          stabilization: false
        },
        interaction: {
          hover: true,
          dragNodes: false,
          dragView: true,
          zoomView: true,
          selectConnectedEdges: false,
          multiselect: false,
          navigationButtons: false,
          keyboard: false
        }
      });
      
      // Fix all nodes in their current positions
      const nodePositions = network.getPositions();
      const fixedNodes = nodes.map(node => ({
        ...node,
        fixed: { x: true, y: true },
        physics: false, // Explicitly disable physics for each node
        x: nodePositions[node.id].x,
        y: nodePositions[node.id].y
      }));
      
      // Update both the network and state with fixed positions
      setNodesData(fixedNodes);
      network.setData({ nodes: fixedNodes, edges });
      
      // Mark as stabilized
      setIsStabilized(true);
      isStabilizedRef.current = true;
    });

    // Add click event listener
    network.on('click', (params: any) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        setSelectedNode(nodeId);
        onNodeClick(nodeId);
        
        // Prevent any potential layout changes after node selection
        if (isStabilizedRef.current) {
          network.setOptions({
            physics: { enabled: false }
          });
          // Prevent redraw that might change positions
          network.redraw();
        }
      }
    });

    // Prevent any other events that might cause layout changes
    network.on('selectNode', () => {
      if (isStabilizedRef.current) {
        network.setOptions({
          physics: { enabled: false }
        });
      }
    });

    network.on('deselectNode', () => {
      if (isStabilizedRef.current) {
        network.setOptions({
          physics: { enabled: false }
        });
      }
    });

    // Prevent resize events from affecting the layout
    network.on('resize', () => {
      if (isStabilizedRef.current) {
        network.setOptions({
          physics: { enabled: false }
        });
      }
    });

    // Cleanup
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [onNodeClick]);

  // Prevent network redraw when selectedNode changes
  useEffect(() => {
    if (networkRef.current && isStabilizedRef.current) {
      // Ensure physics stays disabled when modal state changes
      networkRef.current.setOptions({
        physics: { enabled: false }
      });
    }
  }, [selectedNode]);

  const handleCloseModal = () => {
    setSelectedNode(null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div className="network-graph" style={{ width: '100%', height: '100%' }}>
        <div className="graph-header">
          <h3>Transaction Network Analysis</h3>
          <div className="graph-legend">
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#E8544E'}}></span>
              <span>High Volume</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#FFD265'}}></span>
              <span>Medium Volume</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#2AA775'}}></span>
              <span>Low Volume</span>
            </div>
          </div>
        </div>
        <div 
          className="graph-container" 
          ref={containerRef}
          style={{ 
            width: '100%', // Keep width constant
            height: '600px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            position: 'relative' // Ensure proper positioning
            // Remove transition that was causing the width change
          }}
        />
        <div className="graph-instructions">
          <p>Click on any node to view transaction details • Drag to pan • Scroll to zoom • Layout is fixed after initialization</p>
          {!isStabilized && <p style={{color: '#FFD265'}}>Initializing static layout...</p>}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedNode && (
        <TransactionDetails 
          selectedNode={selectedNode} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default NetworkGraphVis;
