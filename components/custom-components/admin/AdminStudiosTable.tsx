"use client";
import { Button } from "@/components/shadcn/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { DataTablePagination } from "../common/DataTablePagination";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminStudiosTable = ({ data }: { data: { studio_id: string; studio_name: string; studio_slug: string; request_review_date: string }[] }) => {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "request_review_date",
      desc: true,
    },
  ]);

  const columnHeadersArrayMap = [
    { label: "Id", columnName: "studio_id" },
    { label: "Name", columnName: "studio_name" },
    { label: "Request Review Date", columnName: "request_review_date" },
  ];

  const columnHelper = createColumnHelper();

  const columns = columnHeadersArrayMap.map(({ label, columnName }) => {
    return columnHelper.accessor(
      (row) => {
        // transformational
        // @ts-ignore
        const value = row[columnName];
        return value;
      },
      {
        id: columnName,
        header: ({ column }) => {
          return (
            <Button variant="ghost" className="hover:bg-transparent pl-1 w-full flex justify-between" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              {label}

              {column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}

              {column.getIsSorted() === "desc" && <ArrowDown className="ml-2 h-4 w-4" />}

              {column.getIsSorted() !== "desc" && column.getIsSorted() !== "asc" && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          );
        },
        cell: ({ getValue }) => {
          // presentational
          const value = getValue();
          if (columnName === "total_payout_amount" || columnName === "total_refund_amount" || columnName === "total_completed_booking_amount") {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "HKD",
            }).format(value);
          }
          return value;
        },
      }
    );
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="mt-3 mb-8 flex flex-col gap-4">
      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              //@ts-ignore
              <TableRow key={row.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => router.push(`/admin/studio/${row.original.studio_id}`)}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};

export default AdminStudiosTable;
