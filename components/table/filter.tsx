"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableDateRangePicker } from "./table-date-range-picker";
import { CiSearch } from "react-icons/ci";
import useFilterStore from "@/hooks/store/useFilterStore";

interface FilterOption {
  label: string;
  value: string | number;
}

interface FilterProps {
  filterPlaceholder?: string;
  dateFilterPlaceholder?: string;
  statusFilterPlaceholder?: string;
  noDateFilter?: boolean;
  noGlobalSearch?: boolean;
  noSorting?: boolean; // Add this prop to optionally hide sorting
  filterOptions?: FilterOption[];
  pendingValidationOptions?: FilterOption[];
  isNinFilterOptions?: FilterOption[];
  isUserApprovedFilterOptions?: FilterOption[];
  userRegistrationStatus?: FilterOption[];
  userFilterOptions?: FilterOption[];
  className?: string;
  statusToFilter?: string;
  institutions?: FilterOption[];
  filterBy?: FilterOption[];
  sortOptions?: FilterOption[]; // Add this for configurable sorting
  customComponent?: React.ReactNode;
}

export function Filter({
  filterPlaceholder,
  dateFilterPlaceholder = "Pick a date",
  statusFilterPlaceholder,
  noDateFilter,
  noGlobalSearch,
  noSorting, // Add this prop
  filterOptions,
  pendingValidationOptions,
  isNinFilterOptions,
  isUserApprovedFilterOptions,
  userRegistrationStatus,
  userFilterOptions,
  className,
  statusToFilter,
  filterBy,
  sortOptions, // Add this prop
}: FilterProps) {
  const {
    globalFilter,
    setGlobalFilter,
    setDateRange,
    filteredStatusValue,
    setFilteredStatusValue,
    userFilterValue,
    setUserFilterValue,
    filterby,
    setFilterby,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useFilterStore();

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-4 md:flex-wrap",
        className
      )}
    >
      {/* Global Search - make it expand to fill available space */}
      {!noGlobalSearch && (
        <div className="relative flex-1">
          <input
            placeholder={filterPlaceholder}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="bg-white text-sm text-[rgba(58,58,58,0.6)] rounded-[10px] ring-0 outline-none py-3 pl-8 w-full"
          />
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      )}
      {/* Filter By Dropdown */}
      {filterBy && filterBy.length > 0 && (
        <div className="w-full md:w-40 lg:w-48 md:flex-shrink-0">
          <Select
            value={filterby}
            onValueChange={(value) => setFilterby(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full bg-white outline-none focus:ring-white border border-[#E7E7E7] text-sm text-[rgba(58,58,58,0.6)] py-3 rounded-[10px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              {filterBy.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {/* Date Range Filter - also make it flexible */}
      {!noDateFilter && (
        <div className="w-full md:w-auto md:flex-shrink-0">
          <TableDateRangePicker
            className="w-full border-none"
            onDateChange={setDateRange}
            label={dateFilterPlaceholder}
          />
        </div>
      )}

      {/* Sorting Controls - group them together */}
      {!noSorting && (
        <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 md:flex-shrink-0">
          {/* Sort By Field */}
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full md:w-40 lg:w-48 bg-white outline-none focus:ring-white border border-[#E7E7E7] text-sm text-[rgba(58,58,58,0.6)] py-3 rounded-[10px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions ? (
                sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="balance">Balance</SelectItem>
                  <SelectItem value="lasttransactiondate">
                    Last Transaction
                  </SelectItem>
                  <SelectItem value="accountname">Account Name</SelectItem>
                  <SelectItem value="accounttype">Account Type</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="accountnumber">Account Number</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value)}
          >
            <SelectTrigger className="w-full md:w-32 bg-white outline-none focus:ring-white border border-[#E7E7E7] text-sm text-[rgba(58,58,58,0.6)] py-3 rounded-[10px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* All other filters - make them consistent width */}
      {/* Status Filter */}
      {statusToFilter && filterOptions && filterOptions.length > 0 && (
        <div className="w-full md:w-40 lg:w-48 md:flex-shrink-0">
          <Select
            value={filteredStatusValue}
            onValueChange={(value) =>
              setFilteredStatusValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full bg-white outline-none focus:ring-white border border-[#E7E7E7] text-sm text-[rgba(58,58,58,0.6)] py-3 rounded-[10px]">
              <SelectValue placeholder={statusFilterPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Validation State Filter */}
      {userFilterOptions && userFilterOptions.length > 0 && (
        <div className="w-full md:w-auto">
          <Select
            value={userFilterValue}
            onValueChange={(value) =>
              setUserFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full md:w-40 lg:w-48 bg-white outline-none focus:ring-white border border-[#E7E7E7] text-sm text-[rgba(58,58,58,0.6)] py-3 rounded-[10px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              {userFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
