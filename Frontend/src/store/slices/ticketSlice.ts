import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Ticket {
  id: number;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  amount: number;
  status: string;
  createdBy: number;
  assignedTo: number | null;
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
      });
  },
});

export default ticketSlice.reducer;
