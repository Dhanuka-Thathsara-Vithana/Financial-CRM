import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { fetchTickets } from '../store/slices/ticketSlice';
import { AppDispatch, RootState } from '../store/store';

const TicketList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tickets, isLoading, error } = useSelector((state: RootState) => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  if (isLoading) {
    return <Typography>Loading tickets...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="ticket table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Client Address</TableCell>
            <TableCell>Client Phone</TableCell>
            <TableCell>Client Email</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.clientName}</TableCell>
              <TableCell>{ticket.clientAddress}</TableCell>
              <TableCell>{ticket.clientPhone}</TableCell>
              <TableCell>{ticket.clientEmail}</TableCell>
              <TableCell>{ticket.amount}</TableCell>
              <TableCell>{ticket.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketList;
