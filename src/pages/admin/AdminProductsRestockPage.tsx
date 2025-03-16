import React, { useEffect, useState } from "react";
import RestockTable from "../../components/RestockTable";
import emailjs from "@emailjs/browser";
import { useAuth } from "../../hooks/useAuth";

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

export type ToRestock = {
  id: string;
  quantity?: number;
  cost?: number;
  checked?: boolean;
};

const AdminProductsRestockPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [toRestock, setToRestock] = useState<ToRestock[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const onRestockChange = (request: ToRestock) => {
    const existingRestock = toRestock.find((t) => t.id === request.id);

    if (existingRestock) {
      const updatedRestock = { ...existingRestock, ...request };
      setToRestock((prevRestock) =>
        prevRestock.map((item) =>
          item.id === request.id ? updatedRestock : item
        )
      );
    } else {
      setToRestock((prevRestock) => [...prevRestock, request]);
    }
  };

  const handleRequestRestock = async () => {
    try {
      setIsLoading(true);
      const selectedItems = toRestock.filter((item) => item.checked);

      if (selectedItems.length === 0) {
        alert("Please select products to restock");
        return;
      }

      // Send restock requests
      for (const item of selectedItems) {
        await fetch(`/api/products/${item.id}/restock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            quantity: item.quantity,
            cost: item.cost,
          }),
        });
      }

      // Send email notification
      const productDetails = selectedItems
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
          return `${item.quantity} pcs of ${product?.name}`;
        })
        .join("\n");

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_REQUEST_TEMPLATE_ID,
        { productName: productDetails },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );

      alert("Products restocked successfully and notification sent!");
      setToRestock([]);
    } catch (error) {
      console.error(error);
      alert("Failed to process restock request");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?page=${currentPage}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts().then(() => setIsLoading(false));
  }, [currentPage, pageSize]);

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-heading text-2xl font-semibold mb-4">Restock</h1>
        {isLoading ? (
          <div className="w-screen h-screen">Loading...</div>
        ) : (
          <RestockTable
            handleRequestRestock={handleRequestRestock}
            toRestock={toRestock}
            onRestockChange={onRestockChange}
            products={products}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </main>
  );
};

export default AdminProductsRestockPage;
