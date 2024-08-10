import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewProduct from "./pages/NewProduct";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/products/new" element={<NewProduct />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;
