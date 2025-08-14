"use client";

import { MdOutlineArrowBack } from "react-icons/md";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dashedDateItem } from "@/lib/utils";

export type FilterType =
  | "allTime"
  | "today"
  | "month"
  | "dateRange"
  | "thismonth"
  | "dateRange";
interface FilterContentProps {
  onSelectFilter: (filter: FilterType) => void;
  onSelectDateRange: (
    startDate: Date | string | null,
    endDate: Date | string | null
  ) => void;
  closePopover: () => void;
}

const FilterContent = ({
  onSelectFilter,
  onSelectDateRange,
  closePopover,
}: FilterContentProps) => {
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSetFilter = (filter: FilterType) => {
    onSelectFilter(filter);
    closePopover();
  };

  const handleDateRange = () => {
    if (startDate && endDate) {
      onSelectDateRange(dashedDateItem(startDate), dashedDateItem(endDate));
      closePopover();
    }
  };

  return (
    <div className="grid gap-4">
      {!isTimeRangeOpen ? (
        <div className="flex flex-col gap-2">
          <h4 className="text-primaryBlack text-[0.625rem] font-medium">
            Filter By:
          </h4>
          <button
            onClick={() => handleSetFilter("allTime")}
            className="w-full flex justify-start text-sm hover:text-primaryBlue"
          >
            All time
          </button>
          <button
            onClick={() => handleSetFilter("today")}
            className="w-full flex justify-start text-sm hover:text-primaryBlue"
          >
            Today
          </button>
          <button
            onClick={() => handleSetFilter("month")}
            className="w-full flex justify-start text-sm hover:text-primaryBlue"
          >
            This Month
          </button>
          <button
            onClick={() => setIsTimeRangeOpen(true)}
            className="w-full flex justify-start text-sm hover:text-primaryBlue"
          >
            Select Time Range
          </button>
        </div>
      ) : (
        <div className="grid gap-2">
          <button onClick={() => setIsTimeRangeOpen(false)}>
            <MdOutlineArrowBack />
          </button>
          <div>
            <div className="flex flex-col gap-6">
              <div>
                <p>From</p>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  placeholderText="dd/mm/yy"
                  className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-0 placeholder-gray-400"
                />
              </div>
              <div>
                <p>To</p>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  placeholderText="dd/mm/yy"
                  minDate={startDate || undefined}
                  className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-0 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-center">
              <Button
                onClick={() => {
                  handleSetFilter("dateRange");
                  handleDateRange();
                }}
                className="mt-[11px] w-[60%] rounded-xl"
              >
                Filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterContent;
