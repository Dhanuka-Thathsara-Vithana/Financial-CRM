// src/components/FinancialPlannerDashboard.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Link } from 'react-router-dom';
import TicketList from './TicketList';
import { fetchMyTickets, assignTicket } from '../store/slices/ticketSlice';
import { fetchBrokers } from '../store/slices/userSlice';
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
      id={`planner-tabpanel-${index}`}
      aria-labelledby={`planner-tab-${index}`}
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

function FinancialPlannerDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.tickets);
  const { brokers } = useSelector((state: RootState) => state.users);
  
  const filteredBrokers = useMemo(() => {
    return brokers.filter(brokers => brokers.role === 'mortgage_broker');
  }, [brokers]);

  useEffect(() => {
    dispatch(fetchMyTickets());
    dispatch(fetchBrokers());
  }, [dispatch]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const openAssignDialog = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setAssignDialogOpen(true);
  };
  
  const handleAssign = (brokerId: number) => {
    if (selectedTicketId) {
      dispatch(assignTicket({ ticketId: selectedTicketId, userId: brokerId }));
      setAssignDialogOpen(false);
      setSelectedTicketId(null);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Financial Planner Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/create-ticket"
        >
          Create New Ticket
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="My Tickets" />
          <Tab label="Assigned to Brokers" />
        </Tabs>
        <Divider />
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <TicketList 
                filterType="created" 
                showAssignButton={true}
                onAssignTicket={openAssignDialog}
                buttonLabel="Assign to Broker"
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <TicketList filterType="assigned" />
            </TabPanel>
          </>
        )}
      </Paper>
      
      {/* Broker Assignment Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign Ticket to Broker</DialogTitle>
        <DialogContent>
          {filteredBrokers.length > 0 ? (
            <List>
              {filteredBrokers.map((broker) => (
                <ListItem 
                  button 
                  key={broker.id} 
                  onClick={() => handleAssign(broker.id)}
                >
                  <ListItemText 
                    primary={`${broker.firstName} ${broker.lastName}`} 
                    secondary={broker.email} 
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No brokers available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FinancialPlannerDashboard;