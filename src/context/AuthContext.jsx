import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/authRoutes.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {

    try {

      const data = await getCurrentUser();
      setUser(data);

    } catch {

      setUser(null);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchCurrentUser();

  }, []);

  useEffect(() => {

    const handleUnauthorized = () => {

      setUser(null);

    };

    window.addEventListener(
      "auth:unauthorized",
      handleUnauthorized
    );

    return () => {

      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );

    };

  }, []);

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext)