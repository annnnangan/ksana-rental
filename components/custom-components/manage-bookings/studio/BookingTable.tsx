"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";

import { ArrowUpDown, ArrowDown, ArrowUp, ChevronRight, ChevronLeft } from "lucide-react";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import Filter from "../../react-table/Filter";
import { convertTimeToString } from "@/lib/utils/date-time/format-time-utils";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import BookingDetailsModal from "../BookingDetailsModal";

export interface StudioBookingRecord {
  studio_id: string;
  booking_reference_no: string;
  booking_date: Date;
  price: string;
  start_time: string;
  end_time: string;
  remarks: string;
  status: string;
  user_name: string;
  user_phone: string;
}

type Props = {
  data: StudioBookingRecord[];
};

export default function TicketTable({ data }: Props) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "booking_date",
      desc: true,
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState<StudioBookingRecord>();
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const columnHeadersArrayMap = [
    { label: "預約日期", columnName: "booking_date" },
    { label: "開始時間", columnName: "start_time" },
    { label: "完結時間", columnName: "end_time" },
    { label: "價錢", columnName: "price" },
    { label: "用戶名稱", columnName: "user_name" },
    { label: "用戶留言", columnName: "remarks" },
  ];

  const columnHelper = createColumnHelper();

  const columns = columnHeadersArrayMap.map(({ label, columnName }) => {
    return columnHelper.accessor(
      (row) => {
        // transformational
        const value = row[columnName];
        if (columnName === "booking_date" && value instanceof Date) {
          return formatDate(new Date(value));
        }

        if (columnName === "start_time" || columnName === "end_time") {
          return convertTimeToString(value);
        }

        return value;
      },
      {
        id: columnName,
        header: ({ column }) => {
          return (
            <Button variant="ghost" className="pl-1 w-full flex justify-between" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
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
          if (columnName === "price") {
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
    <div className="mt-6 flex flex-col gap-4">
      <div>
        <div className="hidden xl:flex flex-wrap gap-4 mb-4">
          {table.getFlatHeaders().map((header) =>
            header.column.getCanFilter() ? (
              <div key={header.id} className="flex flex-col">
                <label className="text-sm font-medium">{columnHeadersArrayMap.find((col) => col.columnName === header.id)?.label || "篩選"}</label>
                <Filter column={header.column} />
              </div>
            ) : null
          )}
        </div>
        <div className="flex justify-end xl:hidden mb-2">
          <Dialog>
            <DialogTrigger className="text-primary font-bold">篩選</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
              </DialogHeader>
              {table.getFlatHeaders().map((header) =>
                header.column.getCanFilter() ? (
                  <div key={header.id} className="flex flex-col">
                    <label className="text-sm font-medium">{columnHeadersArrayMap.find((col) => col.columnName === header.id)?.label || "篩選"}</label>
                    <Filter column={header.column} />
                  </div>
                ) : null
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => table.resetSorting()}>
            重設排序
          </Button>
          <Button variant="outline" onClick={() => table.resetColumnFilters()}>
            重設篩選
          </Button>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={`p-2 ${["remarks", "user_name"].includes(header.id) ? "hidden md:table-cell" : ""}`}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  console.log(row.original);
                  setSelectedBooking(row.original as StudioBookingRecord);
                  setOpenDetailModal(true);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={`${["remarks", "user_name"].includes(cell.column.id) ? "hidden md:table-cell" : ""}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex basis-1/3 items-center">
          <p className="whitespace-nowrap font-bold">
            {`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${table.getFilteredRowModel().rows.length !== 1 ? "total results" : "result"}]`}
          </p>
        </div>
        <div className="space-x-1">
          <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft /> 上一頁
          </Button>
          <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight />
            <span className="hidden md:block">下一頁</span>
          </Button>
        </div>
      </div>

      {selectedBooking && openDetailModal && <BookingDetailsModal isOpen={openDetailModal} setOpenModal={setOpenDetailModal} bookingRecord={selectedBooking as StudioBookingRecord} role="studio" />}
    </div>
  );
}
