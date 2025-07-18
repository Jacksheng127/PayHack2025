# GOSEL Payment System Monitor - React Version

A modern React-based dashboard for monitoring payment systems, transaction flows, smart routing, and compliance across multiple payment service providers (PSPs) and banks.

## Features

- **Dashboard Overview**: Real-time system metrics, transaction volumes, and success rates
- **Smart Routing**: Payment path monitoring, fallback management, and FX rate tracking
- **Transaction Management**: Comprehensive transaction history with advanced filtering
- **Participant Management**: PSP and bank management by country and performance
- **Security & Compliance**: Sanctions checking, data residency, and access control logs

## Technology Stack

- **Frontend**: React 18 with Vite
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Font Awesome
- **Styling**: CSS with CSS Variables
- **Data Visualization**: D3.js (for future network maps)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PayHack2025
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── TransactionVolumeChart.jsx
│   │   ├── SuccessRateChart.jsx
│   │   └── FallbackRateChart.jsx
│   ├── Dashboard.jsx
│   ├── SmartRouting.jsx
│   ├── Transactions.jsx
│   ├── Participants.jsx
│   ├── Security.jsx
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── StatsCard.jsx
│   └── ChartCard.jsx
├── utils/
│   └── mockData.js
├── App.jsx
├── main.jsx
└── index.css
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Components

### Dashboard
- System overview with key metrics
- Transaction volume charts
- Success rate by region
- Fallback rerouting metrics
- System uptime visualization

### Smart Routing
- Global payment network visualization
- Path performance metrics
- Fallback events log
- FX rate monitoring

### Transactions
- Transaction history with advanced filtering
- Detailed transaction view modal
- Export functionality
- Pagination

### Participants
- PSP and bank management
- Country-based organization
- Performance analytics
- Status tracking

### Security
- Sanctions and compliance monitoring
- Data residency controls
- Access control logs
- Security status indicators

## Customization

### Adding New Charts
1. Create a new chart component in `src/components/charts/`
2. Import necessary Chart.js components
3. Add chart data to `src/utils/mockData.js`
4. Include the chart in the appropriate page component

### Styling
The application uses CSS custom properties (variables) for theming. Main colors and styling can be modified in `src/index.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #475569;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    /* ... */
}
```

### Mock Data
All mock data is centralized in `src/utils/mockData.js`. You can modify or extend this file to add new data or integrate with real APIs.

## Future Enhancements

- [ ] Real-time WebSocket integration
- [ ] Advanced D3.js network visualizations
- [ ] Export functionality for reports
- [ ] User authentication and role management
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] API integration for live data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
