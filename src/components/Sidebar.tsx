import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HubIcon from '@mui/icons-material/Hub';
import ExploreIcon from '@mui/icons-material/Explore';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 2, fontWeight: 'bold', fontSize: '1.5rem' }}>GOSEL</Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" sx={{ backgroundColor: '#e0f7fa', '&:hover': { backgroundColor: '#b2ebf2' } }}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/network" sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
            <ListItemIcon>
              <HubIcon />
            </ListItemIcon>
            <ListItemText primary="Payment Network" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/block-explorer" sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
            <ListItemIcon>
              <ExploreIcon />
            </ListItemIcon>
            <ListItemText primary="Block Explorer" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar; 