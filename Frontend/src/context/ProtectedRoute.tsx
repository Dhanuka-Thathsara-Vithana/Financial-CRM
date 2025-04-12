// src/context/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles: string[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
