import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import { useAuth } from "./hooks/useAuth"; // Custom hook for authentication
import CreateProductPage from "./pages/CreateProductPage";

const App: React.FC = () => {
  const { user } = useAuth();
	const isAuthenticated = user !== null

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Protected Admin Routes */}
      <Route
        path="/admin/products"
        element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/products/create"
        element={
          isAuthenticated ? <CreateProductPage /> : <Navigate to="/login" />
        }
      />
      {/* <Route
        path="/admin/reports"
        element={isAuthenticated ? <ReportPage /> : <Navigate to="/login" />}
      /> */}
      {/* Redirect to login if no match */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
