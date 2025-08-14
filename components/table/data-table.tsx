"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LiaDownloadSolid } from "react-icons/lia";
import { useFetchTableData } from "@/hooks/fetchers/useFetchTableData";
import usePaginationStore from "@/hooks/store/UsePagenationStore";
import { usePaginationControls } from "@/hooks/custom-hook/useTablePaginationControls";
import { useDownloadData } from "@/hooks/custom-hook/useDownloadTableData";
import { useTableInstance } from "@/hooks/custom-hook/useTableInstance";
import { Filter } from "./filter";
import { TableActions } from "./table-action";
import useFilterStore from "@/hooks/store/useFilterStore";
import { UseQueryParams } from "@/hooks/custom-hook/UseQueryParams";
import { getSession } from "@/lib/actions/get-session";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  emptyTableText: string;
  className?: string;
  filterPlaceholder: string;
  filterOptions?: { label: string; value: string | number }[];
  statusToFilter?: keyof TData;
  statusfilterLabel?: string;
  statusFilterPlaceholder?: string;
  isExportable?: boolean;
  dateFilterPlaceholder?: string;
  createData?: React.ReactNode;
  btnTheme?: "outline" | "default";
  noDateFilter?: boolean;
  noGlobalSearch?: boolean;
  noSorting?: boolean; // NEW
  role?: number;
  userId?: string;
  searchQueryLabel?: string;
  exportUrl?: string;
  pendingValidationOptions?: { label: string; value: string | number }[];
  isNinFilterOptions?: { label: string; value: string | number }[];
  isUserApprovedFilterOptions?: { label: string; value: string | number }[];
  userRegistrationStatus?: { label: string; value: string | number }[];
  userValidationStatus?: { label: string; value: string | number }[];
  userFilterOptions?: { label: string; value: string | number }[];
  userFilterLabel?: string; // NEW: label for userFilterValue param
  sortOptions?: { label: string; value: string | number }[]; // NEW
  categoryOptions?: { label: string; value: string | number }[]; // NEW
  isUser?: boolean;
  endpoint: string;
}

export function DataTable<TData, TValue>({
  columns,
  emptyTableText,
  className,
  filterPlaceholder,
  filterOptions,
  isExportable = false,
  dateFilterPlaceholder,
  createData,
  btnTheme,
  noDateFilter,
  noGlobalSearch,
  noSorting, // NEW
  role,
  exportUrl,
  searchQueryLabel,
  userFilterOptions,
  userFilterLabel, // NEW
  sortOptions, // NEW
  endpoint,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  const session = getSession();
  if (!session) {
    router.replace("/");
  }

  const [url, setUrl] = useState<string>("");
  const pageNumber = usePaginationStore((state) => state.pageNumber);
  const setPageNumber = usePaginationStore((state) => state.setPageNumber);
  const setRole = usePaginationStore((state) => state.setRole);
  const pageSize = 12;
  const tableFilter = useFilterStore((state) => state);

  //url and query params
  const { requestUrl, debouncedGlobalFilter } = UseQueryParams({
    endpoint,
    globalFilter: tableFilter.globalFilter,
    dateRange: tableFilter.dateRange,
    pageSize,
    userFilterValue: tableFilter.userFilterValue,
    userFilterLabel,
    searchQueryLabel,
    sortBy: tableFilter.sortBy,
    sortOrder: tableFilter.sortOrder,
  });

  useEffect(() => {
    setPageNumber(pageNumber);
  }, [pageNumber, setPageNumber]);

  // Please don't touch this below
  useEffect(() => {
    setUrl(requestUrl);
  }, [requestUrl]);

  // Fetch data with the updated URL
  const { data, isLoading, error, response } =
    useFetchTableData<TData[]>(requestUrl);

  //page  --meta
  const pageMeta = response?.data?.pageMeta || {
    pageNumber: 1,
    pageSize: 12,
    totalPages: 1,
    totalRecords: 0,
  };

  const table = useTableInstance<TData>({
    data: data as TData[],
    columns,
    pageMeta,
  });

  // Pagination
  const { handleNextPage, handlePreviousPage, fetchedRecords } =
    usePaginationControls(pageMeta, setPageNumber);

  // Download table data
  const downloadData = useDownloadData({
    pageNumber,
    pageSize,
    dateRange: tableFilter.dateRange,
    debouncedGlobalFilter,
    url,
    exportUrl,
  });

  return (
    <>
      <div className="flex w-full flex-col lg:flex-row items-center gap-4">
        <div className="w-full flex-1">
          <Filter
            filterPlaceholder={filterPlaceholder}
            dateFilterPlaceholder={dateFilterPlaceholder}
            noDateFilter={noDateFilter}
            noGlobalSearch={noGlobalSearch}
            noSorting={noSorting}
            filterOptions={filterOptions}
            userFilterOptions={userFilterOptions}
            sortOptions={sortOptions}
          />
        </div>
        <TableActions
          createData={createData}
          isExportable={isExportable}
          btnTheme={btnTheme}
          downloadData={downloadData}
        />
      </div>

      {isLoading ? (
        <div className="skeleton-loader">
          <Table className="compact">
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>
                    <div className="bg-gray-300 w-24 h-6 animate-pulse"></div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, index) => (
                    <TableCell key={index}>
                      <div className="bg-gray-200 w-24 h-6 animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : table.getRowModel().rows?.length ? (
        <>
          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-t-xl bg-white shadow-sm">
              <Table className="compact">
                <TableHeader
                  className={cn(
                    "text-sm text-left font-medium bg-primaryPurple bg-opacity-[0.05] rounded-t-xl",
                    className
                  )}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <TableHead
                          className={cn(
                            "text-white text-center bg-primaryBlue text-nowrap",
                            index !== headerGroup.headers.length - 1 &&
                              "border-r-[1.5px] border-gray-300"
                          )}
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="shadow-sm border border-[#D9D9D9]">
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="bg-white">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="text-center text-[#3A3A3A] md:min-w-[200px] md:py-5 md:pr-5"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex justify-between items-center pt-6 pb-3">
            <div className="hidden md:flex text-sm text-gray-600 mb-0 md:mb-4">
              {`Showing ${fetchedRecords} of ${pageMeta.totalRecords} records`}
            </div>
            <div className="flex md:hidden text-sm text-gray-600 mb-0 md:mb-4">
              {`${fetchedRecords} of ${pageMeta.totalRecords} records`}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                onClick={handlePreviousPage}
                disabled={pageNumber === 1}
                className="bg-white text-black"
              >
                <MdOutlineChevronLeft />
                Prev
              </Button>
              {response?.data.pageMeta && (
                <span>
                  {response?.data?.pageMeta.pageNumber}/
                  {response?.data?.pageMeta.totalPages}
                </span>
              )}
              <Button
                variant="ghost"
                onClick={handleNextPage}
                disabled={pageNumber === pageMeta.totalPages}
                className="bg-white text-black"
              >
                Next
                <MdOutlineChevronRight />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 rounded-[15px] bg-white mb-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m0 0a3 3 0 006 0v2m-6-2a3 3 0 100-6 3 3 0 000 6zm-7-2a9 9 0 1118 0A9 9 0 012 15z"
            />
          </svg>
          <p className="text-gray-600 text-sm mb-6">
            {response?.data?.message ?? emptyTableText}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="px-8 py-2 rounded-[12px]"
          >
            Refresh
          </Button>
        </div>
      )}
    </>
  );
}
