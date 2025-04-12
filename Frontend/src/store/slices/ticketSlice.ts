import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Ticket {
  updatedAt(updatedAt: any): import("react").ReactNode;
  createdAt(createdAt: any): import("react").ReactNode;
  assignee: any;
  assignee: any;
  creator: any;
  creator: any;
  serialNumber: string;
  id: number;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  amount: number;
  status: string;
  createdBy: number;
  assignedTo: number | null;
  notes?: string;
}

interface TicketState {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  isLoading: false,
  error: null,
};

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
  const response = await api.get('/tickets');
  return response.data;
});

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData: Omit<Ticket, 'id' | 'status' | 'createdBy' | 'assignedTo'>) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  }
);

export const assignTicket = createAsyncThunk(
  'tickets/assignTicket',
  async ({ ticketId, userId }: { ticketId: number; userId: number }) => {
    const response = await api.put(`/tickets/${ticketId}/assign`, { assignedTo: userId });
    return response.data;
  }
);

export const updateTicketStatus = createAsyncThunk(
  'tickets/updateTicketStatus',
  async ({ ticketId, status, notes }: { ticketId: number; status: string; notes?: string }) => {
    const response = await api.put(`/tickets/${ticketId}`, { status, notes });
    return response.data;
  }
);

export const getTicketById = createAsyncThunk(
  'tickets/getTicketById',
  async (ticketId: number) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  }
);

export const fetchMyTickets = createAsyncThunk('tickets/fetchMyTickets', async () => {
  const response = await api.get('/tickets/my-tickets');
  return response.data;
});

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tickets';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload);
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(fetchMyTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch my tickets';
      })
      .addCase(getTicketById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch ticket';
      });
  },
});

export default ticketSlice.reducer;