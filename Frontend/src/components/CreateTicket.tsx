import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { createTicket } from '../store/slices/ticketSlice';
import { AppDispatch } from '../store/store';

function CreateTicket() {
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createTicket({
      clientName,
      clientAddress,
      clientPhone,
      clientEmail,
      amount: parseFloat(amount),
      updatedAt: function (updatedAt: any): import("react").ReactNode {
        throw new Error('Function not implemented.');
      },
      createdAt: function (createdAt: any): import("react").ReactNode {
        throw new Error('Function not implemented.');
      },
      serialNumber: ''
    }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create Ticket
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="clientName"
            label="Client Name"
            name="clientName"
            autoFocus
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="clientAddress"
            label="Client Address"
            name="clientAddress"
            value={clientAddress}
            onChange={(e) => setClientAddress(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="clientPhone"
            label="Client Phone"
            name="clientPhone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="clientEmail"
            label="Client Email"
            name="clientEmail"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="amount"
            label="Amount"
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Ticket
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateTicket;
