import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, NodeSingular, EventObject, ElementDefinition } from 'cytoscape';
import TransactionDetails from './TransactionDetails';

interface NetworkGraphCytoscapeProps {
  onNodeClick: (nodeId: string) => void;
}

const NetworkGraphCytoscape: React.FC<NetworkGraphCytoscapeProps> = ({ onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializedRef = useRef(false);
  const isDestroyedRef = useRef(false);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const isAnimatingRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Color definitions for different node types
  const dirDist50 = "#E8544E";   // High transaction volume
  const dirDist10 = "#FFD265";   // Medium transaction volume
  const dirDistLess10 = "#2AA775"; // Low transaction volume

  // Function to safely check if Cytoscape instance is valid
  const isCyValid = () => {
    return cyRef.current && !isDestroyedRef.current && cyRef.current.elements && cyRef.current.elements().length > 0;
  };

  // Function to calculate positions based on focused node
  const calculatePositions = (focusedNodeId: string | null) => {
    const basePositions: {[key: string]: {x: number, y: number}} = {
      'Main Bank': { x: 300, y: 200 },
      'Branch A': { x: 150, y: 100 },
      'Branch B': { x: 450, y: 100 },
      'ATM Network': { x: 300, y: 350 },
      'Credit Dept': { x: 150, y: 300 },
      'Mobile App': { x: 400, y: 250 },
    };

    if (!focusedNodeId) {
      return basePositions;
    }

    // When a node is focused, reposition everything
    const focusedPositions: {[key: string]: {x: number, y: number}} = {};
    
    // Move focused node to the left
    focusedPositions[focusedNodeId] = { x: 100, y: 200 };

    // Get all connected nodes
    const connectedNodes = new Set<string>();
    const connections = [
      { source: 'Main Bank', targets: ['Branch A', 'Branch B'] },
      { source: 'Branch B', targets: ['ATM Network', 'Mobile App'] },
      { source: 'Branch A', targets: ['ATM Network', 'Credit Dept'] },
    ];

    // Find connections for the focused node
    connections.forEach(conn => {
      if (conn.source === focusedNodeId) {
        conn.targets.forEach(target => connectedNodes.add(target));
      } else if (conn.targets.includes(focusedNodeId)) {
        connectedNodes.add(conn.source);
      }
    });

    // Position connected nodes to the right of focused node
    const connectedArray = Array.from(connectedNodes);
    connectedArray.forEach((nodeId, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      focusedPositions[nodeId] = { 
        x: 250 + (col * 120), 
        y: 100 + (row * 100) 
      };
    });

    // Position remaining nodes further to the right
    const allNodes = Object.keys(basePositions);
    const remainingNodes = allNodes.filter(nodeId => 
      nodeId !== focusedNodeId && !connectedNodes.has(nodeId)
    );

    remainingNodes.forEach((nodeId, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      focusedPositions[nodeId] = { 
        x: 600 + (col * 100), 
        y: 50 + (row * 80) 
      };
    });

    return focusedPositions;
  };

  // Function to update graph layout based on focused node
  const updateGraphLayout = (focusedNodeId: string | null) => {
    if (!isCyValid() || isAnimatingRef.current) return;

    try {
      isAnimatingRef.current = true;
      const positions = calculatePositions(focusedNodeId);
      
      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Stop any running layouts first
      cyRef.current!.stop();

      // Immediately animate each node to its new position with staggered timing
      cyRef.current!.nodes().forEach((node: NodeSingular, index: number) => {
        const nodeId = node.id();
        const newPos = positions[nodeId];
        if (newPos) {
          // Add small delay for staggered animation effect
          const delay = nodeId === focusedNodeId ? 0 : index * 50;
          
          setTimeout(() => {
            if (isCyValid()) {
              node.animate({
                position: newPos,
                duration: 600,
                easing: 'ease-out'
              });
            }
          }, delay);
        }
      });

      // Fit the view immediately with a smooth animation
      setTimeout(() => {
        if (isCyValid()) {
          cyRef.current!.animate({
            fit: {
              padding: 50,
              eles: cyRef.current!.elements()
            },
            duration: 400,
            easing: 'ease-out'
          });
        }
      }, 100);

      // Reset animation flag after all animations complete
      animationTimeoutRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
      }, 1000);

    } catch (error) {
      console.error('Error updating graph layout:', error);
      isAnimatingRef.current = false;
    }
  };

  // Function to add new nodes and edges dynamically
  const addNodeAndEdge = (newNode: ElementDefinition, newEdges: ElementDefinition[] = []) => {
    if (!isCyValid() || !isInitialized || isAnimatingRef.current) return;

    try {
      // Add new node
      cyRef.current!.add(newNode);

      // Add new edges
      newEdges.forEach(edge => {
        cyRef.current!.add(edge);
      });

      // Update layout with new node after a short delay
      setTimeout(() => {
        if (isCyValid()) {
          updateGraphLayout(focusedNode);
        }
      }, 100);

    } catch (error) {
      console.error('Error adding nodes/edges:', error);
    }
  };

  useEffect(() => {
    // Reset destroyed flag
    isDestroyedRef.current = false;
    
    // Add delay to ensure DOM is ready
    const initializeGraph = () => {
      if (!containerRef.current || isDestroyedRef.current) return;

      // Check if container has dimensions
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Retry after a short delay
        setTimeout(initializeGraph, 100);
        return;
      }

      try {
        // Define initial nodes and edges data
        const elements: ElementDefinition[] = [
          // Nodes
          { group: 'nodes' as const, data: { id: 'Main Bank', label: 'Main Bank', type: 'high' } },
          { group: 'nodes' as const, data: { id: 'Branch A', label: 'Branch A', type: 'low' } },
          { group: 'nodes' as const, data: { id: 'Branch B', label: 'Branch B', type: 'high' } },
          { group: 'nodes' as const, data: { id: 'ATM Network', label: 'ATM Network', type: 'medium' } },
          { group: 'nodes' as const, data: { id: 'Credit Dept', label: 'Credit Dept', type: 'high' } },
          
          // Edges
          { group: 'edges' as const, data: { id: 'e1', source: 'Main Bank', target: 'Branch A' } },
          { group: 'edges' as const, data: { id: 'e2', source: 'Main Bank', target: 'Branch B' } },
          { group: 'edges' as const, data: { id: 'e3', source: 'Branch B', target: 'ATM Network' } },
          { group: 'edges' as const, data: { id: 'e5', source: 'Branch A', target: 'ATM Network' } },
          { group: 'edges' as const, data: { id: 'e6', source: 'Branch A', target: 'Credit Dept' } },
          { group: 'edges' as const, data: { id: 'e15', source: 'Credit Dept', target: 'Branch A' } },
          { group: 'edges' as const, data: { id: 'e19', source: 'Credit Dept', target: 'Branch B' } },
        ];

        // Initialize Cytoscape with initial layout
        const cy = cytoscape({
          container: containerRef.current,
          elements: elements,
          style: [
            {
              selector: 'node',
              style: {
                'shape': 'ellipse',
                'text-outline-color': '#000',
                'text-outline-width': 1,
                'text-wrap': 'wrap',
                'text-max-width': '80px',
                'label': 'data(label)',
                'color': '#ffffff',
                'font-size': '11px',
                'text-valign': 'center',
                'text-halign': 'center',
                'border-width': 2,
                'border-color': 'rgba(255, 255, 255, 0.3)'
              }
            },
            {
              selector: 'node[type="high"]',
              style: {
                'background-color': dirDist50,
                'width': 60,
                'height': 60
              }
            },
            {
              selector: 'node[type="medium"]',
              style: {
                'background-color': dirDist10,
                'width': 40,
                'height': 40
              }
            },
            {
              selector: 'node[type="low"]',
              style: {
                'background-color': dirDistLess10,
                'width': 30,
                'height': 30
              }
            },
            {
              selector: 'node[type="transaction"]',
              style: {
                'background-color': '#FF6B6B',
                'width': 35,
                'height': 35
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': 'rgba(66, 133, 244, 0.4)',
                'target-arrow-color': 'rgba(66, 133, 244, 0.4)',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
              }
            },
            {
              selector: 'node:selected',
              style: {
                'border-width': 4,
                'border-color': '#4285f4'
              }
            }
          ],
          layout: {
            name: 'preset',
            positions: calculatePositions(null),
            animate: false,
            fit: true,
            padding: 30
          },
          zoom: 1,
          pan: { x: 0, y: 0 },
          minZoom: 0.5,
          maxZoom: 2,
          zoomingEnabled: true,
          userZoomingEnabled: true,
          panningEnabled: true,
          userPanningEnabled: true,
          boxSelectionEnabled: false,
          selectionType: 'single',
          touchTapThreshold: 8,
          desktopTapThreshold: 4,
          autolock: false,
          autoungrabify: true,
          autounselectify: false,
          headless: false,
          styleEnabled: true,
          hideEdgesOnViewport: false,
          textureOnViewport: false,
          motionBlur: false,
          motionBlurOpacity: 0.2,
          wheelSensitivity: 1,
          pixelRatio: 'auto'
        });

        if (isDestroyedRef.current) {
          cy.destroy();
          return;
        }

        cyRef.current = cy;

        // Mark as initialized
        setIsInitialized(true);
        isInitializedRef.current = true;

        // Add click event listener
        cy.on('tap', 'node', (event: EventObject) => {
          if (isDestroyedRef.current || isAnimatingRef.current || !isCyValid()) return;
          
          try {
            const nodeId = event.target.id();
            setSelectedNode(nodeId);
            setFocusedNode(nodeId);
            onNodeClick(nodeId);
            
            // Update layout with focused node after a short delay
            setTimeout(() => {
              if (isCyValid()) {
                updateGraphLayout(nodeId);
              }
            }, 100);
            
          } catch (error) {
            console.error('Error in node click handler:', error);
          }
        });

      } catch (error) {
        console.error('Error initializing Cytoscape:', error);
      }
    };

    // Start initialization with a delay
    setTimeout(initializeGraph, 50);

    // Cleanup function
    return () => {
      isDestroyedRef.current = true;
      setIsInitialized(false);
      isInitializedRef.current = false;
      isAnimatingRef.current = false;
      
      // Clear any pending timeouts
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      
      if (cyRef.current) {
        try {
          cyRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Cytoscape:', error);
        } finally {
          cyRef.current = null;
        }
      }
    };
  }, [onNodeClick]);

  // Update layout when focused node changes
  useEffect(() => {
    if (isCyValid() && isInitializedRef.current && !isAnimatingRef.current) {
      setTimeout(() => {
        if (isCyValid()) {
          updateGraphLayout(focusedNode);
        }
      }, 100);
    }
  }, [focusedNode]);

  const handleCloseModal = () => {
    setSelectedNode(null);
  };

  // Example function to simulate adding a transaction node
  const simulateTransaction = () => {
    if (!isInitialized || isDestroyedRef.current || isAnimatingRef.current || !isCyValid()) return;
    
    const newNodeId = `Transaction_${Date.now()}`;
    const randomSource = ['Main Bank', 'Branch A', 'Branch B'][Math.floor(Math.random() * 3)];
    
    // Generate a position that doesn't overlap with existing nodes
    const newPosition = { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 };
    
    addNodeAndEdge(
      {
        group: 'nodes' as const,
        data: { id: newNodeId, label: 'New Transaction', type: 'transaction' },
        position: newPosition
      },
      [
        {
          group: 'edges' as const,
          data: { id: `edge_${newNodeId}`, source: randomSource, target: newNodeId }
        }
      ]
    );
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
          {/* {isInitialized && (
            <button 
              onClick={simulateTransaction}
              style={{
                background: 'rgba(66, 133, 244, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '12px',
                marginLeft: '20px'
              }}
            >
              Add Transaction
            </button>
          )} */}
        </div>
        <div 
          ref={containerRef}
          style={{ 
            width: '100%',
            height: '600px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        />
        <div className="graph-instructions">
          <p>Click on any node to focus and reposition the graph • Drag to pan • Scroll to zoom • Dynamic layout</p>
          {!isInitialized && <p style={{color: '#FFD265'}}>Initializing dynamic layout...</p>}
          {focusedNode && <p style={{color: '#4285f4'}}>Focused on: {focusedNode}</p>}
          {isAnimatingRef.current && <p style={{color: '#FFD265'}}>Animating...</p>}
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

export default NetworkGraphCytoscape;