import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PaymentNetworkPage from './pages/PaymentNetworkPage';
import BlockExplorerPage from './pages/BlockExplorerPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8f9fe',
      paper: '#ffffff',
    },
    primary: {
      main: '#6a5af9',
    },
    secondary: {
      main: '#4dabf7',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/network" element={<PaymentNetworkPage />} />
              <Route path="/block-explorer" element={<BlockExplorerPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
