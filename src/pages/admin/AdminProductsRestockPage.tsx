import React, { useEffect, useState } from "react";
import RestockTable from "../../components/RestockTable";
import emailjs from "@emailjs/browser";

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
  checked?: boolean;
};

const AdminProductsRestockPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [toRestock, setToRestock] = useState<ToRestock[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

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
      if (request.quantity === 0) {
        // Remove the item if quantity is 0
        setToRestock((prevRestock) =>
          prevRestock.filter((item) => item.id !== request.id)
        );
      } else {
        // Update existing entry with new quantity or checked state
        const updatedRestock = { ...existingRestock, ...request };
        setToRestock((prevRestock) =>
          prevRestock.map((item) =>
            item.id === request.id ? updatedRestock : item
          )
        );
      }
    } else {
      // Add new entry if it doesn't exist and quantity is greater than 0
      if ((request.quantity as number) > 0) {
        setToRestock((prevRestock) => [
          ...prevRestock,
          { id: request.id, checked: false, quantity: 0 },
        ]);
      }
    }
  };

  const handleRequestRestock = () => {
    try {
      setIsLoading(true);

      for (const t of toRestock) {
        if (t.checked) {
          const product = products.find((p) => p.id === t.id) as Product;
          emailjs
            .send(
              import.meta.env.VITE_EMAILJS_SERVICE_ID,
              import.meta.env.VITE_REQUEST_TEMPLATE_ID,
              { productName: product.name, quantity: t.quantity },
              { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
            )
            .then((res) => console.log("EmailJS Response: ", res));
        }
      }
      setToRestock([]);
      alert(
        "Informasi Restock Barang Telah Berhasil Dikirim ke Email Supplier"
      );
    } catch (error) {
      console.log(error);
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
  }, [currentPage, pageSize, toRestock]);

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-heading text-2xl font-semibold mb-4">Products</h1>
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
