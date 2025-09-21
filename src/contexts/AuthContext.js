import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('bookMyVendorUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('bookMyVendorUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password, userType) => {
    return new Promise((resolve, reject) => {
      // Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('bookMyVendorUsers') || '[]');
      
      // Find user with matching credentials
      const foundUser = storedUsers.find(
        u => u.email === email && u.password === password && u.userType === userType
      );

      if (foundUser) {
        // Remove password from user object for security
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('bookMyVendorUser', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Invalid email, password, or user type'));
      }
    });
  };

  const signup = (userData) => {
    return new Promise((resolve, reject) => {
      const { email, password, confirmPassword, userType, name, phone, company } = userData;

      // Validation
      if (password !== confirmPassword) {
        reject(new Error('Passwords do not match'));
        return;
      }

      if (password.length < 6) {
        reject(new Error('Password must be at least 6 characters long'));
        return;
      }

      // Get existing users
      const storedUsers = JSON.parse(localStorage.getItem('bookMyVendorUsers') || '[]');
      
      // Check if user already exists
      const existingUser = storedUsers.find(u => u.email === email && u.userType === userType);
      if (existingUser) {
        reject(new Error(`${userType === 'client' ? 'Client' : 'Vendor'} with this email already exists`));
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        userType,
        name,
        phone,
        ...(userType === 'vendor' && { company }),
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('bookMyVendorUsers', JSON.stringify(updatedUsers));

      // Set current user (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('bookMyVendorUser', JSON.stringify(userWithoutPassword));
      
      resolve(userWithoutPassword);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookMyVendorUser');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
