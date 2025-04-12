import { useSelector } from "react-redux";
import MyTicketList from "../components/MyTicketList";
import { RootState } from "../store/store";
import { Navigate } from "react-router-dom";

// Ticket list with role-specific filtering
export const TicketListWrapper = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (!user) return <Navigate to="/login" />;
  
  const filterBy = user.role === 'financial_planner' ? 'created' : 'assignedTo';
  return <MyTicketList filterBy={filterBy} />;
};