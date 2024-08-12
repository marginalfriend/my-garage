import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-background text-default">
      <h1 className="text-6xl font-bold text-heading mb-4">404</h1>
      <p className="text-xl mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="text-accent underline">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
