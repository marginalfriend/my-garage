import React from "react";
import { NavLink } from "react-router-dom";
import {
  ADMIN_HOME_PAGE,
  PRODUCTS,
  CREATE_PRODUCT,
} from "../constants/routes";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  return (
    <nav className="bg-surface shadow-md z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-heading text-2xl font-bold">
              Admin Panel
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to={PRODUCTS}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium"
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to={CREATE_PRODUCT}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium"
                  }
                >
                  Create Product
                </NavLink>
                <NavLink
                  to={ADMIN_HOME_PAGE + "/reports"}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium"
                  }
                >
                  Reports
                </NavLink>
              </div>
            </div>
          </div>
          <Button onClick={logout}>Logout</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
