import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import { useAuth } from "./hooks/useAuth"; // Custom hook for authentication
import CreateProductPage from "./pages/CreateProductPage";
import { CREATE_PRODUCT, LOGIN, NOT_FOUND, PRODUCTS } from "./constants/routes";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const { user } = useAuth();
	const isAuthenticated = user !== null

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path={LOGIN} element={!isAuthenticated ? <LoginPage /> : <Navigate to={PRODUCTS} />} />
        <Route path={NOT_FOUND} element={<NotFoundPage />} />
        {/* Protected Admin Routes */}
        <Route
          path={PRODUCTS}
          element={isAuthenticated ? <ProductsPage /> : <Navigate to={LOGIN} />}
        />
        <Route
          path={CREATE_PRODUCT}
          element={
            isAuthenticated ? <CreateProductPage /> : <Navigate to={LOGIN} />
          }
        />
        {/* <Route
        path="/admin/reports"
        element={isAuthenticated ? <ReportPage /> : <Navigate to={LOGIN} />}
      /> */}
        {/* Redirect to login if no match */}
        <Route path="*" element={<Navigate to={NOT_FOUND} />} />
      </Routes>
    </>
  );
};

export default App;
