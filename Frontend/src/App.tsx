// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { checkAuthStatus, logout } from './store/slices/authSlice';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashbaord';
import FinancialPlannerDashboard from './components/FinancialPlannerDashboard';
import MortgageBrokerDashboard from './components/MortgageBrokerDashboard';
import TicketCreationForm from './components/TicketCreationForm';
import TicketDetail from './components/TicketDetail';
import ForgotPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import MyTicketList from './components/MyTicketList';

function TicketDetailWrapper() {
  return <TicketDetail />;
};

function App() {
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


  const getDashboardComponent = () => {
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'financial_planner':
        return <FinancialPlannerDashboard />;
      case 'mortgage_broker':
        return <MortgageBrokerDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Financial CRM
          </Typography>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              {(user.role === 'financial_planner' || user.role === 'mortgage_broker') && (
                <>
                  <Button color="inherit" component={Link} to="/tickets">
                    My Tickets
                  </Button>
                  <Button color="inherit" component={Link} to="/create-ticket">
                    Create Ticket
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
          <Route path="/reset-password" element={user ? <Navigate to="/dashboard" /> : <ResetPassword />} />
          
          {/* Dashboard route */}
          <Route path="/dashboard" element={getDashboardComponent()} />
          
          {/* Ticket management routes */}
          <Route 
            path="/create-ticket" 
            element={
              user && (user.role === 'financial_planner' || user.role === 'mortgage_broker') 
                ? <TicketCreationForm /> 
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/tickets" 
            element={
              user ? <MyTicketList filterBy={user.role === 'financial_planner' ? 'created' : 'assignedTo'} /> 
              : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/tickets/:id" 
            element={
              user ? <TicketDetailWrapper /> : <Navigate to="/login" />
            } 
          />
          
          {/* Default route */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
