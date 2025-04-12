// src/components/TicketDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Button,
  TextField,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppDispatch, RootState } from '../store/store';
import { getTicketById, updateTicketStatus } from '../store/slices/ticketSlice';
import { fetchCurrentUser, fetchBrokers } from '../store/slices/userSlice';
import TicketAssignment from './TicketAssignment';

function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { tickets, isLoading: ticketsLoading } = useSelector((state: RootState) => state.tickets);
  const { users, isLoading: usersLoading } = useSelector((state: RootState) => state.users);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketLoadError, setTicketLoadError] = useState<string | null>(null);
  
  // Find the current ticket
  const ticket = tickets.find(t => t.id === Number(id));
  
  useEffect(() => {
    // Load specific ticket by ID and users
    const loadTicket = async () => {
      try {
        await dispatch(getTicketById(Number(id))).unwrap();
      } catch (err) {
        setTicketLoadError('Failed to load ticket. Please try again.');
        console.error('Error loading ticket:', err);
      }
    };
    
    loadTicket();
    
    // Load users and brokers once when component mounts
    if (users.length === 0) {
      dispatch(fetchCurrentUser());
      dispatch(fetchBrokers()); // Move this call here to run once
    }
  }, [dispatch, id, users.length]);
  
  useEffect(() => {
    // Initialize form with ticket data when ticket is loaded
    if (ticket) {
      setStatus(ticket.status);
      setNotes(ticket.notes || '');
    }
  }, [ticket]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as string);
  };
  
  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };
  
  const handleUpdateTicket = async () => {
    if (!ticket) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await dispatch(updateTicketStatus({
        ticketId: ticket.id,
        status,
        notes
      })).unwrap();
      
      setSuccessMessage('Ticket updated successfully!');
      setShowSuccessAlert(true);
    } catch (err) {
      setError('Failed to update ticket. Please try again.');
      console.error('Error updating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Show loading state
  if (ticketsLoading || usersLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  // Show error if ticket failed to load
  if (ticketLoadError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {ticketLoadError}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Tickets
        </Button>
      </Container>
    );
  }
  
  // Show error if ticket not found
  if (!ticket) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Ticket not found. The ticket may have been deleted or you don't have permission to view it.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Tickets
        </Button>
      </Container>
    );
  }
 
  // Check if user can edit this ticket
  const canEdit = currentUser?.role === 'admin' || 
                 ticket.createdBy === currentUser?.id || 
                 ticket.assignedTo === currentUser?.id;
  
  // Check if user can assign this ticket
  const canAssign = currentUser?.role === 'admin' || 
                   ticket.createdBy === currentUser?.id;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back to Tickets
      </Button>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Ticket #{ticket.id}
          </Typography>
          <Chip 
            label={getStatusLabel(ticket.status)} 
            color={getStatusColor(ticket.status) as any}
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold">Client Information</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1"><strong>Name:</strong> {ticket.clientName}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {ticket.clientEmail}</Typography>
              <Typography variant="body1"><strong>Phone:</strong> {ticket.clientPhone}</Typography>
              <Typography variant="body1"><strong>Address:</strong> {ticket.clientAddress}</Typography>
              <Typography variant="body1"><strong>Amount:</strong> {formatCurrency(ticket.amount)}</Typography>
            </Box>
          </Grid>
        
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold">Ticket Information</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Created By:</strong> {ticket.creator ? `${ticket.creator.username}` : 'Unknown'}
              </Typography>
              <Typography variant="body1">
                <strong>Assigned To:</strong> {ticket.assignee ? `${ticket.assignee.username} ` : 'Unassigned'}
              </Typography>
              <Typography variant="body1">
                <strong>Created:</strong> {formatDate(String(ticket.createdAt))}
              </Typography>
              <Typography variant="body1">
                <strong>Last Updated:</strong> {formatDate(String(ticket.updatedAt))}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">Notes</Typography>
          <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {ticket.notes || 'No notes available.'}
          </Typography>
        </Box>
        
        {canAssign && (
          <Box sx={{ mt: 4 }}>
            <TicketAssignment 
              ticketId={ticket.id} 
              currentAssigneeId={ticket.assignedTo}
              // Don't need to fetch brokers in child component anymore
            />
          </Box>
        )}
        
        {canEdit && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Update Ticket
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    value={status}
                    label="Status"
                    onChange={handleStatusChange as any}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="notes"
                  label="Notes"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Add notes about this ticket..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateTicket}
                  disabled={isSubmitting}
                  sx={{ mt: 3 }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Update Ticket'}
                </Button>
              </Grid>
            </Grid>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}
      </Paper>
      
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
    </Container>
  );
};

export default TicketDetail;