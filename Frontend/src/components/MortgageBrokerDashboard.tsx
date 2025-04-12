// src/components/MortgageBrokerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import TicketList from './TicketList';
import { fetchMyTickets, updateTicketStatus } from '../store/slices/ticketSlice';
import { AppDispatch, RootState } from '../store/store';

const STATUS_OPTIONS = [
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending_info', label: 'Pending Information' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' }
];

const MortgageBrokerDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.tickets);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);
  
  const openStatusDialog = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setStatusDialogOpen(true);
  };
  
  const handleUpdateStatus = () => {
    if (selectedTicketId && newStatus) {
      dispatch(updateTicketStatus({ 
        ticketId: selectedTicketId, 
        status: newStatus,
        notes: notes 
      }));
      setStatusDialogOpen(false);
      setSelectedTicketId(null);
      setNewStatus('');
      setNotes('');
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Mortgage Broker Dashboard
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
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Assigned Tickets
          </Typography>
        </Box>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TicketList 
            filterType="assignedTo" 
            onAssignTicket={openStatusDialog}
            showAssignButton={true}
            buttonLabel="Update Status"
          />
        )}
      </Paper>
      
      {/* Status Update Dialog */}
      <Dialog 
        open={statusDialogOpen} 
        onClose={() => setStatusDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Ticket Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              fullWidth
              margin="normal"
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Notes"
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            color="primary" 
            variant="contained"
            disabled={!newStatus}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MortgageBrokerDashboard;