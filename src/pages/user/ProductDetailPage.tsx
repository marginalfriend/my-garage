import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { formatIDR } from "../../utils/utils";
import Button from "../../components/Button";
import { ExtendedProduct } from "./ProductsPage";
import { useAuth } from "../../hooks/useAuth";
import {
  addToCart,
  deleteCartItem,
  getUserCartItemByProductId,
  updateCartItem,
} from "../../apis/cartApi";
import { NOT_FOUND, USER_PRODUCTS } from "../../constants/routes";
import { Cart } from "@prisma/client";

const ProductDetailPage: React.FC = () => {
  const { account, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartItem, setCartItem] = useState<Cart | undefined>();

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
            setCartItem(cartItem);
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
      if (cartItem) {
        handleUpdateQuantity(quantity);
      } else {
        await addToCart(id, quantity, token, account.id);
      }

      alert(
        "Pesanan Berhasil Ditambahkan! Produk pilihan Anda telah berhasil ditambahkan ke keranjang. Lanjutkan berbelanja atau menuju ke keranjang untuk menyelesaikan pesanan Anda."
      );
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    try {
      if (newQuantity > 0) {
        await updateCartItem(account.id, id, newQuantity, token);
      } else {
        await deleteCartItem(id, token, account.id);
        setCartItem(undefined);
      }
      setQuantity(newQuantity);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleChange = (e: number) => {
    if (!product) return navigate(NOT_FOUND);
    if (e > product.stock) {
      alert("Insufficient stock.");
    } else {
      setQuantity(e);
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
          <Carousel
            selectedItem={currentImageIndex}
            onChange={setCurrentImageIndex}
            showArrows={true}
            showStatus={false}
            showThumbs={true}
          >
            {product.images.map((image, index) => (
              <div key={index} className="w-[75%]">
                <img
                  src={image.url}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="font-semibold">{formatIDR(product.price)}</p>
          <p className="font-semibold mb-4">Stock: {product.stock}</p>
          <p className="mb-4">{product.description}</p>
          <div className="flex flex-col align-middle justify-center gap-2">
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleChange(parseInt(e.target.value))}
              className="border p-1 rounded w-12 appearance-none"
            />
            <Button
              variant="primary"
              onClick={() => handleAddToCart()}
              className="w-fit"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
