// ProductsPage.tsx
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import ProductCard from "../../components/ProductCard";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = async () => {
    return await fetch("/api/products");
  };

  useEffect(() => {
    getProducts()
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setProducts(data);
      });
  }, []);

  return (
    <main className="px-20">
      <h1 className="text-heading text-2xl font-semibold mb-4 py-5">
        Products
      </h1>
      <div className="grid grid-cols-3 gap-5">
        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </main>
  );
}

export default ProductsPage;