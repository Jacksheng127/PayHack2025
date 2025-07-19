// Charts for GOSEL Payment System Monitor

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initializeCharts();
    
    // Update charts periodically
    setInterval(updateCharts, 30000);
});

// Initialize all charts
function initializeCharts() {
    // Dashboard charts
    createTransactionVolumeChart();
    createSuccessRateChart();
    createFallbackRateChart();
    
    // Smart routing charts
    createFXRateChart();
    
    // Participant charts
    createPSPPerformanceChart();
    createLatencyChart();
}

// Update all charts with new data
function updateCharts() {
    // In a real application, this would fetch new data from an API
    // For this mock, we'll simulate data changes
    
    // Get all chart instances
    const charts = Object.values(Chart.instances);
    
    // Update each chart with slightly modified data
    charts.forEach(chart => {
        // Skip updating if chart is not visible
        if (!isElementVisible(chart.canvas)) return;
        
        // Get current data
        const data = chart.data.datasets[0].data;
        
        // Create new data with small random changes
        const newData = data.map(value => {
            // Add a random change of up to ±5%
            const change = value * (Math.random() * 0.1 - 0.05);
            return Math.max(0, value + change);
        });
        
        // Update chart data
        chart.data.datasets[0].data = newData;
        
        // Update chart
        chart.update();
    });
}

// Check if an element is visible in the viewport
function isElementVisible(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Create transaction volume chart
function createTransactionVolumeChart() {
    const ctx = document.getElementById('transactionVolumeChart');
    
    if (!ctx) return;
    
    // Generate time labels for 24 hours
    const timeLabels = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const ampm = i < 12 ? 'AM' : 'PM';
        return `${hour} ${ampm}`;
    });
    
    // Generate transaction volume data
    const volumeData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 1500) + 500);
    
    // Create the chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [{
                label: 'Transaction Volume',
                data: volumeData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Create success rate chart
function createSuccessRateChart() {
    const ctx = document.getElementById('successRateChart');
    
    if (!ctx) return;
    
    // Define origins
    const origins = ['Malaysia', 'Singapore', 'Thailand', 'Indonesia', 'Philippines', 'Vietnam'];
    
    // Generate success rate data
    const successRateData = origins.map(() => (Math.random() * 2) + 98);
    
    // Create the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: origins,
            datasets: [{
                label: 'Success Rate (%)',
                data: successRateData,
                backgroundColor: '#10b981',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    min: 95,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Create fallback rate chart
function createFallbackRateChart() {
    const ctx = document.getElementById('fallbackRateChart');
    
    if (!ctx) return;
    
    // Generate time labels for 30 days
    const dateLabels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    // Generate fallback rate data
    const fallbackRateData = Array.from({ length: 30 }, () => (Math.random() * 3) + 1);
    
    // Create the chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [{
                label: 'Fallback Rate (%)',
                data: fallbackRateData,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 5,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Create FX rate chart
function createFXRateChart() {
    const ctx = document.getElementById('fxRateChart');
    
    if (!ctx) return;
    
    // Generate time labels for 7 days
    const dateLabels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    // Generate FX rate data for major currency pairs
    const usdMyrData = Array.from({ length: 7 }, (_, i) => 4.2 + (Math.random() * 0.1 - 0.05));
    const usdSgdData = Array.from({ length: 7 }, (_, i) => 1.35 + (Math.random() * 0.05 - 0.025));
    const eurUsdData = Array.from({ length: 7 }, (_, i) => 1.08 + (Math.random() * 0.04 - 0.02));
    
    // Create the chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [
                {
                    label: 'USD/MYR',
                    data: usdMyrData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'USD/SGD',
                    data: usdSgdData,
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: 'EUR/USD',
                    data: eurUsdData,
                    borderColor: '#f59e0b',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// Create PSP performance chart
function createPSPPerformanceChart() {
    const ctx = document.getElementById('pspPerformanceChart');
    
    if (!ctx) return;
    
    // Define PSPs
    const psps = ['Maybank', 'AmBank', 'TnG', 'GrabPay', 'DBS', 'UOB'];
    
    // Generate performance score data
    const performanceData = psps.map(() => (Math.random() * 2) + 8);
    
    // Create the chart
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: psps,
            datasets: [{
                label: 'Performance Score',
                data: performanceData,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                borderWidth: 2,
                pointBackgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: false,
                    min: 7,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Create latency chart
function createLatencyChart() {
    const ctx = document.getElementById('latencyChart');
    
    if (!ctx) return;
    
    // Define participants
    const participants = ['Maybank', 'AmBank', 'TnG', 'GrabPay', 'DBS', 'UOB'];
    
    // Generate latency data
    const latencyData = participants.map(() => Math.floor(Math.random() * 100) + 50);
    
    // Create the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: participants,
            datasets: [{
                label: 'Latency (ms)',
                data: latencyData,
                backgroundColor: latencyData.map(value => {
                    if (value < 80) return '#10b981'; // Good
                    if (value < 120) return '#f59e0b'; // Warning
                    return '#ef4444'; // Bad
                })
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
} 