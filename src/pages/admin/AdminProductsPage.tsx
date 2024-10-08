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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?page=${currentPage}&pageSize=${pageSize}`);
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize]);

  const handleEdit = (id: string) => {
    navigate(`${EDIT_PRODUCT}/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-heading text-2xl font-semibold mb-4">Products</h1>
        <ProductTable 
          products={products}
          onEdit={handleEdit}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </main>
  );
};

export default AdminProductsPage;
