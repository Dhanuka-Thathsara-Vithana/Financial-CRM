// src/components/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import UserRegistrationForm from './UserRegistrationForm';
import UserList from './UserList';
import TicketList from './TicketList';
import { fetchUsers } from '../store/slices/userSlice';
import { fetchTickets } from '../store/slices/ticketSlice';
import { AppDispatch, RootState } from '../store/store';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading: isLoadingUsers } = useSelector((state: RootState) => state.users);
  const { isLoading: isLoadingTickets } = useSelector((state: RootState) => state.tickets);
  
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchTickets());
  }, [dispatch]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  if (user?.role !== 'admin') {
    return (
      <Container>
        <Typography variant="h5" color="error" sx={{ mt: 4 }}>
          Access Denied. Admin privileges required.
        </Typography>
      </Container>
    );
  }
  
  const isLoading = isLoadingUsers || isLoadingTickets;
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="User Management" />
          <Tab label="Ticket Overview" />
        </Tabs>
        <Divider />
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <UserRegistrationForm />
              <UserList />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <TicketList isAdmin={true} />
            </TabPanel>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
