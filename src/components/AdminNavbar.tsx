import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ADMIN_PRODUCT_RESTOCK,
  ADMIN_PRODUCTS,
  CREATE_PRODUCT,
  REPORT,
} from "../constants/routes";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";

const AdminNavbar: React.FC = () => {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const isActive = (path: string) => path === pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-heading text-2xl font-bold">
              GK5 Admin Panel
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to={ADMIN_PRODUCT_RESTOCK} end>
                <Button
                  className={
                    isActive(ADMIN_PRODUCT_RESTOCK)
                      ? "text-accent"
                      : "text-default"
                  }
                  variant="glass"
                >
                  Restock
                </Button>
              </NavLink>
              <NavLink to={ADMIN_PRODUCTS} end>
                <Button
                  className={
                    isActive(ADMIN_PRODUCTS) ? "text-accent" : "text-default"
                  }
                  variant="glass"
                >
                  Products
                </Button>
              </NavLink>
              <NavLink to={CREATE_PRODUCT}>
                <Button
                  className={
                    isActive(CREATE_PRODUCT) ? "text-accent" : "text-default"
                  }
                  variant="glass"
                >
                  Create Product
                </Button>
              </NavLink>
              <NavLink to={REPORT}>
                <Button
                  className={isActive(REPORT) ? "text-accent" : "text-default"}
                  variant="glass"
                >
                  Reports
                </Button>
              </NavLink>
              <Button onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
