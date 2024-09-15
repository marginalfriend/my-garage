import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import emailjs from "@emailjs/browser";
import { ADMIN_PRODUCT_RESTOCK } from "../../constants/routes";

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

const RequestRestockPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string | undefined>();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleRequestRestock = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_REQUEST_TEMPLATE_ID,
          { productName: product.name, quantity: quantity },
          { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
        )
        .then((res) => console.log("EmailJS Response: ", res));
      alert(
        "Informasi Restock Barang Telah Berhasil Dikirim ke Email Supplier"
      );
      navigate(ADMIN_PRODUCT_RESTOCK);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto mb-24">
        <h1 className="text-heading text-2xl font-semibold mb-4">
          Request Restock {product.name}
        </h1>
        <form onSubmit={handleRequestRestock} className="space-y-4">
          <div>
            <label className="block text-default font-medium">Quantity</label>
            <input
              type="text"
              value={quantity}
              placeholder="Input quantity"
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Requesting..." : "Request Restock"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default RequestRestockPage;
