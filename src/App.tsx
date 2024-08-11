import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import ProductsPage from "./pages/admin/ProductsPage";
import { useAuth } from "./hooks/useAuth"; // Custom hook for authentication
import CreateProductPage from "./pages/admin/CreateProductPage";
import {
  CREATE_PRODUCT,
  ADMIN_LOGIN,
  NOT_FOUND,
  PRODUCTS,
} from "./constants/routes";
import NotFoundPage from "./pages/admin/NotFoundPage";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <>
      {isAdmin && <Navbar />}
      <Routes>
        <Route
          path={ADMIN_LOGIN}
          element={
            !isAdmin ? <AdminLoginPage /> : <Navigate to={PRODUCTS} />
          }
        />
        <Route path={NOT_FOUND} element={<NotFoundPage />} />
        <Route
          path={PRODUCTS}
          element={
            isAdmin ? <ProductsPage /> : <Navigate to={ADMIN_LOGIN} />
          }
        />
        <Route
          path={CREATE_PRODUCT}
          element={
            isAdmin ? (
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
