import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import { useAuth } from "./hooks/useAuth"; // Custom hook for authentication
import CreateProductPage from "./pages/CreateProductPage";
import {
  CREATE_PRODUCT,
  ADMIN_LOGIN,
  NOT_FOUND,
  PRODUCTS,
} from "./constants/routes";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = user !== null;

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path={ADMIN_LOGIN}
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={PRODUCTS} />
          }
        />
        <Route path={NOT_FOUND} element={<NotFoundPage />} />
        <Route
          path={PRODUCTS}
          element={
            isAuthenticated ? <ProductsPage /> : <Navigate to={ADMIN_LOGIN} />
          }
        />
        <Route
          path={CREATE_PRODUCT}
          element={
            isAuthenticated ? (
              <CreateProductPage />
            ) : (
              <Navigate to={ADMIN_LOGIN} />
            )
          }
        />
        <Route path="*" element={<Navigate to={NOT_FOUND} />} />
      </Routes>
    </>
  );
};

export default App;
