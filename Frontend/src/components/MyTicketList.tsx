// TicketList.tsx - Updated version
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, CircularProgress, Box 
} from '@mui/material';
import { RootState } from '../store/store';

// Define props interface for TicketList component
interface TicketListProps {
  filterBy?: 'created' | 'assigned' | 'assignedTo' | string;
  isAdmin?: boolean;
}

function TicketList({ filterBy, isAdmin }: TicketListProps) {
  const { tickets, isLoading, error } = useSelector((state: RootState) => state.tickets);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  // Filter tickets based on the filterBy prop if provided
  const filteredTickets = useMemo(() => {
    if (!filterBy || !currentUser) return tickets;

    switch (filterBy) {
      case 'created':
        return tickets.filter(ticket => ticket.createdBy === currentUser.id);
      case 'assigned':
        return tickets.filter(ticket => 
          ticket.createdBy === currentUser.id && 
          ticket.assignedTo !== null && 
          ticket.assignedTo !== currentUser.id
        );
      case 'assignedTo':
        return tickets.filter(ticket => ticket.assignedTo === currentUser.id);
      default:
        return tickets;
    }
  }, [tickets, filterBy, currentUser]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Use filtered tickets if filterBy is provided, otherwise use all tickets
  const displayTickets = filterBy ? filteredTickets : tickets;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="ticket table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Client Address</TableCell>
            <TableCell>Client Phone</TableCell>
            <TableCell>Client Email</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayTickets.length > 0 ? (
            displayTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.serialNumber}</TableCell>
                <TableCell>{ticket.clientName}</TableCell>
                <TableCell>{ticket.clientAddress}</TableCell>
                <TableCell>{ticket.clientPhone}</TableCell>
                <TableCell>{ticket.clientEmail}</TableCell>
                <TableCell>{ticket.amount}</TableCell>
                <TableCell>{ticket.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No tickets found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TicketList;