// src/components/TicketAssignment.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { assignTicket } from '../store/slices/ticketSlice';
import { AppDispatch, RootState } from '../store/store';

interface TicketAssignmentProps {
  ticketId: number;
  currentAssigneeId: number | null;
  onAssignmentComplete?: () => void;
}

function TicketAssignment({
  ticketId, 
  currentAssigneeId,
  onAssignmentComplete
}: TicketAssignmentProps) {

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { brokers, isLoading } = useSelector((state: RootState) => state.users);
  const { currentUser } = useSelector((state: RootState) => state.users);
  
  
  const eligibleUsers = brokers.filter(user => {
    if (currentUser?.role === 'financial_planner') {
      return user.role === 'mortgage_broker';
    }
  });

  console.log("Eligible users for assignment:", eligibleUsers);
  console.log("Current user role:", currentUser?.role);
  console.log("brokers:", brokers);
  
  useEffect(() => {
    if (currentAssigneeId) {
      setSelectedUserId(currentAssigneeId.toString());
    }
  }, [currentAssigneeId]);
  
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedUserId(event.target.value);
  };
  
  const handleAssign = async () => {
    if (!selectedUserId) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(assignTicket({ 
        ticketId, 
        userId: parseInt(selectedUserId) 
      })).unwrap();
      
      setSuccessMessage('Ticket assigned successfully!');
      setShowSuccessAlert(true);
      
      if (onAssignmentComplete) {
        onAssignmentComplete();
      }
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <CircularProgress />;
  }
  
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Assign Ticket
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel id="assign-user-label">Assign To</InputLabel>
          <Select
            labelId="assign-user-label"
            id="assign-user"
            value={selectedUserId}
            label="Assign To"
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {eligibleUsers.map((user) => (
              <MenuItem key={user.id} value={user.id.toString()}>
                {user.firstName} {user.lastName} ({user.role === 'financial_planner' ? 'Financial Planner' : 'Mortgage Broker'})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleAssign}
          disabled={!selectedUserId || isSubmitting}
          sx={{ height: 56 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Assign'}
        </Button>
      </Box>
      
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccessAlert(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TicketAssignment;