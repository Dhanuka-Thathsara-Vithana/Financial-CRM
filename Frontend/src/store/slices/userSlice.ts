// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Only used for creation
  role: 'admin' | 'financial_planner' | 'mortgage_broker';
  firstName: string;
  lastName: string;
  phone: string;
}

interface UserState {
  users: User[];
  brokers: User[]; // Added brokers array
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  brokers: [], // Initialize brokers array
  currentUser: null,
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await api.get('/users');
  return response.data;
});

export const fetchBrokers = createAsyncThunk('users/fetchBrokers', async () => {
  const response = await api.get('/users/users');
  return response.data;
});

export const fetchCurrentUser = createAsyncThunk('users/fetchCurrentUser', async () => {
  const response = await api.get('/users/me');
  return response.data;
});

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id'>) => {
    const response = await api.post('/auth/signup', userData);
    return response.data.user;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: Partial<User> }) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.user;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number) => {
    await api.delete(`/users/${id}`);
    return id;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      
      // Fetch brokers
      .addCase(fetchBrokers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrokers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brokers = action.payload;
      })
      .addCase(fetchBrokers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch brokers';
      })
      
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch current user';
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
        // If the new user is a broker, add to brokers array as well
        if (action.payload.role === 'mortgage_broker') {
          state.brokers.push(action.payload);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        
        // Also update in brokers array if present
        const brokerIndex = state.brokers.findIndex(broker => broker.id === action.payload.id);
        if (brokerIndex !== -1) {
          state.brokers[brokerIndex] = action.payload;
        }
      })
      
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.brokers = state.brokers.filter(broker => broker.id !== action.payload);
      });
  },
});

export default userSlice.reducer;