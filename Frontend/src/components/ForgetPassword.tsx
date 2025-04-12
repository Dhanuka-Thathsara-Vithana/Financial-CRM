// src/components/ForgotPassword.tsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import { authService } from ;

function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        
        {success ? (
          <Alert severity="success" sx={{ mt: 3, width: '100%' }}>
            If an account exists with that email, we've sent password reset instructions.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword;
