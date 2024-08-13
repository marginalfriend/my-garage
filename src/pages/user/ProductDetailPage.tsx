/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { formatIDR } from "../../utils/utils";
import Button from "../../components/Button";
import { ExtendedProduct } from "./ProductsPage";
import { useAuth } from "../../hooks/useAuth";
import {
  addToCart,
  getUserCartItemByProductId,
  updateCartItem,
} from "../../apis/cartApi"; // Import your API call functions
import { USER_PRODUCTS } from "../../constants/routes";

const ProductDetailPage: React.FC = () => {
  const { account, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);

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

  useEffect(() => {
    // Fetch the current quantity in cart for this product
    const fetchCartQuantity = async () => {
      if (account && id) {
        try {
          const cartItem = await getUserCartItemByProductId(token, id);
          if (cartItem) {
            setQuantity(cartItem.quantity);
          }
        } catch (error) {
          console.error("Error fetching cart quantity:", error);
        }
      }
    };

    fetchCartQuantity();
  }, [account, id, token]);

  if (!id) return <Navigate to={USER_PRODUCTS} />;

  const handleAddToCart = async () => {
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
      setQuantity(1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0) return;

    try {
      await updateCartItem(account.id, id, newQuantity, token);
      setQuantity(newQuantity);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      alert("Failed to update cart quantity.");
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
          {quantity === 0 ? (
            <Button variant="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => handleUpdateQuantity(quantity - 1)}
              >
                -
              </Button>
              <span className="mx-4">{quantity}</span>
              <Button
                variant="secondary"
                onClick={() => handleUpdateQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
