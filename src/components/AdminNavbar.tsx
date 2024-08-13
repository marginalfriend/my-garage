import React from "react";
import { NavLink } from "react-router-dom";
import {
  ADMIN_PRODUCTS,
  CREATE_PRODUCT,
  REPORT,
} from "../constants/routes";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";

const AdminNavbar: React.FC = () => {
  const { logout } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-heading text-2xl font-bold">
              GK5 Admin Panel
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to={ADMIN_PRODUCTS}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to={CREATE_PRODUCT}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  Create Product
                </NavLink>
                <NavLink
                  to={REPORT}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
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

export default AdminNavbar;
