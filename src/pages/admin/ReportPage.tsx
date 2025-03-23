/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { formatIDR } from "../../utils/utils";
import {
  useReactTable as useTable,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
} from "@tanstack/react-table";
import Button from "../../components/Button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ProductBatch {
  id: string;
  orderDate: string;
  batchNumber: string;
  cost: number;
  quantity: number;
  remainingQuantity: number;
  status: string;
  product: {
    name: string;
    price: number;
  };
}

const ReportPage: React.FC = () => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [nameFilter, setNameFilter] = useState("");
  const { token } = useAuth();
  const [pageSize, setPageSize] = useState(10);

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/orders/admin/batches?page=${currentPage}&limit=${pageSize}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch batch report");
      }

      const data = await response.json();
      setBatches(data.batches);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching batch report:", error);
      setError("Failed to load batch report. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [token, currentPage, pageSize]);

  const columns: ColumnDef<ProductBatch>[] = [
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      accessorKey: "product.name",
      header: "Product Name",
      filterFn: "includesString",
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: (info) => formatIDR(info.getValue() as number),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      id: "subTotal",
      header: "Sub Total",
      cell: (info) => {
        const quantity = info.row.original.quantity;
        const cost = info.row.original.cost;
        return formatIDR(quantity * cost);
      },
    },
  ];

  const table = useTable({
    data: batches,
    columns,
    state: {
      sorting,
      globalFilter: nameFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const productName = row.getValue("product.name") as string;
      return productName.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <main>Loading...</main>;
  }

  if (error) {
    return <main className="text-red-500">{error}</main>;
  }

  return (
    <main className="px-6 mb-20">
      <h1 className="text-heading text-2xl font-semibold mb-4 py-5">
        Product Batch Reports
      </h1>

      {/* Search Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by product name..."
          className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md"
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {!batches || batches.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center">
          <img
            src="https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-404-network-disruption_516790-2345.jpg?w=740"
            width={250}
          />
          <p>No batches found...</p>
        </div>
      ) : (
        <>
          <table className="min-w-full bg-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          <span>
                            {header.column.getIsSorted() === "asc"
                              ? "🔼"
                              : "🔽"}
                          </span>
                        )}
                      </div>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Updated Pagination Section */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-accent text-contrast rounded"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-accent text-contrast rounded"
              >
                Next
              </Button>
            </div>
            <div>
              <select
                value={pageSize}
                onChange={(e) => {
                  const newPageSize = Number(e.target.value);
                  setPageSize(newPageSize);
                  setCurrentPage(1); // Reset to first page when changing page size
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none sm:text-sm rounded-md"
              >
                {[5, 10, 15, 20, 25].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ReportPage;
