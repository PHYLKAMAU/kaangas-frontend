import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { USER_ROLES } from '../services/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        console.log('🔍 Checking authentication status...');
        const response = await apiClient.get('/accounts/profile/');
        setUser(response.data.user);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', response.data.user.role);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔄 Attempting login for:', email);
      const response = await apiClient.post('/accounts/login/', {
        email,
        password
      });
      
      // Store tokens
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      console.log('✅ Login successful:', response.data.user.role);
      
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔄 Attempting registration for:', userData.email);
      const response = await apiClient.post('/accounts/register/', userData);
      
      // Store tokens
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      console.log('✅ Registration successful:', response.data.user.role);
      
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.post('/accounts/logout/', {
          refresh_token: refreshToken
        });
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      // Clear everything regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ User logged out');
    }
  };

  // Get dashboard route based on user role
  const getDashboardRoute = (userRole) => {
    switch (userRole) {
      case USER_ROLES.CUSTOMER:
        return '/customer/dashboard';
      case USER_ROLES.VENDOR:
        return '/vendor/dashboard';
      case USER_ROLES.RIDER:
        return '/rider/dashboard';
      case USER_ROLES.ADMIN:
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.put('/accounts/profile/', profileData);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
    getDashboardRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};