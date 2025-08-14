"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LiaDownloadSolid } from "react-icons/lia";

interface TableActionsProps {
  createData?: React.ReactNode;
  isExportable?: boolean;
  btnTheme?: "outline" | "default";
  downloadData: () => void;
  className?: string;
}

export function TableActions({
  createData,
  isExportable = false,
  btnTheme = "default",
  downloadData,
  className,
}: TableActionsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:flex items-center gap-2 md:gap-6 overflow-x-auto thin-scrollbar w-full lg:w-fit",
        className
      )}
    >
      {createData && <div className="w-full">{createData}</div>}
      {isExportable && (
        <div className="w-full p-2">
          <Button
            onClick={downloadData}
            variant={btnTheme === "outline" ? "outline" : "default"}
            className="rounded-[10px] text-nowrap w-full"
          >
            <LiaDownloadSolid
              className={cn(
                btnTheme === "outline" ? "text-pretty" : "text-white"
              )}
            />
            <span
              className={cn(
                btnTheme === "outline" ? "text-pretty" : "text-white"
              )}
            >
              Export Data
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
