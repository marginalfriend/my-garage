/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import Button from "./Button";
import { formatIDR } from "../utils/utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ToRestock } from "../pages/admin/AdminProductsRestockPage";

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

type ProductTableProps = {
  handleRequestRestock: () => void;
  toRestock: ToRestock[];
  onRestockChange: (toRestock: ToRestock) => void;
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const RestockTable: React.FC<ProductTableProps> = ({
  handleRequestRestock,
  toRestock,
  onRestockChange,
  products,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "checkbox",
        cell: ({ row }) => {
          const restockItem = toRestock.find((t) => t.id === row.original.id);
          const isChecked = restockItem?.checked ?? false;
          const isDisabled = (restockItem?.quantity ?? 0) === 0; // Disable if quantity is 0

          return (
            <input
              type="checkbox"
              id={row.original.id}
              onChange={() =>
                onRestockChange({ id: row.original.id, checked: !isChecked })
              }
              checked={isChecked}
              disabled={isDisabled} // Disable checkbox if quantity is 0
            />
          );
        },
        enableSorting: true,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }: { getValue: () => any }) =>
          `${formatIDR(getValue())}`,
        enableSorting: true,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        enableSorting: true,
      },
      {
        id: "category",
        accessorKey: "category.name",
        header: "Category",
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const quantity = () =>
            toRestock.find((t) => t.id === row.original.id)?.quantity || 0;
          const qty = quantity();

          return (
            <div className="flex items-center justify-center">
              <button
                className="p-2 bg-gray-200 rounded-l disabled:opacity-30"
                disabled={qty < 1}
                onClick={() =>
                  onRestockChange({ id: row.original.id, quantity: qty - 1 })
                }
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="px-4">{qty}</span>
              <button
                className="p-2 bg-gray-200 disabled:opacity-30 rounded-r"
                onClick={() =>
                  onRestockChange({ id: row.original.id, quantity: qty + 1 })
                }
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [toRestock, onRestockChange]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="bg-background">
      <div className="mb-4 flex justify-between">
        <div>
          <input
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            placeholder="Filter by name"
            className="p-2 border rounded"
          />
          <input
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("category")?.setFilterValue(e.target.value)
            }
            placeholder="Filter by category"
            className="p-2 border rounded ml-2"
          />
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-accent">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-contrast uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-surface divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-default"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full flex justify-end py-4">
        <Button onClick={() => handleRequestRestock()}>Request</Button>
      </div>

      {/* Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-accent text-contrast rounded"
          >
            Previous
          </Button>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-accent text-contrast rounded"
          >
            Next
          </Button>
        </div>
        <div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              const newPageSize = Number(e.target.value);
              onPageSizeChange(newPageSize);
              table.setPageSize(newPageSize);
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none sm:text-sm rounded-md"
          >
            {[5, 10, 15, 20, 25].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default RestockTable;
