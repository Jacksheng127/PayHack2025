// Mock Data for GOSEL Payment System Monitor React Version

export const mockTransactions = [
  {
    id: 'TXN-38291',
    dateTime: '2023-07-15 14:32:18',
    sender: 'John Smith',
    receiver: 'ABC Company',
    amount: '$1,250.00',
    fxRate: '1 USD = 4.21 MYR',
    paymentPath: 'Maybank → DBS',
    status: 'Success'
  },
  {
    id: 'TXN-38290',
    dateTime: '2023-07-15 14:28:05',
    sender: 'Sarah Lee',
    receiver: 'XYZ Corp',
    amount: '$3,750.00',
    fxRate: '1 USD = 1.35 SGD',
    paymentPath: 'AmBank → UOB',
    status: 'Success'
  },
  {
    id: 'TXN-38289',
    dateTime: '2023-07-15 14:15:42',
    sender: 'Tan Wei Ming',
    receiver: 'Global Imports',
    amount: '$850.00',
    fxRate: '1 USD = 4.21 MYR',
    paymentPath: 'TnG → GrabPay → DBS',
    status: 'Success'
  },
  {
    id: 'TXN-38288',
    dateTime: '2023-07-15 14:10:37',
    sender: 'Ahmad Zulkifli',
    receiver: 'Tech Solutions',
    amount: '$2,100.00',
    fxRate: '1 USD = 4.21 MYR',
    paymentPath: 'Maybank → DBS',
    status: 'Success'
  },
  {
    id: 'TXN-38287',
    dateTime: '2023-07-15 14:05:22',
    sender: 'Lisa Wong',
    receiver: 'Digital Services',
    amount: '$500.00',
    fxRate: '1 USD = 1.35 SGD',
    paymentPath: 'GrabPay → DBS',
    status: 'Failed'
  }
]

export const mockParticipants = [
  {
    name: 'Maybank',
    type: 'Bank',
    country: 'Malaysia',
    status: 'Active',
    integrationDate: '2023-01-15',
    successRate: '99.8%'
  },
  {
    name: 'DBS',
    type: 'Bank',
    country: 'Singapore',
    status: 'Active',
    integrationDate: '2023-02-20',
    successRate: '99.5%'
  },
  {
    name: 'Touch n Go',
    type: 'PSP',
    country: 'Malaysia',
    status: 'Active',
    integrationDate: '2023-03-10',
    successRate: '99.2%'
  },
  {
    name: 'GrabPay',
    type: 'PSP',
    country: 'Multi-region',
    status: 'Active',
    integrationDate: '2023-01-30',
    successRate: '98.9%'
  },
  {
    name: 'SWIFT',
    type: 'Network',
    country: 'Global',
    status: 'Active',
    integrationDate: '2023-01-01',
    successRate: '99.9%'
  }
]

export const mockPathMetrics = [
  {
    path: 'Maybank → DBS',
    latency: '180ms',
    successRate: '99.8%',
    reliabilityScore: '9.8',
    status: 'Active'
  },
  {
    path: 'TnG → GrabPay → DBS',
    latency: '350ms',
    successRate: '99.2%',
    reliabilityScore: '9.5',
    status: 'Active'
  },
  {
    path: 'AmBank → UOB',
    latency: '210ms',
    successRate: '99.5%',
    reliabilityScore: '9.7',
    status: 'Active'
  },
  {
    path: 'SWIFT → HSBC',
    latency: '450ms',
    successRate: '98.9%',
    reliabilityScore: '9.2',
    status: 'Fallback'
  }
]

export const mockFallbackLog = [
  {
    time: '14:32:18',
    originalPath: 'Maybank → DBS',
    fallbackPath: 'SWIFT → HSBC',
    reason: 'High latency detected',
    resolutionTime: '2.3s'
  },
  {
    time: '13:45:22',
    originalPath: 'TnG → GrabPay',
    fallbackPath: 'Maybank → DBS',
    reason: 'Connection timeout',
    resolutionTime: '1.8s'
  },
  {
    time: '12:28:15',
    originalPath: 'AmBank → UOB',
    fallbackPath: 'DBS → OCBC',
    reason: 'Rate limit exceeded',
    resolutionTime: '1.5s'
  }
]

export const mockAccessLogs = [
  {
    time: '14:32:18',
    user: 'admin@gosel.com',
    action: 'Login',
    resource: 'Dashboard',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    time: '14:28:05',
    user: 'operator@gosel.com',
    action: 'View Transactions',
    resource: 'Transaction History',
    ipAddress: '192.168.1.101',
    status: 'Success'
  },
  {
    time: '14:15:42',
    user: 'admin@gosel.com',
    action: 'Export Data',
    resource: 'Participant List',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    time: '14:10:37',
    user: 'unknown@external.com',
    action: 'Failed Login',
    resource: 'Dashboard',
    ipAddress: '203.45.67.89',
    status: 'Failed'
  },
  {
    time: '14:05:22',
    user: 'supervisor@gosel.com',
    action: 'Modify Settings',
    resource: 'System Configuration',
    ipAddress: '192.168.1.102',
    status: 'Success'
  }
]

// Chart data generators
export const generateTransactionVolumeData = () => {
  const labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00']
  return {
    labels,
    datasets: [
      {
        label: 'Transactions',
        data: [850, 420, 680, 1200, 1800, 2100, 1650, 1350, 950],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.1,
      },
    ],
  }
}

export const generateSuccessRateData = () => {
  const labels = ['Malaysia', 'Singapore', 'Thailand', 'Indonesia', 'Philippines']
  return {
    labels,
    datasets: [
      {
        label: 'Success Rate (%)',
        data: [99.7, 99.5, 98.9, 99.2, 98.7],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }
}

export const generateFallbackRateData = () => {
  const labels = Array.from({ length: 24 }, (_, i) => i)
  return {
    labels,
    datasets: [
      {
        label: 'Fallback Rate',
        data: [2.1, 2.3, 2.0, 2.5, 2.8, 2.2, 2.1, 2.4, 2.6, 2.3, 2.1, 2.0, 1.9, 2.2, 2.5, 2.7, 2.4, 2.1, 2.0, 2.3, 2.5, 2.2, 2.1, 2.3],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
}
