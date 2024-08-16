import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductTable from "../../components/ProductTable"; // Assuming ProductTable is in the same directory
import { EDIT_PRODUCT } from "../../constants/routes";

type Product = {
  id: string;
  isActive: boolean;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: { id: string; url: string; productId: string }[];
};

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the backend API
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`${EDIT_PRODUCT}/${id}`);
  };

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-heading text-2xl font-semibold mb-4">Products</h1>
        <ProductTable products={products} onEdit={handleEdit} />
      </div>
    </main>
  );
};

export default AdminProductsPage;
