import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import { initializeAPIClient } from './api/client';
import { AdminLogin } from './screens/admin/AdminLogin';
import { AdminDashboard } from './screens/admin/AdminDashboard';
import { ParticipantsIndex } from './screens/admin/ParticipantsIndex';
import { ParticipantDetail } from './screens/admin/ParticipantDetail';
import { CasesIndex } from './screens/admin/CasesIndex';
import { CaseDetail } from './screens/admin/CaseDetail';
import { BroadcastsIndex } from './screens/admin/BroadcastsIndex';
import { BroadcastNew } from './screens/admin/BroadcastNew';
import { ReportingDashboard } from './screens/admin/ReportingDashboard';
import { SettingsScreen } from './screens/admin/SettingsScreen';
import { StarredScreen } from './screens/admin/StarredScreen';
import { VolunteerNetworkScreen } from './screens/admin/VolunteerNetworkScreen';
import { MemberAuth } from './screens/member/MemberAuth';
import { MemberAuthVerify } from './screens/member/MemberAuthVerify';
import { MemberDashboard } from './screens/member/MemberDashboard';
import { MemberEmployment } from './screens/member/MemberEmployment';

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
      <Route 
        path="/admin/participants" 
        element={
          <RequireAuth>
            <ParticipantsIndex />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/participants/:id" 
        element={
          <RequireAuth>
            <ParticipantDetail />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/cases" 
        element={
          <RequireAuth>
            <CasesIndex />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/cases/:id" 
        element={
          <RequireAuth>
            <CaseDetail />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/broadcasts" 
        element={
          <RequireAuth>
            <BroadcastsIndex />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/broadcasts/new" 
        element={
          <RequireAuth>
            <BroadcastNew />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/reporting" 
        element={
          <RequireAuth>
            <ReportingDashboard />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <RequireAuth>
            <SettingsScreen />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/starred" 
        element={
          <RequireAuth>
            <StarredScreen />
          </RequireAuth>
        } 
      />
      <Route 
        path="/admin/volunteer-network" 
        element={
          <RequireAuth>
            <VolunteerNetworkScreen />
          </RequireAuth>
        } 
      />
      
      <Route path="/m" element={<MemberAuth />} />
      <Route path="/m/auth/verify" element={<MemberAuthVerify />} />
      <Route 
        path="/m/dashboard" 
        element={
          <RequireAuth>
            <MemberDashboard />
          </RequireAuth>
        } 
      />
      <Route
        path="/m/work"
        element={
          <RequireAuth>
            <MemberEmployment />
          </RequireAuth>
        }
      />
      <Route 
        path="/m/education" 
        element={
          <RequireAuth>
            <div className="screen"><h1>Education Verification</h1></div>
          </RequireAuth>
        } 
      />
      <Route 
        path="/m/volunteer" 
        element={
          <RequireAuth>
            <div className="screen"><h1>Community Service</h1></div>
          </RequireAuth>
        } 
      />
      <Route 
        path="/m/exemptions" 
        element={
          <RequireAuth>
            <div className="screen"><h1>Request Exemption</h1></div>
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
