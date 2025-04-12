import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';

function MainLayout() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
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
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;