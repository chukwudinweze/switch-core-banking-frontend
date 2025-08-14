"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn, formatDateItem } from "@/lib/utils";
import { DriversColumnAction } from "./drivers-column-action";
import dayjs from "dayjs";
import { Transaction } from "@/lib/types/bankingTypes";
import NairaSymbol from "@/components/naira-symbol";

export const TransactionHistoryColumn: ColumnDef<Transaction>[] = [
  {
    header: "S/N.",
    cell: ({ row, table }) => {
      //@ts-ignore
      const currentPage = table.options.meta?.currentPage || 1;
      //@ts-ignore
      const pageSize = table.options.meta?.pageSize || 12;
      return (currentPage - 1) * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: "id",
    header: "Transaction ID",
  },
  {
    accessorKey: "date",
    header: "Transaction date",
    cell: ({ row }) => {
      return <p>{formatDateItem(row.original.date)}</p>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Category",
    cell: ({ row }) => {
      return (
        <p
          className={cn(
            row.original.type === "Debit" ? "text-red-500" : "text-green-500"
          )}
        >
          <NairaSymbol />
          {row.original.amount.toLocaleString()}
        </p>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "beneficiaryAccount",
    header: "Beneficiary Account",
  },
  {
    accessorKey: "beneficiaryName",
    header: "Beneficiary Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "balanceAfter",
    header: "Balance after transaction",
    cell: ({ row }) => {
      return (
        <p>
          <NairaSymbol />
          {row.original.balanceAfter.toLocaleString()}
        </p>
      );
    },
  },

  {
    accessorKey: "reference",
    header: "Reference",
  },
];
