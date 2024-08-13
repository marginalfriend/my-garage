import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { formatIDR } from "../../utils/utils";

interface OrderReport {
  id: string;
  orderDate: string;
  userEmail: string;
  totalPrice: number;
  itemCount: number;
}

const ReportPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { token } = useAuth();

  const ORDERS_PER_PAGE = 10;

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ORDERS_PER_PAGE.toString(),
        startDate,
        endDate,
      });

      const response = await fetch(`/api/admin/orders-	report?${queryParams}`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order report");
      }

      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching order report:", error);
      setError("Failed to load order report. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, currentPage, startDate, endDate]);

  const handleDateFilterChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">Loading order report...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-heading">
        Admin Order Report
      </h1>

      <form onSubmit={handleDateFilterChange} className="mb-6 flex gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring focus:ring-accent focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="mt-auto bg-accent text-contrast py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Apply Filter
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-accent text-contrast">
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">User Email</th>
              <th className="p-2 text-right">Total Price</th>
              <th className="p-2 text-center">Item Count</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-2">{order.id}</td>
                <td className="p-2">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="p-2">{order.userEmail}</td>
                <td className="p-2 text-right">
                  {formatIDR(order.totalPrice)}
                </td>
                <td className="p-2 text-center">{order.itemCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-accent text-contrast py-2 px-4 rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-accent text-contrast py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
