import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { formatIDR } from "../../utils/utils";
import Button from "../../components/Button";
import { ExtendedProduct } from "./ProductsPage";
import { useAuth } from "../../hooks/useAuth";
import { addToCart } from "../../apis/cart"; // Import your API call function
import { USER_PRODUCTS } from "../../constants/routes";

const ProductDetailPage: React.FC = () => {
  const { account, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (!id) return <Navigate to={USER_PRODUCTS} />;

  const handleClick = async () => {
    if (!account) {
      navigate("/login");
      return;
    }

    if (!account.roles.includes("CUSTOMER")) {
      alert("Error: You are not authorized as a customer.");
      return;
    }

    try {
      await addToCart(id, 1, token, account.id);
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl font-semibold mb-4">
            {formatIDR(product.price)}
          </p>
          <p className="mb-4">{product.description}</p>
          <Button variant="primary" onClick={handleClick}>
            Add to Cart
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
