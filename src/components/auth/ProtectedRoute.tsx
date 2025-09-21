import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../lib/hooks/auth/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        // User not authenticated, redirect to the login page
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
