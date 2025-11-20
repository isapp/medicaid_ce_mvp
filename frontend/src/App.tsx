import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import { initializeAPIClient } from './api/client';

const AdminLogin = () => <div className="screen"><h1>Admin Login</h1></div>;
const AdminDashboard = () => <div className="screen"><h1>Admin Dashboard</h1></div>;
const MemberAuth = () => <div className="screen"><h1>Member Auth</h1></div>;
const MemberDashboard = () => <div className="screen"><h1>Member Dashboard</h1></div>;

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { token } = useAuth();
  
  React.useEffect(() => {
    initializeAPIClient(() => token);
  }, [token]);
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      
      <Route path="/admin" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        } 
      />
      
      <Route path="/m" element={<MemberAuth />} />
      <Route 
        path="/m/dashboard" 
        element={
          <RequireAuth>
            <MemberDashboard />
          </RequireAuth>
        } 
      />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
