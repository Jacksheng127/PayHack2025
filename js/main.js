// Main JavaScript for GOSEL Payment System Monitor

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
    
    // Set up navigation
    setupNavigation();
    
    // Initialize tabs
    setupTabs();
    
    // Set up modals
    setupModals();
    
    // Update the last updated time
    updateLastUpdatedTime();
    
    // Set up search functionality
    setupSearch();
});

// Initialize the dashboard with real-time data
function initializeDashboard() {
    // Update the dashboard data every 30 seconds
    updateDashboardData();
    setInterval(updateDashboardData, 30000);
}

// Update all dashboard data
function updateDashboardData() {
    updateLastUpdatedTime();
    
    // In a real application, this would fetch data from an API
    // For this mock, we'll simulate data changes
    simulateDataChanges();
}

// Update the last updated time display
function updateLastUpdatedTime() {
    const now = new Date();
    const formattedTime = now.toLocaleString();
    
    // Update all timestamp elements
    document.querySelectorAll('#last-updated, .update-time').forEach(el => {
        el.textContent = formattedTime;
    });
}

// Set up navigation between pages
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-menu li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show the corresponding page
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });
}

// Show a specific page and hide others
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
}

// Set up tab functionality
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the parent tabs container
            const tabsContainer = this.closest('.tabs');
            
            // Remove active class from all tabs in this container
            tabsContainer.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get the tab content id
            const contentId = this.getAttribute('data-tab');
            
            // Get all tab contents that are siblings to this tabs container
            const tabContents = tabsContainer.parentNode.querySelectorAll('.tab-content');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected tab content
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// Set up modal functionality
function setupModals() {
    // Close modal when clicking the close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside the modal content
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Set up transaction detail view
    setupTransactionDetailView();
}

// Open a modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close a modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Set up transaction detail view
function setupTransactionDetailView() {
    // Add click event to view transaction details
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('view-transaction')) {
            const transactionId = event.target.getAttribute('data-id');
            viewTransactionDetails(transactionId);
        }
    });
}

// View transaction details
function viewTransactionDetails(transactionId) {
    // In a real application, this would fetch transaction details from an API
    // For this mock, we'll use the mockTransactionDetails from mock-data.js
    const transaction = mockTransactionDetails[transactionId] || mockTransactionDetails['default'];
    
    // Populate the modal with transaction details
    const content = document.getElementById('transaction-detail-content');
    
    content.innerHTML = `
        <div class="transaction-detail">
            <div class="detail-header">
                <h4>Transaction ID: ${transaction.id}</h4>
                <span class="status ${transaction.status.toLowerCase()}">${transaction.status}</span>
            </div>
            
            <div class="detail-section">
                <h5>Basic Information</h5>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="label">Date & Time:</span>
                        <span class="value">${transaction.dateTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Amount:</span>
                        <span class="value">${transaction.amount}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Converted Amount:</span>
                        <span class="value">${transaction.convertedAmount}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">FX Rate:</span>
                        <span class="value">${transaction.fxRate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Fees:</span>
                        <span class="value">${transaction.fees}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h5>Parties</h5>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="label">Sender:</span>
                        <span class="value">${transaction.sender}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Sender Bank/PSP:</span>
                        <span class="value">${transaction.senderPSP}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Receiver:</span>
                        <span class="value">${transaction.receiver}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Receiver Bank/PSP:</span>
                        <span class="value">${transaction.receiverPSP}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h5>Routing Information</h5>
                <div class="detail-item">
                    <span class="label">Payment Path:</span>
                    <span class="value">${transaction.paymentPath}</span>
                </div>
                ${transaction.fallbackPath ? `
                <div class="detail-item">
                    <span class="label">Fallback Path:</span>
                    <span class="value">${transaction.fallbackPath}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Fallback Reason:</span>
                    <span class="value">${transaction.fallbackReason}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="detail-section">
                <h5>Digital Signatures</h5>
                <div class="signatures">
                    ${transaction.signatures.map(sig => `
                        <div class="signature-item">
                            <div class="signature-party">${sig.party}</div>
                            <div class="signature-hash">${sig.hash}</div>
                            <div class="signature-timestamp">${sig.timestamp}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-actions">
                <button class="btn outline">Export</button>
                <button class="btn outline">View Audit Trail</button>
                ${transaction.status === 'Failed' ? `<button class="btn primary">Initiate Dispute</button>` : ''}
            </div>
        </div>
    `;
    
    // Open the modal
    openModal('transaction-detail-modal');
}

// Set up search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // In a real application, this would search through actual data
        // For this mock, we'll just log the search term
        console.log('Searching for:', searchTerm);
    });
    
    // Set up transaction search
    setupTransactionSearch();
    
    // Set up participant search
    setupParticipantSearch();
}

// Set up transaction search
function setupTransactionSearch() {
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Get all filter values
            const txnId = document.getElementById('txn-id-filter').value;
            const psp = document.getElementById('psp-filter').value;
            const status = document.getElementById('status-filter').value;
            const dateFrom = document.getElementById('date-from').value;
            const dateTo = document.getElementById('date-to').value;
            const minAmount = document.getElementById('min-amount').value;
            const maxAmount = document.getElementById('max-amount').value;
            
            // In a real application, this would filter transactions based on criteria
            // For this mock, we'll just log the filter values
            console.log('Filtering transactions:', {
                txnId, psp, status, dateFrom, dateTo, minAmount, maxAmount
            });
            
            // Simulate filtered results
            populateTransactionTable(mockTransactions.slice(0, 5));
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset all filter inputs
            document.querySelectorAll('#transactions input, #transactions select').forEach(input => {
                input.value = '';
            });
            
            // Reset the table to show all transactions
            populateTransactionTable(mockTransactions);
        });
    }
    
    // Initial population of transaction table
    populateTransactionTable(mockTransactions);
}

// Populate transaction table with data
function populateTransactionTable(transactions) {
    const tableBody = document.getElementById('transaction-table');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    transactions.forEach(txn => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${txn.id}</td>
            <td>${txn.dateTime}</td>
            <td>${txn.sender}</td>
            <td>${txn.receiver}</td>
            <td>${txn.amount}</td>
            <td>${txn.fxRate}</td>
            <td>${txn.paymentPath}</td>
            <td><span class="status ${txn.status.toLowerCase()}">${txn.status}</span></td>
            <td>
                <button class="btn outline view-transaction" data-id="${txn.id}">View</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Set up participant search
function setupParticipantSearch() {
    const participantSearch = document.getElementById('participant-search');
    const typeFilter = document.getElementById('participant-type-filter');
    const statusFilter = document.getElementById('participant-status-filter');
    
    const filterParticipants = () => {
        const searchTerm = participantSearch ? participantSearch.value.toLowerCase() : '';
        const type = typeFilter ? typeFilter.value : '';
        const status = statusFilter ? statusFilter.value : '';
        
        // In a real application, this would filter participants based on criteria
        // For this mock, we'll just log the filter values
        console.log('Filtering participants:', { searchTerm, type, status });
        
        // Simulate filtered results
        populateParticipantsTable(mockParticipants);
    };
    
    // Add event listeners
    if (participantSearch) {
        participantSearch.addEventListener('input', filterParticipants);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', filterParticipants);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterParticipants);
    }
    
    // Initial population of participants table
    populateParticipantsTable(mockParticipants);
    
    // Initial population of country list
    populateCountryList();
}

// Populate participants table with data
function populateParticipantsTable(participants) {
    const tableBody = document.getElementById('participants-table');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    participants.forEach(participant => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${participant.name}</td>
            <td>${participant.type}</td>
            <td>${participant.country}</td>
            <td><span class="status ${participant.status.toLowerCase()}">${participant.status}</span></td>
            <td>${participant.integrationDate}</td>
            <td>${participant.successRate}%</td>
            <td>
                <button class="btn outline">Details</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Populate country list
function populateCountryList() {
    const countryList = document.querySelector('.country-list');
    
    if (!countryList) return;
    
    // Group participants by country
    const countriesMap = {};
    
    mockParticipants.forEach(participant => {
        if (!countriesMap[participant.country]) {
            countriesMap[participant.country] = [];
        }
        
        countriesMap[participant.country].push(participant);
    });
    
    // Create country cards
    for (const [country, participants] of Object.entries(countriesMap)) {
        const countryCard = document.createElement('div');
        countryCard.className = 'country-card';
        
        // Get country flag emoji
        const flagEmoji = getCountryFlagEmoji(country);
        
        countryCard.innerHTML = `
            <h3>
                <span class="country-flag">${flagEmoji}</span>
                ${country}
            </h3>
            <div class="country-stats">
                <div class="stat">
                    <span class="label">Total Participants:</span>
                    <span class="value">${participants.length}</span>
                </div>
                <div class="stat">
                    <span class="label">Active:</span>
                    <span class="value">${participants.filter(p => p.status === 'Active').length}</span>
                </div>
            </div>
            <ul class="country-participants">
                ${participants.map(p => `
                    <li>
                        <span class="name">${p.name}</span>
                        <span class="type">${p.type}</span>
                        <span class="status ${p.status.toLowerCase()}">${p.status}</span>
                    </li>
                `).join('')}
            </ul>
        `;
        
        countryList.appendChild(countryCard);
    }
}

// Get country flag emoji (simplified version)
function getCountryFlagEmoji(country) {
    const flagEmojis = {
        'Malaysia': '🇲🇾',
        'Singapore': '🇸🇬',
        'Thailand': '🇹🇭',
        'Indonesia': '🇮🇩',
        'Philippines': '🇵🇭',
        'Vietnam': '🇻🇳',
        'United States': '🇺🇸',
        'United Kingdom': '🇬🇧',
        'China': '🇨🇳',
        'Japan': '🇯🇵',
        'South Korea': '🇰🇷',
        'India': '🇮🇳',
        'Australia': '🇦🇺',
        'Germany': '🇩🇪',
        'France': '🇫🇷'
    };
    
    return flagEmojis[country] || '🌐';
}

// Simulate data changes for real-time updates
function simulateDataChanges() {
    // Simulate transaction count changes
    const transactionCount = document.querySelector('.stat-value:nth-child(2)');
    if (transactionCount) {
        const currentCount = parseInt(transactionCount.textContent.replace(/,/g, ''));
        const newCount = currentCount + Math.floor(Math.random() * 10) - 2;
        transactionCount.textContent = newCount.toLocaleString();
    }
    
    // Simulate transaction value changes
    const transactionValue = document.querySelectorAll('.stat-value')[1];
    if (transactionValue) {
        const currentValue = parseFloat(transactionValue.textContent.replace(/\$|M/g, ''));
        const newValue = (currentValue + (Math.random() * 0.1 - 0.03)).toFixed(2);
        transactionValue.textContent = `$${newValue}M`;
    }
    
    // Simulate success rate changes
    const successRate = document.querySelectorAll('.stat-value')[2];
    if (successRate) {
        const currentRate = parseFloat(successRate.textContent.replace(/%/g, ''));
        const newRate = Math.min(100, Math.max(98, currentRate + (Math.random() * 0.2 - 0.1))).toFixed(1);
        successRate.textContent = `${newRate}%`;
    }
    
    // Simulate transaction speed changes
    const transactionSpeed = document.querySelectorAll('.stat-value')[3];
    if (transactionSpeed) {
        const currentSpeed = parseFloat(transactionSpeed.textContent.replace(/s/g, ''));
        const newSpeed = Math.max(0.8, Math.min(1.5, currentSpeed + (Math.random() * 0.1 - 0.05))).toFixed(1);
        transactionSpeed.textContent = `${newSpeed}s`;
    }
    
    // Simulate fallback rate changes
    const fallbackRate = document.querySelector('.metric-value');
    if (fallbackRate) {
        const currentRate = parseFloat(fallbackRate.textContent.replace(/%/g, ''));
        const newRate = Math.max(1.5, Math.min(3.5, currentRate + (Math.random() * 0.3 - 0.15))).toFixed(1);
        fallbackRate.textContent = `${newRate}%`;
    }
    
    // Update path metrics table with random changes
    updatePathMetricsTable();
    
    // Update fallback log with new entries occasionally
    if (Math.random() > 0.7) {
        addNewFallbackEvent();
    }
    
    // Update FX rates
    updateFXRates();
    
    // Update access logs occasionally
    if (Math.random() > 0.6) {
        addNewAccessLogEntry();
    }
}

// Update path metrics table
function updatePathMetricsTable() {
    const tableBody = document.getElementById('path-metrics');
    
    if (!tableBody) return;
    
    // If table is empty, populate it with initial data
    if (tableBody.children.length === 0) {
        mockPathMetrics.forEach(path => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${path.name}</td>
                <td>${path.latency} ms</td>
                <td>${path.successRate}%</td>
                <td>${path.reliabilityScore}/10</td>
                <td><span class="status ${path.status.toLowerCase()}">${path.status}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
    } else {
        // Update existing rows with small random changes
        Array.from(tableBody.children).forEach((row, index) => {
            const path = mockPathMetrics[index];
            
            // Update latency
            const latencyCell = row.children[1];
            let latency = parseInt(latencyCell.textContent);
            latency = Math.max(10, Math.min(500, latency + Math.floor(Math.random() * 11) - 5));
            latencyCell.textContent = `${latency} ms`;
            
            // Update success rate
            const successRateCell = row.children[2];
            let successRate = parseFloat(successRateCell.textContent.replace('%', ''));
            successRate = Math.max(90, Math.min(100, successRate + (Math.random() * 0.6 - 0.3))).toFixed(1);
            successRateCell.textContent = `${successRate}%`;
            
            // Occasionally update status
            if (Math.random() > 0.95) {
                const statusCell = row.children[4].firstChild;
                const currentStatus = statusCell.textContent;
                const newStatus = currentStatus === 'Active' ? 'Degraded' : 'Active';
                statusCell.textContent = newStatus;
                statusCell.className = `status ${newStatus.toLowerCase()}`;
            }
        });
    }
}

// Add new fallback event
function addNewFallbackEvent() {
    const tableBody = document.getElementById('fallback-log');
    
    if (!tableBody) return;
    
    // Create a new fallback event
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    
    const newEvent = {
        time: formattedTime,
        originalPath: `Maybank → DBS (${Math.random() > 0.5 ? 'Direct' : 'SWIFT'})`,
        fallbackPath: `Maybank → ${Math.random() > 0.5 ? 'UOB' : 'OCBC'} → DBS`,
        reason: Math.random() > 0.5 ? 'Timeout' : 'Connection Error',
        resolutionTime: `${Math.floor(Math.random() * 10) + 1}s`
    };
    
    // Create a new row
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${newEvent.time}</td>
        <td>${newEvent.originalPath}</td>
        <td>${newEvent.fallbackPath}</td>
        <td>${newEvent.reason}</td>
        <td>${newEvent.resolutionTime}</td>
    `;
    
    // Add the new row at the top of the table
    if (tableBody.firstChild) {
        tableBody.insertBefore(row, tableBody.firstChild);
        
        // Remove the last row if there are more than 10 rows
        if (tableBody.children.length > 10) {
            tableBody.removeChild(tableBody.lastChild);
        }
    } else {
        tableBody.appendChild(row);
    }
}

// Update FX rates
function updateFXRates() {
    const tableBody = document.getElementById('fx-rates');
    
    if (!tableBody) return;
    
    // If table is empty, populate it with initial data
    if (tableBody.children.length === 0) {
        mockFXRates.forEach(rate => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${rate.pair}</td>
                <td>${rate.rate}</td>
                <td class="${rate.change24h >= 0 ? 'positive' : 'negative'}">
                    ${rate.change24h >= 0 ? '+' : ''}${rate.change24h}%
                </td>
                <td class="${rate.change7d >= 0 ? 'positive' : 'negative'}">
                    ${rate.change7d >= 0 ? '+' : ''}${rate.change7d}%
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } else {
        // Update existing rows with small random changes
        Array.from(tableBody.children).forEach((row, index) => {
            // Update rate
            const rateCell = row.children[1];
            let rate = parseFloat(rateCell.textContent);
            rate = (rate + (Math.random() * 0.002 - 0.001)).toFixed(4);
            rateCell.textContent = rate;
            
            // Update 24h change
            const change24hCell = row.children[2];
            let change24h = parseFloat(change24hCell.textContent.replace(/[+%]/g, ''));
            change24h = (change24h + (Math.random() * 0.1 - 0.05)).toFixed(2);
            change24hCell.textContent = `${change24h >= 0 ? '+' : ''}${change24h}%`;
            change24hCell.className = change24h >= 0 ? 'positive' : 'negative';
            
            // Update 7d change
            const change7dCell = row.children[3];
            let change7d = parseFloat(change7dCell.textContent.replace(/[+%]/g, ''));
            change7d = (change7d + (Math.random() * 0.05 - 0.025)).toFixed(2);
            change7dCell.textContent = `${change7d >= 0 ? '+' : ''}${change7d}%`;
            change7dCell.className = change7d >= 0 ? 'positive' : 'negative';
        });
    }
}

// Add new access log entry
function addNewAccessLogEntry() {
    const tableBody = document.getElementById('access-logs');
    
    if (!tableBody) return;
    
    // Create a new access log entry
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    
    const users = ['admin@gosel.com', 'operator1@gosel.com', 'auditor@gosel.com', 'compliance@gosel.com'];
    const actions = ['View Transaction', 'Export Report', 'Modify Settings', 'View Audit Log', 'Update Participant'];
    const resources = ['Transaction #TXN-38291', 'Monthly Report', 'System Settings', 'Audit Trail', 'Participant: Maybank'];
    const statuses = ['Success', 'Success', 'Success', 'Failed'];
    
    const newEntry = {
        time: formattedTime,
        user: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)]
    };
    
    // Create a new row
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${newEntry.time}</td>
        <td>${newEntry.user}</td>
        <td>${newEntry.action}</td>
        <td>${newEntry.resource}</td>
        <td>${newEntry.ipAddress}</td>
        <td><span class="status ${newEntry.status.toLowerCase()}">${newEntry.status}</span></td>
    `;
    
    // Add the new row at the top of the table
    if (tableBody.firstChild) {
        tableBody.insertBefore(row, tableBody.firstChild);
        
        // Remove the last row if there are more than 10 rows
        if (tableBody.children.length > 10) {
            tableBody.removeChild(tableBody.lastChild);
        }
    } else {
        tableBody.appendChild(row);
    }
} 