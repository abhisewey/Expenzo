import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Fake database keys
const USERS_KEY = 'expenzo_users';
const SESSION_KEY = 'expenzo_session';

const generateAvatarColor = () => {
  const colors = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const sessionUser = localStorage.getItem(SESSION_KEY);
        if (sessionUser) {
          setUser(JSON.parse(sessionUser));
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signup = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      
      // Check if user exists
      if (users.find(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      if (users.find(u => u.username === username)) {
        throw new Error('Username is already taken');
      }

      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        password, // In a real app, NEVER store plain text passwords
        avatarColor: generateAvatarColor(),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Auto login after signup
      const userToStore = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatarColor: newUser.avatarColor
      };
      
      localStorage.setItem(SESSION_KEY, JSON.stringify(userToStore));
      setUser(userToStore);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to sign up');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const foundUser = users.find(u => u.email === email);

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      if (foundUser.password !== password) {
         throw new Error('Invalid email or password');
      }

      const userToStore = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        avatarColor: foundUser.avatarColor
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(userToStore));
      setUser(userToStore);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to log in');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
