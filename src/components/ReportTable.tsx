import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { formatIDR } from "../utils/utils";
import { PaymentStatus } from "@prisma/client";
import {
  useReactTable as useTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

interface OrderReport {
  id: string;
  orderDate: string;
  totalPrice: number;
  itemCount: number;
  paymentStatus: PaymentStatus;
}

const ReportTable: React.FC = () => {
  const [orders, setOrders] = useState<OrderReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "">("");
  const { token } = useAuth();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/orders/admin?page=${currentPage}&sort=${sort}&paymentStatus=${filterStatus}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

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
  }, [token, currentPage, sort, filterStatus]);

  const columns: ColumnDef<OrderReport>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
    },
    {
      accessorKey: "orderDate",
      header: "Date",
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleTimeString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: (info) => formatIDR(info.getValue() as number),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: (info) => (
        <select
          value={info.getValue() as PaymentStatus}
          onChange={(e) =>
            handleStatusChange(
              info.row.original.id,
              e.target.value as PaymentStatus
            )
          }
          className="border border-gray-300 rounded-md p-1"
        >
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      ),
    },
  ];

  const table = useTable({
    data: orders || [], // Provide a fallback empty array if orders is undefined
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleStatusChange = async (
    orderId: string,
    newStatus: PaymentStatus
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, paymentStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError("Failed to update payment status. Please try again later.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = () => {
    setSort((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
  };

  const handleFilterStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterStatus(event.target.value as PaymentStatus | "");
    setCurrentPage(1); // Reset to the first page on filter change
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <button
          onClick={handleSortChange}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sort by Date ({sort === "asc" ? "Ascending" : "Descending"})
        </button>
        <select
          value={filterStatus}
          onChange={handleFilterStatusChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-no-wrap border-b border-gray-300"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportTable;