import React from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button"; // Assuming you have a Button component
import { LOGIN, HOME, FAQ, ABOUT, USER_PRODUCTS } from "../constants/routes";

const UserNavbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-heading text-2xl font-bold">
              GK5 Public Portal
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to={HOME}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to={USER_PRODUCTS}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to={FAQ}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  FAQ
                </NavLink>
                <NavLink
                  to={ABOUT}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-default hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  About
                </NavLink>
              </div>
            </div>
          </div>
          <NavLink to={LOGIN}>
            <Button>Login</Button>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
