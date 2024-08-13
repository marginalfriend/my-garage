import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { formatIDR } from "../../utils/utils";

interface OrderDetail {
  id: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  countedPrice: number;
}

interface Order {
  id: string;
  orderDate: string;
  totalPrice: number;
  orderDetails: OrderDetail[];
}

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg text-red-500">{error}</p>
        <div className="text-center mt-4">
          <Link to="/orders" className="text-accent hover:underline">
            View all orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg">Order not found.</p>
        <div className="text-center mt-4">
          <Link to="/orders" className="text-accent hover:underline">
            View all orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-heading">
        Order Confirmation
      </h1>
      <div className="bg-surface shadow-md rounded-lg p-6 mb-8">
        <p className="mb-2">
          <span className="font-semibold">Order ID:</span> {order.id}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Order Date:</span>{" "}
          {new Date(order.orderDate).toLocaleString()}
        </p>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-accent text-contrast">
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-center">Quantity</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderDetails.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-2 text-default">{item.product.name}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">
                  {formatIDR(item.product.price)}
                </td>
                <td className="p-2 text-right">
                  {formatIDR(item.countedPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right">
          <p className="text-xl font-semibold text-heading">
            Total:{" "}
            <span className="text-accent">{formatIDR(order.totalPrice)}</span>
          </p>
        </div>
      </div>
      <div className="text-center">
        <Link
          to="/orders"
          className="bg-accent text-contrast py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
