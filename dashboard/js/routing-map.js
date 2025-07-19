// Routing Map Visualization for GOSEL Payment System Monitor

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the routing map
    initializeRoutingMap();
    
    // Update the map with simulated transactions periodically
    setInterval(simulateTransactions, 2000);
});

// Map data
const mapData = {
    nodes: [
        // Malaysia
        { id: 'maybank', name: 'Maybank', country: 'Malaysia', type: 'bank', status: 'active', x: 650, y: 280 },
        { id: 'ambank', name: 'AmBank', country: 'Malaysia', type: 'bank', status: 'active', x: 640, y: 290 },
        { id: 'tng', name: 'Touch n Go', country: 'Malaysia', type: 'psp', status: 'active', x: 630, y: 270 },
        { id: 'grabpay_my', name: 'GrabPay MY', country: 'Malaysia', type: 'psp', status: 'active', x: 645, y: 275 },
        
        // Singapore
        { id: 'dbs', name: 'DBS', country: 'Singapore', type: 'bank', status: 'active', x: 650, y: 300 },
        { id: 'uob', name: 'UOB', country: 'Singapore', type: 'bank', status: 'active', x: 655, y: 305 },
        { id: 'ocbc', name: 'OCBC', country: 'Singapore', type: 'bank', status: 'active', x: 645, y: 310 },
        
        // Thailand
        { id: 'scb', name: 'SCB', country: 'Thailand', type: 'bank', status: 'active', x: 620, y: 250 },
        { id: 'bangkok_bank', name: 'Bangkok Bank', country: 'Thailand', type: 'bank', status: 'active', x: 625, y: 240 },
        { id: 'promptpay', name: 'PromptPay', country: 'Thailand', type: 'network', status: 'active', x: 615, y: 245 },
        
        // Indonesia
        { id: 'bca', name: 'BCA', country: 'Indonesia', type: 'bank', status: 'active', x: 670, y: 330 },
        { id: 'mandiri', name: 'Mandiri', country: 'Indonesia', type: 'bank', status: 'active', x: 680, y: 335 },
        { id: 'gopay', name: 'GoPay', country: 'Indonesia', type: 'psp', status: 'active', x: 675, y: 325 },
        
        // Philippines
        { id: 'bpi', name: 'BPI', country: 'Philippines', type: 'bank', status: 'active', x: 710, y: 270 },
        { id: 'bdo', name: 'BDO', country: 'Philippines', type: 'bank', status: 'degraded', x: 720, y: 275 },
        { id: 'gcash', name: 'GCash', country: 'Philippines', type: 'psp', status: 'active', x: 715, y: 265 },
        
        // Vietnam
        { id: 'vietcombank', name: 'Vietcombank', country: 'Vietnam', type: 'bank', status: 'active', x: 670, y: 240 },
        { id: 'momo', name: 'MoMo', country: 'Vietnam', type: 'psp', status: 'active', x: 675, y: 235 },
        
        // China
        { id: 'icbc', name: 'ICBC', country: 'China', type: 'bank', status: 'active', x: 700, y: 200 },
        { id: 'alipay', name: 'Alipay', country: 'China', type: 'psp', status: 'active', x: 710, y: 190 },
        { id: 'wechat_pay', name: 'WeChat Pay', country: 'China', type: 'psp', status: 'active', x: 690, y: 195 },
        
        // Japan
        { id: 'mufg', name: 'MUFG', country: 'Japan', type: 'bank', status: 'active', x: 780, y: 180 },
        { id: 'mizuho', name: 'Mizuho', country: 'Japan', type: 'bank', status: 'active', x: 790, y: 175 },
        { id: 'paypay', name: 'PayPay', country: 'Japan', type: 'psp', status: 'active', x: 785, y: 170 },
        
        // South Korea
        { id: 'kb', name: 'KB Bank', country: 'South Korea', type: 'bank', status: 'active', x: 760, y: 160 },
        { id: 'kakao_pay', name: 'Kakao Pay', country: 'South Korea', type: 'psp', status: 'active', x: 765, y: 155 },
        
        // India
        { id: 'sbi', name: 'SBI', country: 'India', type: 'bank', status: 'active', x: 580, y: 220 },
        { id: 'hdfc', name: 'HDFC', country: 'India', type: 'bank', status: 'active', x: 570, y: 230 },
        { id: 'paytm', name: 'Paytm', country: 'India', type: 'psp', status: 'active', x: 575, y: 225 },
        { id: 'upi', name: 'UPI', country: 'India', type: 'network', status: 'active', x: 565, y: 215 },
        
        // Australia
        { id: 'commonwealth', name: 'Commonwealth', country: 'Australia', type: 'bank', status: 'active', x: 750, y: 400 },
        { id: 'anz', name: 'ANZ', country: 'Australia', type: 'bank', status: 'active', x: 760, y: 410 },
        
        // United States
        { id: 'jpmorgan', name: 'JPMorgan', country: 'United States', type: 'bank', status: 'active', x: 250, y: 200 },
        { id: 'citi', name: 'Citibank', country: 'United States', type: 'bank', status: 'active', x: 240, y: 210 },
        { id: 'paypal', name: 'PayPal', country: 'United States', type: 'psp', status: 'active', x: 230, y: 205 },
        
        // United Kingdom
        { id: 'hsbc', name: 'HSBC', country: 'United Kingdom', type: 'bank', status: 'active', x: 400, y: 150 },
        { id: 'barclays', name: 'Barclays', country: 'United Kingdom', type: 'bank', status: 'active', x: 390, y: 145 },
        
        // Germany
        { id: 'deutsche', name: 'Deutsche Bank', country: 'Germany', type: 'bank', status: 'active', x: 430, y: 160 },
        
        // France
        { id: 'bnp', name: 'BNP Paribas', country: 'France', type: 'bank', status: 'active', x: 410, y: 170 },
        
        // Inactive nodes for demonstration
        { id: 'bdo_down', name: 'BDO Branch', country: 'Philippines', type: 'bank', status: 'inactive', x: 725, y: 280 },
        { id: 'swift', name: 'SWIFT', country: 'Global', type: 'network', status: 'degraded', x: 450, y: 200 }
    ],
    // Initial paths - more will be dynamically generated
    paths: [
        { source: 'maybank', target: 'dbs', status: 'active', volume: 'high' },
        { source: 'maybank', target: 'uob', status: 'active', volume: 'medium' },
        { source: 'ambank', target: 'dbs', status: 'active', volume: 'medium' },
        { source: 'tng', target: 'grabpay_my', status: 'active', volume: 'high' },
        { source: 'grabpay_my', target: 'dbs', status: 'active', volume: 'medium' },
        { source: 'scb', target: 'dbs', status: 'active', volume: 'medium' },
        { source: 'promptpay', target: 'tng', status: 'active', volume: 'medium' },
        { source: 'bca', target: 'dbs', status: 'active', volume: 'low' },
        { source: 'gopay', target: 'grabpay_my', status: 'active', volume: 'medium' },
        { source: 'bpi', target: 'dbs', status: 'active', volume: 'low' },
        { source: 'gcash', target: 'grabpay_my', status: 'active', volume: 'medium' },
        { source: 'momo', target: 'tng', status: 'active', volume: 'low' },
        { source: 'alipay', target: 'wechat_pay', status: 'active', volume: 'high' },
        { source: 'alipay', target: 'paytm', status: 'active', volume: 'medium' },
        { source: 'wechat_pay', target: 'kakao_pay', status: 'active', volume: 'medium' },
        { source: 'paypay', target: 'kakao_pay', status: 'active', volume: 'low' },
        { source: 'paytm', target: 'upi', status: 'active', volume: 'high' },
        { source: 'paypal', target: 'dbs', status: 'active', volume: 'medium' },
        { source: 'hsbc', target: 'maybank', status: 'active', volume: 'medium' },
        { source: 'jpmorgan', target: 'hsbc', status: 'active', volume: 'high' },
        { source: 'deutsche', target: 'hsbc', status: 'active', volume: 'medium' },
        { source: 'bnp', target: 'hsbc', status: 'active', volume: 'medium' },
        // Fallback paths
        { source: 'bdo', target: 'bpi', status: 'fallback', volume: 'low' },
        { source: 'swift', target: 'jpmorgan', status: 'fallback', volume: 'low' },
        { source: 'swift', target: 'hsbc', status: 'fallback', volume: 'low' }
    ]
};

// Active transactions array
let activeTransactions = [];

// Initialize the routing map
function initializeRoutingMap() {
    const mapContainer = document.getElementById('routing-map');
    
    if (!mapContainer) return;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 900 500');
    mapContainer.appendChild(svg);
    
    // Create world map background
    createWorldMapBackground(svg);
    
    // Create path elements
    createPaths(svg);
    
    // Create node elements
    createNodes(svg);
}

// Create a simplified world map background
function createWorldMapBackground(svg) {
    // Create a group for the map
    const mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mapGroup.setAttribute('class', 'world-map');
    
    // Simplified world map path (very basic outline)
    const mapPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mapPath.setAttribute('d', 'M150,120 C200,80 250,80 300,100 C350,120 400,130 450,120 C500,110 550,100 600,120 C650,140 700,160 750,150 C800,140 850,160 900,180 L900,400 C850,380 800,390 750,380 C700,370 650,350 600,360 C550,370 500,390 450,380 C400,370 350,360 300,370 C250,380 200,390 150,380 L150,120 Z');
    mapPath.setAttribute('fill', '#f0f4f8');
    mapPath.setAttribute('stroke', '#e2e8f0');
    mapPath.setAttribute('stroke-width', '1');
    
    mapGroup.appendChild(mapPath);
    svg.appendChild(mapGroup);
}

// Create path elements
function createPaths(svg) {
    // Create a group for paths
    const pathsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pathsGroup.setAttribute('class', 'paths');
    
    // Create each path
    mapData.paths.forEach(path => {
        const source = mapData.nodes.find(node => node.id === path.source);
        const target = mapData.nodes.find(node => node.id === path.target);
        
        if (!source || !target) return;
        
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', `M${source.x},${source.y} L${target.x},${target.y}`);
        pathElement.setAttribute('class', `path ${path.status}`);
        pathElement.setAttribute('data-source', path.source);
        pathElement.setAttribute('data-target', path.target);
        pathElement.setAttribute('data-volume', path.volume);
        
        // Set style based on status
        if (path.status === 'active') {
            pathElement.setAttribute('stroke', '#3b82f6');
            pathElement.setAttribute('stroke-width', getStrokeWidth(path.volume));
            pathElement.setAttribute('stroke-opacity', '0.4');
        } else if (path.status === 'fallback') {
            pathElement.setAttribute('stroke', '#f59e0b');
            pathElement.setAttribute('stroke-width', getStrokeWidth(path.volume));
            pathElement.setAttribute('stroke-dasharray', '5,3');
            pathElement.setAttribute('stroke-opacity', '0.4');
        }
        
        pathsGroup.appendChild(pathElement);
    });
    
    svg.appendChild(pathsGroup);
}

// Get stroke width based on volume
function getStrokeWidth(volume) {
    switch (volume) {
        case 'high': return '3';
        case 'medium': return '2';
        case 'low': return '1';
        default: return '1';
    }
}

// Create node elements
function createNodes(svg) {
    // Create a group for nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'nodes');
    
    // Create each node
    mapData.nodes.forEach(node => {
        // Create node group
        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('class', 'node');
        nodeGroup.setAttribute('data-id', node.id);
        nodeGroup.setAttribute('data-type', node.type);
        nodeGroup.setAttribute('data-country', node.country);
        nodeGroup.setAttribute('transform', `translate(${node.x},${node.y})`);
        
        // Create node circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', node.type === 'network' ? '6' : '4');
        circle.setAttribute('fill', getNodeColor(node.status));
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '1');
        
        // Add tooltip
        nodeGroup.addEventListener('mouseover', function(event) {
            showTooltip(event, node);
        });
        
        nodeGroup.addEventListener('mouseout', function() {
            hideTooltip();
        });
        
        nodeGroup.appendChild(circle);
        nodesGroup.appendChild(nodeGroup);
    });
    
    svg.appendChild(nodesGroup);
    
    // Create tooltip element
    createTooltip();
}

// Get node color based on status
function getNodeColor(status) {
    switch (status) {
        case 'active': return '#10b981';
        case 'degraded': return '#f59e0b';
        case 'inactive': return '#ef4444';
        default: return '#64748b';
    }
}

// Create tooltip element
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'map-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    tooltip.style.border = '1px solid #e2e8f0';
    tooltip.style.borderRadius = '4px';
    tooltip.style.padding = '8px 12px';
    tooltip.style.fontSize = '12px';
    tooltip.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    tooltip.style.zIndex = '1000';
    
    document.body.appendChild(tooltip);
}

// Show tooltip
function showTooltip(event, node) {
    const tooltip = document.getElementById('map-tooltip');
    if (!tooltip) return;
    
    // Set tooltip content
    tooltip.innerHTML = `
        <div style="font-weight: bold;">${node.name}</div>
        <div>${node.country}</div>
        <div>Type: ${capitalizeFirstLetter(node.type)}</div>
        <div>Status: ${capitalizeFirstLetter(node.status)}</div>
    `;
    
    // Position tooltip
    const mapContainer = document.getElementById('routing-map');
    const rect = mapContainer.getBoundingClientRect();
    const x = rect.left + node.x + window.scrollX;
    const y = rect.top + node.y + window.scrollY - 10;
    
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
    tooltip.style.display = 'block';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('map-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Simulate transactions
function simulateTransactions() {
    // Remove completed transactions
    activeTransactions = activeTransactions.filter(tx => {
        const progress = (Date.now() - tx.startTime) / tx.duration;
        return progress < 1;
    });
    
    // Add new transactions
    if (activeTransactions.length < 15 && Math.random() > 0.3) {
        addNewTransaction();
    }
    
    // Update transaction animations
    updateTransactionAnimations();
}

// Add a new transaction
function addNewTransaction() {
    // Get a random path
    const paths = Array.from(document.querySelectorAll('.path'));
    if (paths.length === 0) return;
    
    const randomPath = paths[Math.floor(Math.random() * paths.length)];
    const sourceId = randomPath.getAttribute('data-source');
    const targetId = randomPath.getAttribute('data-target');
    const volume = randomPath.getAttribute('data-volume');
    
    // Find source and target nodes
    const source = mapData.nodes.find(node => node.id === sourceId);
    const target = mapData.nodes.find(node => node.id === targetId);
    
    if (!source || !target) return;
    
    // Create transaction
    const transaction = {
        id: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        sourceId,
        targetId,
        startTime: Date.now(),
        duration: 2000 + Math.random() * 3000, // 2-5 seconds
        element: null
    };
    
    // Create transaction element
    const svg = document.querySelector('#routing-map svg');
    if (!svg) return;
    
    const txElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    txElement.setAttribute('r', volume === 'high' ? '3' : '2');
    txElement.setAttribute('fill', '#3b82f6');
    txElement.setAttribute('class', 'transaction');
    
    svg.appendChild(txElement);
    transaction.element = txElement;
    
    // Add to active transactions
    activeTransactions.push(transaction);
}

// Update transaction animations
function updateTransactionAnimations() {
    activeTransactions.forEach(tx => {
        const progress = (Date.now() - tx.startTime) / tx.duration;
        
        if (progress >= 1) {
            // Remove completed transaction
            if (tx.element && tx.element.parentNode) {
                tx.element.parentNode.removeChild(tx.element);
            }
            return;
        }
        
        // Find source and target nodes
        const source = mapData.nodes.find(node => node.id === tx.sourceId);
        const target = mapData.nodes.find(node => node.id === tx.targetId);
        
        if (!source || !target || !tx.element) return;
        
        // Calculate current position
        const x = source.x + (target.x - source.x) * progress;
        const y = source.y + (target.y - source.y) * progress;
        
        // Update position
        tx.element.setAttribute('cx', x);
        tx.element.setAttribute('cy', y);
    });
} 