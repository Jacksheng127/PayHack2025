// Mock Data for GOSEL Payment System Monitor

// Mock Transactions
const mockTransactions = [
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
        status: 'Success'
    },
    {
        id: 'TXN-38286',
        dateTime: '2023-07-15 13:58:10',
        sender: 'David Chen',
        receiver: 'Innovative Solutions',
        amount: '$1,800.00',
        fxRate: '1 USD = 1.35 SGD',
        paymentPath: 'UOB → OCBC',
        status: 'Success'
    },
    {
        id: 'TXN-38285',
        dateTime: '2023-07-15 13:45:33',
        sender: 'Priya Sharma',
        receiver: 'Global Exports',
        amount: '$3,200.00',
        fxRate: '1 USD = 74.50 INR',
        paymentPath: 'Paytm → UPI → HSBC → Maybank',
        status: 'Success'
    },
    {
        id: 'TXN-38284',
        dateTime: '2023-07-15 13:30:19',
        sender: 'Michael Johnson',
        receiver: 'Tech Innovations',
        amount: '$5,000.00',
        fxRate: '1 USD = 1.00 USD',
        paymentPath: 'JPMorgan → SWIFT → HSBC',
        status: 'Failed'
    },
    {
        id: 'TXN-38283',
        dateTime: '2023-07-15 13:22:05',
        sender: 'Samantha Lee',
        receiver: 'Creative Solutions',
        amount: '$750.00',
        fxRate: '1 USD = 4.21 MYR',
        paymentPath: 'TnG → Maybank',
        status: 'Success'
    },
    {
        id: 'TXN-38282',
        dateTime: '2023-07-15 13:15:47',
        sender: 'Rajesh Patel',
        receiver: 'Global Ventures',
        amount: '$2,500.00',
        fxRate: '1 USD = 74.50 INR',
        paymentPath: 'HDFC → SBI → DBS',
        status: 'Pending'
    },
    {
        id: 'TXN-38281',
        dateTime: '2023-07-15 13:10:22',
        sender: 'Emma Wilson',
        receiver: 'Digital Enterprises',
        amount: '$1,200.00',
        fxRate: '1 USD = 0.92 EUR',
        paymentPath: 'Barclays → Deutsche Bank',
        status: 'Success'
    },
    {
        id: 'TXN-38280',
        dateTime: '2023-07-15 13:05:18',
        sender: 'Liu Wei',
        receiver: 'Tech Innovations',
        amount: '$3,500.00',
        fxRate: '1 USD = 7.18 CNY',
        paymentPath: 'ICBC → Alipay → PayPal',
        status: 'Success'
    },
    {
        id: 'TXN-38279',
        dateTime: '2023-07-15 13:00:05',
        sender: 'Kim Min-jun',
        receiver: 'Creative Solutions',
        amount: '$900.00',
        fxRate: '1 USD = 1,300.25 KRW',
        paymentPath: 'KB Bank → Kakao Pay → PayPal',
        status: 'Success'
    },
    {
        id: 'TXN-38278',
        dateTime: '2023-07-15 12:55:42',
        sender: 'Nguyen Van Minh',
        receiver: 'Global Imports',
        amount: '$650.00',
        fxRate: '1 USD = 23,450 VND',
        paymentPath: 'Vietcombank → MoMo → GrabPay',
        status: 'Success'
    },
    {
        id: 'TXN-38277',
        dateTime: '2023-07-15 12:50:33',
        sender: 'Maria Rodriguez',
        receiver: 'Tech Solutions',
        amount: '$1,800.00',
        fxRate: '1 USD = 0.92 EUR',
        paymentPath: 'BNP Paribas → HSBC',
        status: 'Failed'
    }
];

// Mock Transaction Details
const mockTransactionDetails = {
    'TXN-38291': {
        id: 'TXN-38291',
        dateTime: '2023-07-15 14:32:18',
        sender: 'John Smith',
        senderPSP: 'Maybank',
        receiver: 'ABC Company',
        receiverPSP: 'DBS',
        amount: '$1,250.00 USD',
        convertedAmount: 'MYR 5,262.50',
        fxRate: '1 USD = 4.21 MYR',
        fees: '$12.50 USD',
        paymentPath: 'Maybank → DBS',
        status: 'Success',
        signatures: [
            {
                party: 'Sender (Maybank)',
                hash: '8f7d3b2a1c5e9f6d4a2b8c7e6d5f4a3b2c1d7e8f9a0b1c2d3e4f5a6b7c8d9e0',
                timestamp: '2023-07-15 14:32:18'
            },
            {
                party: 'GOSEL Platform',
                hash: '2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
                timestamp: '2023-07-15 14:32:19'
            },
            {
                party: 'Receiver (DBS)',
                hash: '5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5',
                timestamp: '2023-07-15 14:32:22'
            }
        ]
    },
    'TXN-38284': {
        id: 'TXN-38284',
        dateTime: '2023-07-15 13:30:19',
        sender: 'Michael Johnson',
        senderPSP: 'JPMorgan',
        receiver: 'Tech Innovations',
        receiverPSP: 'HSBC',
        amount: '$5,000.00 USD',
        convertedAmount: '$5,000.00 USD',
        fxRate: '1 USD = 1.00 USD',
        fees: '$25.00 USD',
        paymentPath: 'JPMorgan → SWIFT → HSBC',
        fallbackPath: 'JPMorgan → Citibank → HSBC',
        fallbackReason: 'SWIFT Network Timeout (>30s)',
        status: 'Failed',
        signatures: [
            {
                party: 'Sender (JPMorgan)',
                hash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0',
                timestamp: '2023-07-15 13:30:19'
            },
            {
                party: 'GOSEL Platform',
                hash: '9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a3z2y1x',
                timestamp: '2023-07-15 13:30:20'
            },
            {
                party: 'SWIFT Network',
                hash: '5a4b3c2d1e0f9g8h7i6j5k4l3m2n1o0p9q8r7s6t5u4v3w2x1y0z9a8b7',
                timestamp: '2023-07-15 13:30:25'
            },
            {
                party: 'Fallback: Citibank',
                hash: '2z3y4x5w6v7u8t9s0r1q2p3o4n5m6l7k8j9i0h1g2f3e4d5c6b7a8z9y',
                timestamp: '2023-07-15 13:30:50'
            },
            {
                party: 'Receiver (HSBC)',
                hash: '7f6e5d4c3b2a1z0y9x8w7v6u5t4s3r2q1p0o9n8m7l6k5j4i3h2g1f0e',
                timestamp: '2023-07-15 13:31:05'
            }
        ]
    },
    'default': {
        id: 'TXN-00000',
        dateTime: '2023-07-15 00:00:00',
        sender: 'Sample Sender',
        senderPSP: 'Sample Bank',
        receiver: 'Sample Receiver',
        receiverPSP: 'Sample Bank',
        amount: '$1,000.00 USD',
        convertedAmount: '$1,000.00 USD',
        fxRate: '1 USD = 1.00 USD',
        fees: '$10.00 USD',
        paymentPath: 'Bank A → Bank B',
        status: 'Success',
        signatures: [
            {
                party: 'Sender Bank',
                hash: '0000000000000000000000000000000000000000000000000000000000000000',
                timestamp: '2023-07-15 00:00:00'
            },
            {
                party: 'GOSEL Platform',
                hash: '0000000000000000000000000000000000000000000000000000000000000000',
                timestamp: '2023-07-15 00:00:00'
            },
            {
                party: 'Receiver Bank',
                hash: '0000000000000000000000000000000000000000000000000000000000000000',
                timestamp: '2023-07-15 00:00:00'
            }
        ]
    }
};

// Mock Path Metrics
const mockPathMetrics = [
    {
        name: 'Maybank → DBS',
        latency: 125,
        successRate: 99.8,
        reliabilityScore: 9.7,
        status: 'Active'
    },
    {
        name: 'AmBank → UOB',
        latency: 145,
        successRate: 99.5,
        reliabilityScore: 9.5,
        status: 'Active'
    },
    {
        name: 'TnG → GrabPay',
        latency: 98,
        successRate: 99.9,
        reliabilityScore: 9.8,
        status: 'Active'
    },
    {
        name: 'GrabPay → DBS',
        latency: 110,
        successRate: 99.7,
        reliabilityScore: 9.6,
        status: 'Active'
    },
    {
        name: 'Maybank → HSBC',
        latency: 180,
        successRate: 99.2,
        reliabilityScore: 9.3,
        status: 'Active'
    },
    {
        name: 'JPMorgan → SWIFT',
        latency: 250,
        successRate: 97.5,
        reliabilityScore: 8.5,
        status: 'Degraded'
    },
    {
        name: 'Alipay → PayPal',
        latency: 220,
        successRate: 98.8,
        reliabilityScore: 9.0,
        status: 'Active'
    },
    {
        name: 'BDO → BPI',
        latency: 160,
        successRate: 98.5,
        reliabilityScore: 8.8,
        status: 'Active'
    },
    {
        name: 'UPI → HSBC',
        latency: 210,
        successRate: 98.9,
        reliabilityScore: 9.1,
        status: 'Active'
    },
    {
        name: 'Kakao Pay → PayPal',
        latency: 190,
        successRate: 99.0,
        reliabilityScore: 9.2,
        status: 'Active'
    }
];

// Mock FX Rates
const mockFXRates = [
    {
        pair: 'USD/MYR',
        rate: '4.2150',
        change24h: 0.15,
        change7d: -0.25
    },
    {
        pair: 'USD/SGD',
        rate: '1.3520',
        change24h: 0.05,
        change7d: 0.12
    },
    {
        pair: 'USD/THB',
        rate: '35.4200',
        change24h: -0.18,
        change7d: 0.35
    },
    {
        pair: 'USD/IDR',
        rate: '15250.00',
        change24h: -0.22,
        change7d: -0.45
    },
    {
        pair: 'USD/PHP',
        rate: '55.8500',
        change24h: 0.10,
        change7d: -0.15
    },
    {
        pair: 'USD/VND',
        rate: '23450.00',
        change24h: -0.05,
        change7d: 0.20
    },
    {
        pair: 'USD/CNY',
        rate: '7.1820',
        change24h: -0.12,
        change7d: -0.30
    },
    {
        pair: 'USD/JPY',
        rate: '139.8500',
        change24h: 0.25,
        change7d: 0.65
    },
    {
        pair: 'USD/KRW',
        rate: '1300.2500',
        change24h: 0.08,
        change7d: 0.22
    },
    {
        pair: 'USD/INR',
        rate: '74.5000',
        change24h: -0.15,
        change7d: -0.35
    },
    {
        pair: 'EUR/USD',
        rate: '1.0850',
        change24h: 0.20,
        change7d: 0.45
    },
    {
        pair: 'GBP/USD',
        rate: '1.2750',
        change24h: 0.15,
        change7d: 0.25
    }
];

// Mock Participants
const mockParticipants = [
    {
        name: 'Maybank',
        type: 'Bank',
        country: 'Malaysia',
        status: 'Active',
        integrationDate: '2022-01-15',
        successRate: 99.8
    },
    {
        name: 'AmBank',
        type: 'Bank',
        country: 'Malaysia',
        status: 'Active',
        integrationDate: '2022-01-20',
        successRate: 99.5
    },
    {
        name: 'Touch n Go',
        type: 'PSP',
        country: 'Malaysia',
        status: 'Active',
        integrationDate: '2022-02-10',
        successRate: 99.9
    },
    {
        name: 'GrabPay',
        type: 'PSP',
        country: 'Malaysia',
        status: 'Active',
        integrationDate: '2022-02-15',
        successRate: 99.7
    },
    {
        name: 'DBS',
        type: 'Bank',
        country: 'Singapore',
        status: 'Active',
        integrationDate: '2022-01-10',
        successRate: 99.9
    },
    {
        name: 'UOB',
        type: 'Bank',
        country: 'Singapore',
        status: 'Active',
        integrationDate: '2022-01-25',
        successRate: 99.6
    },
    {
        name: 'OCBC',
        type: 'Bank',
        country: 'Singapore',
        status: 'Active',
        integrationDate: '2022-02-05',
        successRate: 99.7
    },
    {
        name: 'SCB',
        type: 'Bank',
        country: 'Thailand',
        status: 'Active',
        integrationDate: '2022-03-10',
        successRate: 99.5
    },
    {
        name: 'Bangkok Bank',
        type: 'Bank',
        country: 'Thailand',
        status: 'Active',
        integrationDate: '2022-03-15',
        successRate: 99.4
    },
    {
        name: 'PromptPay',
        type: 'Network',
        country: 'Thailand',
        status: 'Active',
        integrationDate: '2022-03-05',
        successRate: 99.8
    },
    {
        name: 'BCA',
        type: 'Bank',
        country: 'Indonesia',
        status: 'Active',
        integrationDate: '2022-04-10',
        successRate: 99.3
    },
    {
        name: 'Mandiri',
        type: 'Bank',
        country: 'Indonesia',
        status: 'Active',
        integrationDate: '2022-04-15',
        successRate: 99.2
    },
    {
        name: 'GoPay',
        type: 'PSP',
        country: 'Indonesia',
        status: 'Active',
        integrationDate: '2022-04-20',
        successRate: 99.6
    },
    {
        name: 'BPI',
        type: 'Bank',
        country: 'Philippines',
        status: 'Active',
        integrationDate: '2022-05-10',
        successRate: 99.1
    },
    {
        name: 'BDO',
        type: 'Bank',
        country: 'Philippines',
        status: 'Degraded',
        integrationDate: '2022-05-15',
        successRate: 97.5
    },
    {
        name: 'GCash',
        type: 'PSP',
        country: 'Philippines',
        status: 'Active',
        integrationDate: '2022-05-20',
        successRate: 99.5
    },
    {
        name: 'Vietcombank',
        type: 'Bank',
        country: 'Vietnam',
        status: 'Active',
        integrationDate: '2022-06-10',
        successRate: 99.0
    },
    {
        name: 'MoMo',
        type: 'PSP',
        country: 'Vietnam',
        status: 'Active',
        integrationDate: '2022-06-15',
        successRate: 99.4
    },
    {
        name: 'ICBC',
        type: 'Bank',
        country: 'China',
        status: 'Active',
        integrationDate: '2022-07-10',
        successRate: 99.2
    },
    {
        name: 'Alipay',
        type: 'PSP',
        country: 'China',
        status: 'Active',
        integrationDate: '2022-07-15',
        successRate: 99.8
    },
    {
        name: 'WeChat Pay',
        type: 'PSP',
        country: 'China',
        status: 'Active',
        integrationDate: '2022-07-20',
        successRate: 99.7
    },
    {
        name: 'PayPal',
        type: 'PSP',
        country: 'United States',
        status: 'Active',
        integrationDate: '2022-01-05',
        successRate: 99.6
    },
    {
        name: 'JPMorgan',
        type: 'Bank',
        country: 'United States',
        status: 'Active',
        integrationDate: '2022-02-05',
        successRate: 99.5
    },
    {
        name: 'HSBC',
        type: 'Bank',
        country: 'United Kingdom',
        status: 'Active',
        integrationDate: '2022-01-08',
        successRate: 99.7
    }
]; 