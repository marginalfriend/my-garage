import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";

// Admin pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CreateProductPage from "./pages/admin/CreateProductPage";
import NotFoundPage from "./pages/admin/NotFoundPage";

// User pages
import HomePage from "./pages/user/HomePage";
import UserProductsPage from "./pages/user/ProductsPage";
import ContactPage from "./pages/user/ContactPage";
import AboutPage from "./pages/user/AboutPage";
import FAQPage from "./pages/user/FAQPage";

// Route constants
import {
  CREATE_PRODUCT,
  ADMIN_LOGIN,
  NOT_FOUND,
  PRODUCTS,
  HOME,
  USER_PRODUCTS,
  CONTACT,
  ABOUT,
  FAQ,
} from "./constants/routes";

// Define routes outside of the component
const adminRoutes = [
  { path: ADMIN_LOGIN, element: AdminLoginPage },
  { path: PRODUCTS, element: ProductsPage },
  { path: CREATE_PRODUCT, element: CreateProductPage },
];

const userRoutes = [
  { path: HOME, element: HomePage },
  { path: USER_PRODUCTS, element: UserProductsPage },
  { path: CONTACT, element: ContactPage },
  { path: ABOUT, element: AboutPage },
  { path: FAQ, element: FAQPage },
];

const App: React.FC = () => {
  const { isAdmin, isUser } = useAuth();

  return (
    <>
      {isAdmin && <Navbar />}
      {isUser && <UserNavbar />} {/* Assume you have a UserNavbar component */}
      <Routes>
        {/* Admin Routes */}
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              isAdmin ? (
                <route.element />
              ) : (
                <Navigate to={ADMIN_LOGIN} replace />
              )
            }
          />
        ))}

        {/* User Routes */}
        {userRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              isUser ? <route.element /> : <Navigate to={HOME} replace />
            }
          />
        ))}

        {/* Not Found and Catch-all Routes */}
        <Route path={NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={NOT_FOUND} replace />} />
      </Routes>
    </>
  );
};

export default App;
