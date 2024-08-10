/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  user: any;
	token: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
	const [token, setToken] = useState<string>("")
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const token = response.data.accessToken;

      // Save token to local storage
      localStorage.setItem("token", token);
			setToken(token)

      // Decode token to get user info
      const decodedUser = JSON.parse(atob(token.split(".")[1]));
      setUser(decodedUser);

      // Redirect to the admin dashboard or any other page
      navigate("/admin/products");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
		setToken("")
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = JSON.parse(atob(token.split(".")[1]));
			setToken(token)
      setUser(decodedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
