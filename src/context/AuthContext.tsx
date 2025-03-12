/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_PRODUCTS, HOME, CREATE_PRODUCT } from "../constants/routes";

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.accessToken;

      localStorage.setItem("token", token);
      setToken(token);

      const decodedAccount = JSON.parse(atob(token.split(".")[1]));

      if (
        decodedAccount.roles.some(
          (x: string) => x === "SUPER_ADMIN" || x === "ADMIN" || x === "OWNER"
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
      alert(`Login failed: ${error}`);
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

      const currentPath = window.location.pathname;
      const isLoginPage =
        currentPath === "/login" || currentPath === "/admin/login";
      const isSuperAdmin = decodedAccount.roles.includes("SUPER_ADMIN");
      const isOwner = decodedAccount.roles.includes("OWNER");

      if (isSuperAdmin) {
        setIsAdmin(true);
        // Only allow access to products and create products pages
        const allowedPaths = [ADMIN_PRODUCTS, CREATE_PRODUCT];
        if (!allowedPaths.includes(currentPath) && !isLoginPage) {
          navigate(ADMIN_PRODUCTS);
        } else if (isLoginPage) {
          navigate(ADMIN_PRODUCTS);
        }
      } else if (isOwner) {
        setIsAdmin(true);
        if (isLoginPage) {
          navigate(ADMIN_PRODUCTS);
        }
      } else if (decodedAccount.roles.some((x: string) => x === "CUSTOMER")) {
        setIsUser(true);
        if (isLoginPage) {
          navigate(HOME);
        }
      }
    }

    setLoading(false);
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ account, login, logout, token, isAdmin, isUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
