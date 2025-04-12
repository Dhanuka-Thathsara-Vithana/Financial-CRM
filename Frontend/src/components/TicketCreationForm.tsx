import { useState } from 'react';
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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const ticketSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientPhone: z.string()
    .min(1, 'Client phone is required')
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format (e.g., +61412345678)'),
  clientEmail: z.string()
    .min(1, 'Client email is required')
    .email('Invalid email format'),
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  notes: z.string().optional()
});

type TicketFormData = z.infer<typeof ticketSchema>;

function TicketCreationForm() {
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.tickets);

  const {register,handleSubmit,reset,formState: { errors }} = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      clientName: '',
      clientAddress: '',
      clientPhone: '',
      clientEmail: '',
      amount: '',
      notes: ''
    }
  });
  
  const onSubmit = async (formData: TicketFormData) => {
    try {
      const ticketData = {
        ...formData,
        amount: parseFloat(formData.amount),
        updatedAt: () => <>{new Date().toISOString()}</>,
        createdAt: () => <>{new Date().toISOString()}</>,
        serialNumber: `SN-${Date.now()}`
      };
      
      await dispatch(createTicket(ticketData)).unwrap();
      setSuccessMessage('Ticket created successfully!');
      setShowSuccessAlert(true);
      
      reset();
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Create New Ticket
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="clientName"
              label="Client Name"
              {...register('clientName')}
              error={!!errors.clientName}
              helperText={errors.clientName?.message}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="clientEmail"
              label="Client Email"
              type="email"
              {...register('clientEmail')}
              error={!!errors.clientEmail}
              helperText={errors.clientEmail?.message}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="clientAddress"
              label="Client Address"
              {...register('clientAddress')}
              error={!!errors.clientAddress}
              helperText={errors.clientAddress?.message}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="clientPhone"
              label="Client Phone"
              {...register('clientPhone')}
              error={!!errors.clientPhone}
              helperText={errors.clientPhone?.message}
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
              type="number"
              {...register('amount')}
              error={!!errors.amount}
              helperText={errors.amount?.message}
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
              multiline
              rows={4}
              {...register('notes')}
              error={!!errors.notes}
              helperText={errors.notes?.message}
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
}

export default TicketCreationForm;