// src/components/TicketList.tsx
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Button
} from '@mui/material';
import { RootState } from '../store/store';

interface TicketListProps {
  filterType?: 'created' | 'assigned' | 'assignedTo' | 'all';
  onAssignTicket?: (ticketId: number) => void;
  showAssignButton?: boolean;
  buttonLabel?: string;
}

const TicketList: React.FC<TicketListProps> = ({ 
  filterType, 
  onAssignTicket,
  showAssignButton = false,
  buttonLabel = 'Assign'
}) => {
  const { tickets, isLoading } = useSelector((state: RootState) => state.tickets);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const userId = currentUser?.id;

  // Filter tickets based on the filterType prop
  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    console.log("Filtering tickets with filterType:", filterType);
    
    switch (filterType) {
      case 'created':
        return tickets.filter(ticket => ticket.createdBy === userId);
      case 'assigned':
        return tickets.filter(ticket => ticket.assignedTo !== null);
      case 'assignedTo':
        return tickets.filter(ticket => ticket.assignedTo === userId);
      case 'all':
      default:
        return tickets;
    }
  }, [tickets, filterType, userId]);

  if (isLoading) {
    return <Typography>Loading tickets...</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.serialNumber}</TableCell>
                <TableCell>{ticket.clientName}</TableCell>
                <TableCell>${ticket.amount}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>
                  <Link to={`/tickets/${ticket.id}`} style={{ marginRight: '10px' }}>
                    View Details
                  </Link>
                  {showAssignButton && onAssignTicket && (
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small"
                      onClick={() => onAssignTicket(ticket.id)}
                    >
                      {buttonLabel}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
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