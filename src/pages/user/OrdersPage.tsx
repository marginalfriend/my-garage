import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { formatIDR } from "../../utils/utils";

interface Order {
  id: string;
  orderDate: string;
  totalPrice: number;
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
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
              className="bg-surface shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <p className="font-semibold mb-2">Order ID: {order.id}</p>
              <p className="mb-2">
                Date: {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p className="mb-2">Total: {formatIDR(order.totalPrice)}</p>
              <p className="mb-2">Items:</p>
              <ul className="list-disc list-inside">
                {order.orderDetails.slice(0, 3).map((item) => (
                  <li key={item.id} className="text-sm">
                    {item.product.name} (x{item.quantity})
                  </li>
                ))}
                {order.orderDetails.length > 3 && (
                  <li className="text-sm">
                    and {order.orderDetails.length - 3} more...
                  </li>
                )}
              </ul>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
