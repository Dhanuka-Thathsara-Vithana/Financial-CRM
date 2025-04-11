import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { checkAuthStatus, logout } from './store/slices/authSlice';
import Login from './components/Login';
import CreateTicket from './components/CreateTicket';
import TicketList from './components/TicketList';
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Financial CRM
          </Typography>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/tickets">Tickets</Button>
              <Button color="inherit" component={Link} to="/create-ticket">Create Ticket</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/tickets" /> : <Login />} />
          <Route path="/tickets" element={user ? <TicketList /> : <Navigate to="/" />} />
          <Route path="/create-ticket" element={user ? <CreateTicket /> : <Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
