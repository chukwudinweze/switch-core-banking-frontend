import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

export const useTableInstance = <TData,>({
  data,
  columns,
  pageMeta,
}: {
  data: TData[];
  columns: any;
  pageMeta: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}) => {
  return useReactTable({
    data,
    columns,
    meta: {
      currentPage: pageMeta.pageNumber,
      pageSize: pageMeta.pageSize,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pageMeta.totalPages,
  });
};
