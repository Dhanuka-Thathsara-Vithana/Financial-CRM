import React from 'react';
import { Typography, Paper, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1" paragraph>
        You don't have permission to access this page. Please contact your administrator
        if you believe this is an error.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button 
          component={Link} 
          to="/dashboard" 
          variant="contained" 
          color="primary"
        >
          Return to Dashboard
        </Button>
      </Box>
    </Paper>
  );
};

export default Unauthorized;