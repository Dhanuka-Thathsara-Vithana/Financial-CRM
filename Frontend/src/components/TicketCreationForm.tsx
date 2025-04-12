// src/components/TicketCreationForm.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import { createTicket } from '../store/slices/ticketSlice';
import { AppDispatch, RootState } from '../store/store';

const TicketCreationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    amount: '',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    amount: '',
    notes: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.tickets);
  
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    // Client name validation
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
      valid = false;
    } else {
      newErrors.clientName = '';
    }
    
    // Client address validation
    if (!formData.clientAddress.trim()) {
      newErrors.clientAddress = 'Client address is required';
      valid = false;
    } else {
      newErrors.clientAddress = '';
    }
    
    // Client phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Client phone is required';
      valid = false;
    } else if (!phoneRegex.test(formData.clientPhone)) {
      newErrors.clientPhone = 'Invalid phone format (e.g., +61412345678)';
      valid = false;
    } else {
      newErrors.clientPhone = '';
    }
    
    // Client email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Client email is required';
      valid = false;
    } else if (!emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Invalid email format';
      valid = false;
    } else {
      newErrors.clientEmail = '';
    }
    
    // src/components/TicketCreationForm.tsx (continued)
    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
      valid = false;
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
      valid = false;
    } else {
      newErrors.amount = '';
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const ticketData = {
          ...formData,
          amount: parseFloat(formData.amount)
        };
        
        await dispatch(createTicket(ticketData)).unwrap();
        setSuccessMessage('Ticket created successfully!');
        setShowSuccessAlert(true);
        
        // Reset form
        setFormData({
          clientName: '',
          clientAddress: '',
          clientPhone: '',
          clientEmail: '',
          amount: '',
          notes: ''
        });
      } catch (err) {
        console.error('Failed to create ticket:', err);
      }
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create New Ticket
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="clientName"
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              error={!!formErrors.clientName}
              helperText={formErrors.clientName}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="clientEmail"
              label="Client Email"
              name="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={handleChange}
              error={!!formErrors.clientEmail}
              helperText={formErrors.clientEmail}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="clientAddress"
              label="Client Address"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleChange}
              error={!!formErrors.clientAddress}
              helperText={formErrors.clientAddress}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="clientPhone"
              label="Client Phone"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              error={!!formErrors.clientPhone}
              helperText={formErrors.clientPhone}
              margin="normal"
              placeholder="+61412345678"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="amount"
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              error={!!formErrors.amount}
              helperText={formErrors.amount}
              margin="normal"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="notes"
              label="Notes"
              name="notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              error={!!formErrors.notes}
              helperText={formErrors.notes}
              margin="normal"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ minWidth: 150 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Ticket'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
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

export default TicketCreationForm;

