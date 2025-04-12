import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, useNavigate } from "react-router-dom";

// Role-specific dashboard component
export const DashboardSelector = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);
    
    if (!user) return <Navigate to="/login" />;
    
    switch (user.role) {
      case 'admin':
        return navigate('/adminDashboard');
      case 'financial_planner':
        return navigate('/financialPlannerDashboard');
      case 'mortgage_broker':
        return navigate('/mortgageBrokerDashboard');
      default:
        return <Navigate to="/login" />;
    }
  };