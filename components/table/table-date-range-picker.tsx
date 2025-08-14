"use client";

import * as React from "react";
import { format } from "date-fns";
import { MdCalendarMonth } from "react-icons/md";
import { DateRange } from "react-day-picker";
import { IoClose } from "react-icons/io5"; // Add a clear (close) icon
import { IoFilter } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define the props interface
interface TableDateRangePickerProps {
  className?: string;
  label: string;
  isNotFilter?: boolean; // Optional prop to indicate if it's not a filter
  onDateChange: (range: DateRange | undefined) => void;
}

export function TableDateRangePicker({
  className,
  label,
  onDateChange,
  isNotFilter,
}: TableDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const handleDateChange = (range: DateRange | undefined) => {
    setDate(range);
    onDateChange(range);
  };

  const clearDate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents opening the calendar when clicking clear
    setDate(undefined);
    onDateChange(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            id="date"
            className={cn(
              "w-full flex items-center justify-between bg-white text-sm text-[rgba(58,58,58,0.6)] rounded-[10px] ring-0 border border-[#E7E7E7] outline-none py-2.5 pl-3 pr-2 truncate relative",
              className
            )}
          >
            <div className="flex items-center truncate">
              {!isNotFilter && (
                <div className="flex items-center mr-1">
                  <div className="text-primaryBlue flex items-center gap-1">
                    <IoFilter className="text-sm text-primaryBlue" />
                    Date
                  </div>
                  :
                </div>
              )}

              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>{label}</span>
              )}
            </div>
            <div>
              {date && (
                <button
                  onClick={clearDate}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 transition"
                  type="button"
                >
                  <IoClose className="text-lg text-gray-500" />
                </button>
              )}
              {!date && isNotFilter && (
                <MdCalendarMonth className="ml-2 text-lg text-gray-500" />
              )}
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
