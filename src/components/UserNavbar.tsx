import React, { useState } from "react";
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
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Icons for mobile menu

const UserNavbar: React.FC = () => {
  const { account: user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-default bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-contrast text-2xl font-bold">
              <span className="text-accent">GK5</span>GARAGE
            </div>
          </div>
          <div className="hidden md:flex ml-10 space-x-4">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-contrast hover:text-accent focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-default bg-opacity-95 backdrop-filter backdrop-blur-lg shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavLink
                  to={HOME}
                  end
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent block px-3 py-2 rounded-md text-base font-medium"
                      : "text-contrast hover:text-heading block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to={USER_PRODUCTS}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent block px-3 py-2 rounded-md text-base font-medium"
                      : "text-contrast hover:text-heading block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to={FAQ}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent block px-3 py-2 rounded-md text-base font-medium"
                      : "text-contrast hover:text-heading block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                  FAQ
                </NavLink>
                <NavLink
                  to={ABOUT}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent block px-3 py-2 rounded-md text-base font-medium"
                      : "text-contrast hover:text-heading block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to={ORDER}
                  className={({ isActive }) =>
                    isActive
                      ? "text-accent block px-3 py-2 rounded-md text-base font-medium"
                      : "text-contrast hover:text-heading block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                  Orders
                </NavLink>
                {user === null ? (
                  <NavLink to={LOGIN}>
                    <Button>Login</Button>
                  </NavLink>
                ) : (
                  <div className="flex flex-col gap-2">
                    <NavLink
                      to={CART}
                      className={({ isActive }) =>
                        isActive
                          ? "text-accent block px-3 py-2 rounded-md text-base font-medium"
                          : "text-contrast hover:text-heading block px-3 py-2 rounded-md text-base font-medium"
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
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
