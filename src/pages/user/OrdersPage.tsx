import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { formatIDR } from "../../utils/utils";
import { PaymentStatus } from "@prisma/client";

interface Order {
  id: string;
  orderDate: string;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  orderDetails: {
    id: string;
    product: {
      name: string;
    };
    quantity: number;
  }[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-lg">Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-center text-lg text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-heading">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-lg">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/order/${order.id}`}
              className="bg-surface shadow-md rounded-lg p-6 hover:shadow-lg hover:bg-slate-50 transition-shadow"
            >
              <p className="font-semibold text-[11px] text-default mb-2">
                Order ID: {order.id}
              </p>
              <p className="mb-2 text-sm">
                Date:{" "}
                {new Date(order.orderDate).toLocaleTimeString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="mb-2 text-sm">
                Total: {formatIDR(order.totalPrice)}
              </p>
              <p className="mb-2 text-sm">
                Payment Status:{" "}
                <span
                  className={`${
                    order.paymentStatus === "PAID"
                      ? "bg-lime-500"
                      : order.paymentStatus === "CANCELLED"
                      ? "bg-rose-500"
                      : "bg-yellow-500"
                  } bg-opacity-80 p-1 rounded`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p className="mb-2 text-xs font-semibold">
                Click to see the details
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;
