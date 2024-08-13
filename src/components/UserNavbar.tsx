import React from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button"; // Assuming you have a Button component
import {
  LOGIN,
  HOME,
  FAQ,
  ABOUT,
  USER_PRODUCTS,
  CART,
	ORDER,
} from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

const UserNavbar: React.FC = () => {
  const { account: user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-default bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-contrast text-2xl font-bold">
              <span className="text-accent">GK5</span>GARAGE
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to={HOME}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-contrast hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to={USER_PRODUCTS}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-contrast hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to={FAQ}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-contrast hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  FAQ
                </NavLink>
                <NavLink
                  to={ABOUT}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-contrast hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to={ORDER}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                      : "text-contrast hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                  }
                >
                  Orders
                </NavLink>
              </div>
            </div>
          </div>
          {user === null ? (
            <NavLink to={LOGIN}>
              <Button>Login</Button>
            </NavLink>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink
                to={CART}
                className={({ isActive }) =>
                  isActive
                    ? "text-accent px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
                    : "text-contrast hover:text-heading px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-20"
                }
              >
                <button>
                  <ShoppingBagIcon width={22} height={22} className="" />
                </button>
              </NavLink>
              <Button onClick={logout}>Logout</Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
