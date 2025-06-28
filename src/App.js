import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { USER_ROLES } from './services/constants';

// Pages
import LandingPage from './pages/Home';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';

// Dashboard Components
import CustomerDashboard from './components/customer/CustomerDashboard';
import VendorDashboard from './components/vendor/VendorDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 gradient-bg d-flex justify-content-center align-items-center">
        <div className="spinner-border text-white" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case USER_ROLES.CUSTOMER:
      return <Navigate to="/customer/dashboard" replace />;
    case USER_ROLES.VENDOR:
      return <Navigate to="/vendor/dashboard" replace />;
    case USER_ROLES.RIDER:
      return <Navigate to="/rider/dashboard" replace />;
    case USER_ROLES.ADMIN:
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Dashboard Route */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            
            {/* Customer Routes */}
            <Route 
              path="/customer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Vendor Routes */}
            <Route 
              path="/vendor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.VENDOR]}>
                  <VendorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Temporary placeholder routes for other roles */}
            <Route path="/rider/dashboard" element={<div className="p-5 text-center"><h3>Rider Dashboard Coming Soon</h3></div>} />
            <Route path="/admin/dashboard" element={<div className="p-5 text-center"><h3>Admin Dashboard Coming Soon</h3></div>} />
            
            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;