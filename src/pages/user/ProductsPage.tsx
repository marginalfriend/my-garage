// ProductsPage.tsx
import { useEffect, useState } from "react";
import { Category, Image, Product } from "@prisma/client";
import ProductCard from "../../components/ProductCard";

export type ExtendedProduct = Product & {
  images: Image[];
  category: Category;
};

function ProductsPage() {
  const [products, setProducts] = useState<ExtendedProduct[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getProducts = async (page: number) => {
    return await fetch(`/api/products?page=${page}&pageSize=9`);
  };

  useEffect(() => {
    setIsLoading(true);
    getProducts(currentPage)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <main className="px-20">
      <h1 className="text-heading text-2xl font-semibold mb-4 py-5">
        Products
      </h1>
      {isLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : !products ? (
        <p>No product data available.</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-5">
            {products
              .filter((product: ExtendedProduct) => product.isActive)
              .map((product: ExtendedProduct) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 ml-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default ProductsPage;
