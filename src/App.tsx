import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Adjust the path accordingly
// import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
// import AboutPage from "./pages/AboutPage";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mx-auto mt-4">
          <Routes>
            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/create" element={<CreateProductPage />} />
            {/* <Route path="/about" element={<AboutPage />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
