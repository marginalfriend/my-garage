/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADMIN_PRODUCTS, HOME } from "../constants/routes";

export interface AuthContextType {
  account: any;
  token: string;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean; // Add this line
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Add this line
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const token = response.data.accessToken;

      localStorage.setItem("token", token);
      setToken(token);

      const decodedAccount = JSON.parse(atob(token.split(".")[1]));

      if (
        decodedAccount.roles.some(
          (x: string) => x === "SUPER_ADMIN" || x === "ADMIN"
        )
      ) {
        setIsAdmin(true);
        setAccount(decodedAccount);
        navigate(ADMIN_PRODUCTS);
      } else if (decodedAccount.roles.some((x: string) => x === "CUSTOMER")) {
        setIsUser(true);
        setAccount(decodedAccount);
        navigate(HOME);
      }
    } catch (error) {
      alert("Login failed: invalid credentials");
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAccount(null);
    setToken("");
    navigate(HOME);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedAccount = JSON.parse(atob(token.split(".")[1]));
      setToken(token);
      setAccount(decodedAccount);

      if (
        decodedAccount.roles.some(
          (x: string) => x === "SUPER_ADMIN" || x === "ADMIN"
        )
      ) {
        setIsAdmin(true);
      } else if (decodedAccount.roles.some((x: string) => x === "CUSTOMER")) {
        setIsUser(true);
      }
    }

    setLoading(false); // Set loading to false after checking token
  }, []);

  return (
    <AuthContext.Provider
      value={{ account, login, logout, token, isAdmin, isUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
