import React from "react";
import { Link } from "react-router-dom";
import { CREATE_PRODUCT, PRODUCTS } from "../constants/routes";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-accent text-contrast p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-heading">
          MyShop
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="hover:bg-surface hover:text-heading px-3 py-2 rounded transition"
          >
            Home
          </Link>
          <Link
            to={PRODUCTS}
            className="hover:bg-surface hover:text-heading px-3 py-2 rounded transition"
          >
            Products
          </Link>
          <Link
            to={CREATE_PRODUCT}
            className="hover:bg-surface hover:text-heading px-3 py-2 rounded transition"
          >
            Create Product
          </Link>
          <Link
            to="/about"
            className="hover:bg-surface hover:text-heading px-3 py-2 rounded transition"
          >
            About
          </Link>
        </div>

        <div className="md:hidden">
          <button
            className="text-heading focus:outline-none"
            aria-label="Toggle menu"
          >
            {/* You can add a hamburger icon here */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
