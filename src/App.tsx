import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AdminNavbar from "./components/AdminNavbar";
import UserNavbar from "./components/UserNavbar";

// Admin pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import CreateProductPage from "./pages/admin/CreateProductPage";
import NotFoundPage from "./pages/NotFoundPage";

// User pages
import HomePage from "./pages/user/HomePage";
import UserProductsPage from "./pages/user/ProductsPage";
import ContactPage from "./pages/user/ContactPage";
import AboutPage from "./pages/user/AboutPage";
import FAQPage from "./pages/user/FAQPage";
import LoginPage from "./pages/user/UserLoginPage";
import RegisterPage from "./pages/user/UserRegistrationPage";

// Route constants
import {
  ADMIN_HOME_PAGE,
  ADMIN_PRODUCTS,
  CREATE_PRODUCT,
  ADMIN_LOGIN,
  NOT_FOUND,
  HOME,
  USER_PRODUCTS,
  CONTACT,
  ABOUT,
  FAQ,
  REGISTER,
  LOGIN,
	CART,
} from "./constants/routes";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetailPage from "./pages/user/ProductDetailPage";
import CartPage from "./pages/user/CartPage";

const UserLayout = () => {
  return (
    <div className="overflow-x-hidden">
      <UserNavbar />
      <Outlet />
    </div>
  );
};

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
};

const App: React.FC = () => {
  const { isAdmin, isUser } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path={LOGIN} element={<LoginPage />} />
      <Route path={REGISTER} element={<RegisterPage />} />
      <Route path={ADMIN_LOGIN} element={<AdminLoginPage />} />
      <Route element={<UserLayout />}>
        <Route path={HOME} element={<HomePage />} />
        <Route path={USER_PRODUCTS} element={<UserProductsPage />} />
        <Route path={USER_PRODUCTS + "/:id"} element={<ProductDetailPage />} />
        <Route path={CONTACT} element={<ContactPage />} />
        <Route path={ABOUT} element={<AboutPage />} />
        <Route path={FAQ} element={<FAQPage />} />
        <Route path={CART} element={<CartPage />} />
      </Route>

      {/* User routes */}
      <Route element={<ProtectedRoute isAllowed={isUser} />}>
        <Route element={<UserLayout />}></Route>
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute isAllowed={isAdmin} redirectPath={ADMIN_LOGIN} />
        }
      >
        <Route path={ADMIN_HOME_PAGE} element={<AdminLayout />}>
          <Route path={ADMIN_PRODUCTS} element={<AdminProductsPage />} />
          <Route path={CREATE_PRODUCT} element={<CreateProductPage />} />
          {/* Add more admin routes here as needed */}
        </Route>
      </Route>

      {/* Not Found route */}
      <Route path={NOT_FOUND} element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to={NOT_FOUND} replace />} />
    </Routes>
  );
};

export default App;
