import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { formatIDR } from "../../utils/utils";
import { ORDER } from "../../constants/routes";
import { PaymentStatus } from "@prisma/client";
import Button from "../../components/Button";
import { cancelOrder } from "../../apis/orderApi";

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
  paymentStatus: PaymentStatus;
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

  const handleCancelOrder = async () => {
    try {
      if (!orderId) throw new Error("Order ID is undefined");
      const updatedOrder = await cancelOrder(token, orderId);
      setOrder(updatedOrder);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-lg">Loading order details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-lg text-red-500">{error}</p>
        <div className="text-center mt-4">
          <Link to="/orders" className="text-accent hover:underline">
            View all orders
          </Link>
        </div>
      </main>
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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-heading">
        Order Confirmation
      </h1>
      <div className="bg-surface shadow-md rounded-lg p-6 mb-8 border">
        <p className="text-xs mb-2 p-1 bg-slate-200 rounded-sm">
          <span className="font-semibold">Order ID:</span> {order.id}
        </p>
        <p className="text-xs mb-2 p-1 bg-slate-200 rounded-sm">
          <span className="font-semibold">Order Date:</span>{" "}
          {new Date(order.orderDate).toLocaleString()}
        </p>
        <p className="text-xs mb-4 p-1 bg-slate-200 rounded-sm">
          <span className="font-semibold">Payment Status:</span>{" "}
          <span
            className={`${
              order.paymentStatus === "PAID"
                ? "bg-lime-500"
                : order.paymentStatus === "CANCELLED"
                ? "bg-rose-500"
                : "bg-yellow-500"
            } bg-opacity-80 p-1 rounded-sm`}
          >
            {order.paymentStatus}
          </span>
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
            {order.orderDetails &&
              order.orderDetails.map((item) => (
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
        <div className="flex justify-between items-center">
          {order.paymentStatus === "PENDING" ? (
            <Button variant="danger" onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          ) : (
            <div></div>
          )}
          <p className="text-xl font-semibold text-heading">
            Total:{" "}
            <span className="text-accent">{formatIDR(order.totalPrice)}</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <Link
          to={ORDER}
          className="bg-accent text-contrast py-2 px-4 rounded hover:bg-heading transition-colors"
        >
          View All Orders
        </Link>
      </div>
    </main>
  );
};

export default OrderConfirmationPage;
