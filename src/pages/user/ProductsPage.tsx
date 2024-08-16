// ProductsPage.tsx
import { useEffect, useState } from "react";
import { Category, Image, Product } from "@prisma/client";
import ProductCard from "../../components/ProductCard";

export type ExtendedProduct = Product & {
	images: Image[]
	category: Category
}

function ProductsPage() {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);

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
          products.map((product: ExtendedProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </main>
  );
}

export default ProductsPage;
