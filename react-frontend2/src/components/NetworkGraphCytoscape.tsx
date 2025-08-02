import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, NodeSingular, EventObject, ElementDefinition } from 'cytoscape';
import TransactionDetails from './TransactionDetails';

interface NetworkGraphCytoscapeProps {
  onNodeClick: (nodeId: string) => void;
  newTransaction?: {
    id: string;
    customer: string;
    merchant: string;
    amount: number;
    category: string;
    isFraud: boolean;
    riskLevel: string;
    timestamp?: string;
  } | null;
  allTransactions?: {
    id: string;
    customer: string;
    merchant: string;
    amount: number;
    category: string;
    isFraud: boolean;
    riskLevel: string;
    timestamp?: string;
  }[];
  onTransactionAdded?: () => void;
  buildNewGraph?: boolean;
}

const NetworkGraphCytoscape: React.FC<NetworkGraphCytoscapeProps> = ({ onNodeClick, newTransaction, allTransactions, onTransactionAdded, buildNewGraph = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializedRef = useRef(false);
  const isDestroyedRef = useRef(false);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const hasTransactionGraphRef = useRef(false); // Track if we have a transaction-based graph

  // Color definitions for different node types
  const dirDist50 = "#E8544E";   // High transaction volume
  const dirDist10 = "#FFD265";   // Medium transaction volume
  const dirDistLess10 = "#2AA775"; // Low transaction volume

  // Risk level color definitions
  const riskColors = {
    L3: '#E8544E', // Red Flag
    L2: '#FF9800', // Outbound Freeze
    L1: '#FFD265', // Watchlist
    L0: '#2AA775'  // Normal
  };

  // Helper function to get node risk level based on latest transaction
  const getNodeRiskLevel = (nodeId: string, transactions: NonNullable<typeof allTransactions>) => {
    if (!transactions || transactions.length === 0) return 'L0';
    
    // Find all transactions involving this node (as customer or merchant)
    const nodeTransactions = transactions.filter(t => t.customer === nodeId || t.merchant === nodeId);
    
    if (nodeTransactions.length === 0) return 'L0';
    
    // If we have timestamps, sort by them to get the latest
    if (nodeTransactions[0].timestamp) {
      const sortedTransactions = nodeTransactions.sort((a, b) => {
        const timeA = new Date(a.timestamp || 0).getTime();
        const timeB = new Date(b.timestamp || 0).getTime();
        return timeB - timeA; // Most recent first
      });
      
      // Return the risk level of the most recent transaction involving this node
      const latestTransaction = sortedTransactions[0];
      return latestTransaction.riskLevel || 'L0';
    } else {
      // If no timestamps, return the last transaction in the array (assumed to be most recent)
      const latestTransaction = nodeTransactions[nodeTransactions.length - 1];
      return latestTransaction.riskLevel || 'L0';
    }
  };

  // Function to update node risk level and color in real-time
  const updateNodeRiskLevel = (nodeId: string, newRiskLevel: string) => {
    if (!isCyValid()) return;
    
    try {
      const node = cyRef.current!.getElementById(nodeId);
      if (node.length > 0) {
        // Update the node's risk level data
        node.data('riskLevel', newRiskLevel);
        
        console.log(`🎨 Updated node ${nodeId} risk level to ${newRiskLevel}`);
        
        // Force style update by temporarily changing a style property
        // This ensures Cytoscape re-evaluates the selectors
        node.style('border-width', node.style('border-width'));
      }
    } catch (error) {
      console.error('Error updating node risk level:', error);
    }
  };

  // Function to safely check if Cytoscape instance is valid
  const isCyValid = () => {
    return cyRef.current && !isDestroyedRef.current && cyRef.current.elements && cyRef.current.elements().length > 0;
  };

  // Static positions for the graph
  const staticPositions: {[key: string]: {x: number, y: number}} = {
    'Main Bank': { x: 300, y: 200 },
    'Branch A': { x: 150, y: 100 },
    'Branch B': { x: 450, y: 100 },
    'ATM Network': { x: 300, y: 350 },
    'Credit Dept': { x: 150, y: 300 },
    'Mobile App': { x: 400, y: 250 },
  };


  useEffect(() => {
    // Reset destroyed flag
    isDestroyedRef.current = false;
    
    // Add delay to ensure DOM is ready
    const initializeGraph = () => {
      if (!containerRef.current || isDestroyedRef.current) return;
      
      // Don't reinitialize if we already have a transaction-based graph and there's no new data
      if (hasTransactionGraphRef.current && buildNewGraph && !allTransactions && !newTransaction) {
        console.log('🚫 Skipping reinitialization - transaction graph already exists and no new data');
        return;
      }

      // Check if container has dimensions
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Retry after a short delay
        setTimeout(initializeGraph, 100);
        return;
      }

      try {
        // Define initial nodes and edges data
        // Always start with static bank infrastructure, then replace with transaction data later
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
        
        console.log('Initializing graph with', elements.length, 'elements');

        // Initialize Cytoscape with static layout
        console.log('Creating Cytoscape instance...');
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
              selector: 'node[type="sender"]',
              style: {
                'background-color': '#4285f4',
                'width': 50,
                'height': 50,
                'border-width': 2,
                'border-color': '#ffffff'
              }
            },
            {
              selector: 'node[type="receiver"]',
              style: {
                'background-color': '#34a853',
                'width': 50,
                'height': 50,
                'border-width': 2,
                'border-color': '#ffffff'
              }
            },
            {
              selector: 'node[type="source"]',
              style: {
                'background-color': '#4285f4',
                'width': 50,
                'height': 50,
                'border-width': 2,
                'border-color': '#ffffff'
              }
            },
            {
              selector: 'node[type="intermediate"]',
              style: {
                'background-color': '#9C27B0',
                'width': 50,
                'height': 50,
                'border-width': 2,
                'border-color': '#ffffff'
              }
            },
            {
              selector: 'node[type="sink"]',
              style: {
                'background-color': '#34a853',
                'width': 50,
                'height': 50,
                'border-width': 2,
                'border-color': '#ffffff'
              }
            },
            {
              selector: 'node[type="summary"]',
              style: {
                'background-color': '#FF9800',
                'width': 150,
                'height': 40,
                'border-width': 3,
                'border-color': '#F57C00',
                'color': '#ffffff',
                'font-size': '12px',
                'font-weight': 'bold',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-wrap': 'wrap',
                'text-max-width': '140px',
                'shape': 'rectangle'
              }
            },

            // Risk-level based node styling
            {
              selector: 'node[riskLevel = "L1"]',
              style: {
                'background-color': riskColors.L1,
                'width': 60,
                'height': 60,
                'border-width': 4,
                'border-color': '#ffffff'
              }
            },
            {
              selector: 'node[riskLevel = "L2"]',
              style: {
                'background-color': riskColors.L2,
                'width': 55,
                'height': 55,
                'border-width': 3,
                'border-color': '#ffffff'
              }
            },
            {
              selector: 'node[riskLevel = "L3"]',
              style: {
                'background-color': riskColors.L3,
                'width': 50,
                'height': 50,
                'border-width': 2,
                'border-color': '#ffffff'
              }
            },
            {
              selector: 'node[riskLevel = "L0"]',
              style: {
                'background-color': riskColors.L0,
                'width': 45,
                'height': 45,
                'border-width': 2,
                'border-color': '#ffffff'
              }
            },

            {
              selector: 'edge',
              style: {
                'width': 2,
                'line-color': 'rgba(66, 133, 244, 0.6)',
                'target-arrow-color': 'rgba(66, 133, 244, 0.6)',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'control-point-step-size': 40,
                'control-point-distance': function(ele: any) {
                  const offset = ele.data('curveOffset');
                  return offset ? Math.abs(offset) + 40 : 40;
                },
                'control-point-weight': function(ele: any) {
                  const offset = ele.data('curveOffset');
                  return offset ? (offset > 0 ? 0.3 : 0.7) : 0.5;
                }
              }
            },

            // Risk-based edge styling
            {
              selector: 'edge[riskLevel = "L3"]',
              style: {
                'line-color': riskColors.L3,
                'target-arrow-color': riskColors.L3,
                'width': 4
              }
            },
            {
              selector: 'edge[riskLevel = "L2"]',
              style: {
                'line-color': riskColors.L2,
                'target-arrow-color': riskColors.L2,
                'width': 3
              }
            },
            {
              selector: 'edge[riskLevel = "L1"]',
              style: {
                'line-color': riskColors.L1,
                'target-arrow-color': riskColors.L1,
                'width': 2
              }
            },
            {
              selector: 'edge[riskLevel = "L0"]',
              style: {
                'line-color': riskColors.L0,
                'target-arrow-color': riskColors.L0,
                'width': 2
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
            positions: staticPositions,
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
        console.log('Cytoscape instance created successfully');

        // Mark as initialized
        setIsInitialized(true);
        isInitializedRef.current = true;
        console.log('Graph initialized and ready');

        // Add click event listener
        cy.on('tap', 'node', (event: EventObject) => {
          if (isDestroyedRef.current || !isCyValid()) return;
          
          try {
            const nodeId = event.target.id();
            setSelectedNode(nodeId);
            setFocusedNode(nodeId);
            onNodeClick(nodeId);
            
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
      hasTransactionGraphRef.current = false; // Reset transaction graph flag
      
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

  // Add new transaction to graph when provided
  useEffect(() => {
    console.log('🔄 NetworkGraphCytoscape useEffect triggered:', { 
      newTransaction: newTransaction ? `${newTransaction.id} ($${newTransaction.amount})` : 'null',
      allTransactions: allTransactions ? `${allTransactions.length} transactions` : 'null',
      isInitialized, 
      buildNewGraph, 
      isCyValid: isCyValid() 
    });
    
    // Reset transaction graph flag when new data comes in to allow rebuilding
    if ((allTransactions && allTransactions.length > 0) || newTransaction) {
      hasTransactionGraphRef.current = false;
      console.log('🔄 Reset transaction graph flag to allow rebuilding');
    }
    
    if (allTransactions && allTransactions.length > 0) {
      console.log('🎯 allTransactions exists with', allTransactions.length, 'transactions');
      
      if (isInitialized) {
        console.log('✅ Graph is initialized');
        
        if (isCyValid()) {
          console.log('✅ Cytoscape instance is valid');
          console.log('🚀 Building multi-transaction graph...');
          buildGraphFromMultipleTransactions(allTransactions);
        } else {
          console.log('❌ Cytoscape instance is not valid');
        }
      } else {
        console.log('❌ Graph is not initialized yet');
      }
    } else if (newTransaction) {
      console.log('🎯 newTransaction exists:', newTransaction);
      
      if (isInitialized) {
        console.log('✅ Graph is initialized');
        
        if (isCyValid()) {
          console.log('✅ Cytoscape instance is valid');
          
          if (buildNewGraph) {
            console.log('🚀 Forcing complete graph rebuild...');
            buildGraphFromTransaction(newTransaction);
          } else {
            console.log('📍 Adding transaction node to existing graph...');
            addTransactionNode(newTransaction);
          }
        } else {
          console.log('❌ Cytoscape instance is not valid');
        }
      } else {
        console.log('❌ Graph is not initialized yet');
      }
    } else {
      console.log('❌ No transactions provided');
    }
  }, [newTransaction, allTransactions, isInitialized, buildNewGraph]);

  // Function to build a new graph from transaction data
  const buildGraphFromTransaction = (transaction: NonNullable<typeof newTransaction>) => {
    console.log('🏗️ buildGraphFromTransaction called with:', transaction);
    
    if (!isCyValid() || !isInitialized) {
      console.log('❌ Graph not ready:', { isCyValid: isCyValid(), isInitialized });
      return;
    }

    try {
      console.log('🧹 Clearing existing graph...');
      // Clear existing graph
      const currentElements = cyRef.current!.elements();
      console.log('📊 Current elements before clear:', currentElements.length);
      cyRef.current!.elements().remove();
      
      // Verify graph is actually cleared
      const elementsAfterClear = cyRef.current!.elements();
      console.log('🔍 Elements after clear:', elementsAfterClear.length);
      console.log('✅ Graph cleared. Building new transaction-based graph...');

      // Create nodes based on transaction data
      const elements: ElementDefinition[] = [];

      // For single transaction, we'll use the transaction's risk level for both nodes
      // In a real scenario, you'd calculate based on all transactions involving each entity
      const senderRiskLevel = transaction.riskLevel;
      const receiverRiskLevel = transaction.riskLevel;

      // Add sender node with calculated risk level
      elements.push({
        group: 'nodes' as const,
        data: { 
          id: transaction.customer, 
          label: `Sender: ${transaction.customer}`, 
          type: 'sender',
          entity: transaction.customer,
          riskLevel: senderRiskLevel
        },
        position: { x: 200, y: 100 }
      });

      // Add receiver node with calculated risk level
      elements.push({
        group: 'nodes' as const,
        data: { 
          id: transaction.merchant, 
          label: `Receiver: ${transaction.merchant}`, 
          type: 'receiver',
          entity: transaction.merchant,
          riskLevel: receiverRiskLevel
        },
        position: { x: 400, y: 100 }
      });

      // Add transaction node with risk level
      const nodeType = transaction.isFraud || transaction.riskLevel === 'L3' ? 'high' : 
                      transaction.riskLevel === 'L2' ? 'medium' : 
                      transaction.riskLevel === 'L1' ? 'medium' : 'low';
      
      elements.push({
        group: 'nodes' as const,
        data: { 
          id: transaction.id, 
          label: `TXN: $${transaction.amount}`, 
          type: nodeType,
          transaction: transaction,
          amount: transaction.amount,
          category: transaction.category,
          riskLevel: transaction.riskLevel
        },
        position: { x: 300, y: 250 }
      });

      // Add edges
      elements.push({
        group: 'edges' as const,
        data: { 
          id: `edge_${transaction.id}_out`, 
          source: transaction.customer, 
          target: transaction.id 
        }
      });

      elements.push({
        group: 'edges' as const,
        data: { 
          id: `edge_${transaction.id}_in`, 
          source: transaction.id, 
          target: transaction.merchant 
        }
      });

      // Add all elements to the graph
      console.log('🎨 Adding new elements to graph:', elements.length, 'elements');
      console.log('📋 Elements details:', elements.map(e => ({
        id: e.data.id,
        label: e.data.label,
        type: e.data.type,
        group: e.group
      })));
      
      cyRef.current!.add(elements);
      console.log('✅ Elements added successfully');
      
      // Verify elements were actually added
      const finalElements = cyRef.current!.elements();
      console.log('🔢 Final element count:', finalElements.length);
      console.log('📊 Final elements:', finalElements.map(el => el.id()).join(', '));

      // Mark that we now have a transaction-based graph
      hasTransactionGraphRef.current = true;
      console.log('✅ Transaction graph built successfully - preventing reinitializations');

      // Fit the view
      setTimeout(() => {
        if (isCyValid()) {
          console.log('Fitting graph view...');
          cyRef.current!.fit();
        }
        // Don't automatically clear the transaction - keep it to maintain the graph
        // if (onTransactionAdded) {
        //   console.log('Notifying parent that transaction was added');
        //   onTransactionAdded();
        // }
        console.log('🎯 Transaction graph completed - keeping transaction data to prevent reset');
      }, 100);

    } catch (error) {
      console.error('Error building graph from transaction:', error);
    }
  };

  // Helper functions for dynamic graph building
  const analyzeTransactionNodes = (transactions: NonNullable<typeof allTransactions>) => {
    const nodeInfo: {[key: string]: {type: string, inDegree: number, outDegree: number, level: number}} = {};
    const allNodes = new Set<string>();
    const predecessors: {[key: string]: string[]} = {};
    const successors: {[key: string]: string[]} = {};

    transactions.forEach(transaction => {
      const customer = transaction.customer;
      const merchant = transaction.merchant;

      allNodes.add(customer);
      allNodes.add(merchant);

      if (!nodeInfo[customer]) nodeInfo[customer] = {type: '', inDegree: 0, outDegree: 0, level: 0};
      if (!nodeInfo[merchant]) nodeInfo[merchant] = {type: '', inDegree: 0, outDegree: 0, level: 0};

      if (!predecessors[merchant]) predecessors[merchant] = [];
      if (!successors[customer]) successors[customer] = [];

      if (!predecessors[merchant].includes(customer)) predecessors[merchant].push(customer);
      if (!successors[customer].includes(merchant)) successors[customer].push(merchant);
      
      nodeInfo[customer].outDegree++;
      nodeInfo[merchant].inDegree++;
    });

    const sources = Array.from(allNodes).filter(id => nodeInfo[id].inDegree === 0);
    const nodeQueue = [...sources];
    const visited = new Set(sources);

    let level = 0;
    while(nodeQueue.length > 0) {
      const levelSize = nodeQueue.length;
      for (let i = 0; i < levelSize; i++) {
        const currentNode = nodeQueue.shift()!;
        nodeInfo[currentNode].level = level;

        const nodeSuccessors = successors[currentNode] || [];
        nodeSuccessors.forEach(successor => {
          if (!visited.has(successor)) {
            nodeQueue.push(successor);
            visited.add(successor);
          }
        });
      }
      level++;
    }

    Object.keys(nodeInfo).forEach(nodeId => {
      const info = nodeInfo[nodeId];
      if (info.inDegree === 0) {
        info.type = 'source';
      } else if (info.outDegree === 0) {
        info.type = 'sink';
      } else {
        info.type = 'intermediate';
      }
    });

    return {
      allNodes: Array.from(allNodes),
      nodeInfo,
    };
  };

  const calculateDynamicLayout = (nodeAnalysis: {allNodes: string[], nodeInfo: {[key: string]: {type: string, inDegree: number, outDegree: number, level: number}}}) => {
    const positions: {[key: string]: {x: number, y: number}} = {};
    const { allNodes, nodeInfo } = nodeAnalysis;

    const nodesByLevel: {[key: number]: string[]} = {};
    allNodes.forEach(nodeId => {
      const level = nodeInfo[nodeId].level;
      if (!nodesByLevel[level]) {
        nodesByLevel[level] = [];
      }
      nodesByLevel[level].push(nodeId);
    });

    const columnSpacing = 300;
    const nodeSpacing = 120;
    const initialX = 100;

    Object.keys(nodesByLevel).forEach(levelKey => {
      const level = parseInt(levelKey, 10);
      const nodesInLevel = nodesByLevel[level];
      const x = initialX + (level * columnSpacing);
      const levelHeight = (nodesInLevel.length - 1) * nodeSpacing;
      
      nodesInLevel.forEach((nodeId, index) => {
        positions[nodeId] = {
          x: x,
          y: (levelHeight / 2) - (index * nodeSpacing) + 150
        };
      });
    });

    return positions;
  };

  const groupEdgesByConnection = (transactions: NonNullable<typeof allTransactions>) => {
    const edgeGroups: {[key: string]: typeof transactions} = {};
    
    transactions.forEach(transaction => {
      const connectionKey = `${transaction.customer}-${transaction.merchant}`;
      if (!edgeGroups[connectionKey]) {
        edgeGroups[connectionKey] = [];
      }
      edgeGroups[connectionKey].push(transaction);
    });
    
    return edgeGroups;
  };

  const calculateEdgeCurveOffset = (edgeGroup: NonNullable<typeof allTransactions>, edgeIndex: number) => {
    if (edgeGroup.length === 1) return 0;
    
    // Create symmetric curve offsets for multiple edges
    const maxOffset = 80;
    const step = maxOffset / Math.max(1, edgeGroup.length - 1);
    const centerIndex = (edgeGroup.length - 1) / 2;
    
    return (edgeIndex - centerIndex) * step;
  };

  const buildGraphFromMultipleTransactions = (transactions: NonNullable<typeof allTransactions>) => {
    console.log('🏗️ buildGraphFromMultipleTransactions called with:', transactions.length, 'transactions');
    if (!isCyValid() || !isInitialized) {
      console.log('❌ Graph not ready:', { isCyValid: isCyValid(), isInitialized });
      return;
    }
    try {
      console.log('🧹 Clearing existing graph...');
      cyRef.current!.elements().remove();
      console.log('✅ Graph cleared. Building multi-transaction graph...');
      
      const elements: ElementDefinition[] = [];
      
      // Analyze transaction patterns to build dynamic layout
      const nodeAnalysis = analyzeTransactionNodes(transactions);
      const layoutPositions = calculateDynamicLayout(nodeAnalysis);
      const edgeGroups = groupEdgesByConnection(transactions);
      
      // Create nodes with calculated positions and risk levels
      nodeAnalysis.allNodes.forEach(nodeId => {
        const nodeInfo = nodeAnalysis.nodeInfo[nodeId];
        const position = layoutPositions[nodeId];
        const riskLevel = getNodeRiskLevel(nodeId, transactions);
        
        elements.push({
          group: 'nodes' as const,
          data: { 
            id: nodeId, 
            label: nodeId, 
            type: nodeInfo.type, 
            entity: nodeId,
            inDegree: nodeInfo.inDegree,
            outDegree: nodeInfo.outDegree,
            riskLevel: riskLevel
          },
          position: position
        });
      });
      
      // Create edges with dynamic spacing to avoid clustering
      transactions.forEach((transaction, index) => {
        const connectionKey = `${transaction.customer}-${transaction.merchant}`;
        const edgeGroup = edgeGroups[connectionKey];
        const edgeIndex = edgeGroup.findIndex(t => t.id === transaction.id && t.customer === transaction.customer && t.merchant === transaction.merchant);
        
        // Calculate curve offset for multiple edges between same nodes
        const curveOffset = calculateEdgeCurveOffset(edgeGroup, edgeIndex);
        
        const uniqueEdgeId = `edge_${transaction.id}_${index}`;
        
        elements.push({
          group: 'edges' as const,
          data: { 
            id: uniqueEdgeId, 
            source: transaction.customer, 
            target: transaction.merchant,
            amount: transaction.amount,
            riskLevel: transaction.riskLevel,
            isFraud: transaction.isFraud,
            transaction: transaction,
            curveOffset: curveOffset,
            edgeIndex: edgeIndex,
            totalEdges: edgeGroup.length
          }
        });
        
        console.log(`🔗 Created edge: ${transaction.customer} → ${transaction.merchant} with label: $${transaction.amount} (offset: ${curveOffset})`);
      });
      
      console.log(`🎨 Adding ${elements.length} elements to multi-transaction graph`);
      console.log(`📊 Created ${nodeAnalysis.allNodes.length} nodes for ${transactions.length} transactions`);
      
      // Debug: Log all edges being created
      const edges = elements.filter(el => el.group === 'edges');
      console.log('🔗 Edges being created:', edges.map(edge => ({
        id: edge.data.id,
        source: edge.data.source,
        target: edge.data.target,
        label: edge.data.label,
        allData: edge.data
      })));
      
      // Summary of expected transactions
      console.log('📋 Expected Transaction Flow:');
      console.log('  B1 → Y ($3000)');
      console.log('  B2 → Y ($2999)');
      console.log('  B3 → Y ($3100)');
      console.log('  Y → C1 ($2989)');
      console.log('  Y → C2 ($2979)');
      console.log('  Y → C3 ($2999)');
      
      cyRef.current!.add(elements);
      console.log(`✅ Multi-transaction graph built successfully with ${transactions.length} transactions`);
      
      // Debug: Check if edges have labels after being added
      const addedEdges = cyRef.current!.edges();
      console.log('🔍 Added edges with labels:', addedEdges.map(edge => ({
        id: edge.id(),
        source: edge.source().id(),
        target: edge.target().id(),
        label: edge.data('label'),
        hasLabel: !!edge.data('label'),
        allData: edge.data()
      })));
      
      setTimeout(() => {
        if (isCyValid()) {
          console.log('Fitting multi-transaction graph view...');
          cyRef.current!.fit();
        }
      }, 100);
    } catch (error) {
      console.error('Error building multi-transaction graph:', error);
    }
  };

  // Function to add new transaction node to the graph with real-time risk updates
  const addTransactionNode = (transaction: NonNullable<typeof newTransaction>) => {
    if (!isCyValid() || !isInitialized) return;

    try {
      // Check if sender and receiver nodes already exist
      const senderNode = cyRef.current!.getElementById(transaction.customer);
      const receiverNode = cyRef.current!.getElementById(transaction.merchant);
      
      // Define risk priority mapping for comparison
      const riskPriority: { [key: string]: number } = { 'L3': 4, 'L2': 3, 'L1': 2, 'L0': 1 };
      
      // Handle sender node
      if (senderNode.length > 0) {
        // Update existing sender node risk level based on this new transaction
        const currentSenderRisk = senderNode.data('riskLevel') || 'L0';
        const newSenderRisk = transaction.riskLevel;
        
        // Always update to the latest transaction's risk level for the sender
        // If the new transaction has a different risk level, update it
        if (newSenderRisk !== currentSenderRisk) {
          updateNodeRiskLevel(transaction.customer, newSenderRisk);
          console.log(`🔄 Sender ${transaction.customer} risk updated from ${currentSenderRisk} to ${newSenderRisk}`);
        }
      } else {
        // Add new sender node if it doesn't exist (starts with L0/green)
        const senderPosition = {
          x: Math.random() * 200 + 50,
          y: Math.random() * 200 + 50
        };
        
        cyRef.current!.add({
          group: 'nodes' as const,
          data: { 
            id: transaction.customer, 
            label: `${transaction.customer}`, 
            type: 'sender',
            entity: transaction.customer,
            riskLevel: 'L4' // Always start with L0 (green)
          },
          position: senderPosition
        });
        
        console.log(`➕ Added new sender node ${transaction.customer} with initial risk L4`);
      }
      
      // Handle receiver node - this is where the main logic applies
      if (receiverNode.length > 0) {
        // Update existing receiver node risk level based on this new transaction
        const currentReceiverRisk = receiverNode.data('riskLevel') || 'L0';
        const newReceiverRisk = transaction.riskLevel;
        
        // The receiver always gets updated to the latest transaction's risk level
        if (newReceiverRisk !== currentReceiverRisk) {
          updateNodeRiskLevel(transaction.merchant, newReceiverRisk);
          console.log(`🎯 Receiver ${transaction.merchant} risk updated from ${currentReceiverRisk} to ${newReceiverRisk} (latest transaction)`);
        }
      } else {
        // Add new receiver node if it doesn't exist
        const receiverPosition = {
          x: Math.random() * 200 + 350,
          y: Math.random() * 200 + 50
        };
        
        // New receiver node gets the risk level from the current transaction
        cyRef.current!.add({
          group: 'nodes' as const,
          data: { 
            id: transaction.merchant, 
            label: `${transaction.merchant}`, 
            type: 'receiver',
            entity: transaction.merchant,
            riskLevel: transaction.riskLevel
          },
          position: receiverPosition
        });
        
        console.log(`➕ Added new receiver node ${transaction.merchant} with risk ${transaction.riskLevel}`);
      }

      // Generate a position for the new transaction node
      const newPosition = {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 150
      };

      // Determine node type based on risk level
      let nodeType = 'transaction';
      
      if (transaction.isFraud || transaction.riskLevel === 'L3') {
        nodeType = 'high';
      } else if (transaction.riskLevel === 'L2' || transaction.riskLevel === 'L1') {
        nodeType = 'medium';
      } else {
        nodeType = 'low';
      }

      // Add the new transaction node
      const newNode = {
        group: 'nodes' as const,
        data: { 
          id: transaction.id, 
          label: `TXN: $${transaction.amount}`, 
          type: nodeType,
          transaction: transaction,
          riskLevel: transaction.riskLevel
        },
        position: newPosition
      };

      cyRef.current!.add(newNode);

      // Add edges connecting the transaction to sender and receiver
      cyRef.current!.add({
        group: 'edges' as const,
        data: { 
          id: `edge_${transaction.id}_customer`, 
          source: transaction.customer, 
          target: transaction.id,
          riskLevel: transaction.riskLevel
        }
      });

      cyRef.current!.add({
        group: 'edges' as const,
        data: { 
          id: `edge_${transaction.id}_merchant`, 
          source: transaction.id, 
          target: transaction.merchant,
          riskLevel: transaction.riskLevel
        }
      });

      console.log(`✅ Added transaction ${transaction.id} with risk ${transaction.riskLevel} and updated node colors`);

      // Fit the view to include the new node
      setTimeout(() => {
        if (isCyValid()) {
          cyRef.current!.fit();
        }
        // Notify parent that transaction has been added
        if (onTransactionAdded) {
          onTransactionAdded();
        }
      }, 100);

    } catch (error) {
      console.error('Error adding transaction node:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedNode(null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div className="network-graph" style={{ width: '100%', height: '100%' }}>
        <div className="graph-header">
          <h3>Transaction Network Analysis</h3>
        </div>
        
        {/* Risk Level Legend */}
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          padding: '10px', 
          borderRadius: '6px', 
          zIndex: 1000,
          fontSize: '12px',
          color: 'white'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Risk Levels</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: riskColors.L3, marginRight: '6px', borderRadius: '50%' }}></div>
            <span>L3 - Red Flag</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: riskColors.L2, marginRight: '6px', borderRadius: '50%' }}></div>
            <span>L2 - Outbound Freeze</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: riskColors.L1, marginRight: '6px', borderRadius: '50%' }}></div>
            <span>L1 - Watchlist</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: riskColors.L0, marginRight: '6px', borderRadius: '50%' }}></div>
            <span>L0 - Normal</span>
          </div>
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
      </div>

      {/* Transaction Details Modal */}
      {selectedNode && (
        <TransactionDetails 
          selectedNode={selectedNode}
          allTransactions={allTransactions}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default NetworkGraphCytoscape;