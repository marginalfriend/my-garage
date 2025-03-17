/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_PRODUCTS,
  HOME,
  ADMIN_PRODUCT_RESTOCK,
  ADMIN_ORDER,
  CART,
  ORDER,
  LOGIN,
  ADMIN_LOGIN,
  CREATE_PRODUCT,
  REPORT,
} from "../constants/routes";

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
  const currentPath = window.location.pathname;

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

      const isLoginPage =
        currentPath === "/login" || currentPath === "/admin/login";
      const isSuperAdmin = decodedAccount.roles.includes("SUPER_ADMIN");
      const isOwner = decodedAccount.roles.includes("OWNER");
      const isCustomer = decodedAccount.roles.includes("CUSTOMER");

      if (isSuperAdmin) {
        setIsAdmin(true);
        const prohibitedPaths = [
          ADMIN_PRODUCT_RESTOCK,
          REPORT,
          CART,
          ORDER,
          LOGIN,
          ADMIN_LOGIN,
        ];
        if (prohibitedPaths.some((path) => currentPath.startsWith(path))) {
          navigate(ADMIN_PRODUCTS);
        }
      } else if (isOwner) {
        setIsAdmin(true);
        const prohibitedPaths = [
          CART,
          ORDER,
          LOGIN,
          ADMIN_LOGIN,
          ADMIN_PRODUCTS,
          ADMIN_ORDER,
          CREATE_PRODUCT,
        ];
        if (prohibitedPaths.some((path) => currentPath.startsWith(path))) {
          navigate(ADMIN_PRODUCT_RESTOCK);
        }
      } else if (isCustomer) {
        setIsUser(true);
        if (currentPath.startsWith("/admin") || isLoginPage) {
          navigate(HOME);
        }
      }
    }

    setLoading(false);
  }, [navigate, currentPath]);

  return (
    <AuthContext.Provider
      value={{ account, login, logout, token, isAdmin, isUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
