/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADMIN_PRODUCTS, HOME } from "../constants/routes";

export interface AuthContextType {
  user: any;
  token: string;
  isAdmin: boolean;
  isUser: boolean;
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
  const [token, setToken] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const token = response.data.accessToken;

      // Save token to local storage
      localStorage.setItem("token", token);
      setToken(token);

      // Decode token to get user info
      const decodedUser = JSON.parse(atob(token.split(".")[1]));

      if (
        decodedUser.roles.some(
          (x: string) => x === "SUPER_ADMIN" || x === "ADMIN"
        )
      ) {
        setIsAdmin(true);
        setUser(decodedUser);
        navigate(ADMIN_PRODUCTS);
      } else if (decodedUser.roles.some((x: string) => x === "CUSTOMER")) {
        setIsUser(true);
        setUser(decodedUser);
        navigate(HOME);
      }

      // Redirect to the admin dashboard or any other page
    } catch (error) {
      alert("Login failed: invalid credentials");
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    navigate(HOME);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = JSON.parse(atob(token.split(".")[1]));
      setToken(token);
      setUser(decodedUser);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, token, isAdmin, isUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
