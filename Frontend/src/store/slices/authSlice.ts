import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/signout');
});

export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
      try {
      
        await api.post('/auth/refreshtoken');
        
        const response = await api.get('/users/me');
        return response.data;
      } catch (error) {
        return rejectWithValue('Authentication failed');
      }
    }
  );

  export const requestPasswordReset = createAsyncThunk(
    'auth/requestPasswordReset',
    async (email: string, { rejectWithValue }) => {
      try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to request password reset');
      }
    }
  );
  
  export const resetPasswordWithToken = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
      }
    }
  );

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to request password reset';
      })
      .addCase(resetPasswordWithToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordWithToken.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordWithToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to reset password';
      });
  },
});

export default authSlice.reducer;
