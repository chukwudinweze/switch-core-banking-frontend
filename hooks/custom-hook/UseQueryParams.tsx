import { useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { hyphenformatDateItem } from "@/lib/utils";
import usePaginationStore from "../store/UsePagenationStore";
import Configs from "@/lib/configs";

interface UseQueryParams {
  endpoint: string;
  filterBy?: string;
  sortBy?: string;
  sortOrder?: string;
  statusFilter?: string;
  globalFilter?: string;
  dateRange?: { from?: Date; to?: Date };
  pageSize?: number;
  statusfilterLabel?: string;
  searchQueryLabel?: string;
  pendingValidationFilter?: string;
  ninFilterValidationValue?: string;
  approvalFilterValue?: string;
  userRegistrationStatusValue?: string;
  userFilterValue?: string;
  userFilterLabel?: string; // NEW: label for userFilterValue param (e.g., "category")
  isUser?: boolean | undefined;
  institutiionId?: string;
}

export const UseQueryParams = ({
  endpoint,
  statusFilter,
  globalFilter,
  dateRange,
  pageSize = 12,
  statusfilterLabel,
  searchQueryLabel,
  pendingValidationFilter,
  approvalFilterValue,
  ninFilterValidationValue,
  userRegistrationStatusValue,
  userFilterValue,
  userFilterLabel, // NEW
  institutiionId,
  filterBy,
  sortBy,
  sortOrder,
}: UseQueryParams) => {
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 300);

  const pageNumber = usePaginationStore((state) => state.pageNumber);
  const resetPageNumber = usePaginationStore((state) => state.resetPageNumber);

  // Reset page number when any filter changes
  useEffect(() => {
    resetPageNumber();
  }, [
    statusFilter,
    debouncedGlobalFilter,
    dateRange?.from,
    dateRange?.to,
    sortBy, // NEW
    sortOrder, // NEW
    resetPageNumber,
  ]);

  const requestUrl = useMemo(() => {
    const url = new URL(`${Configs.baseUrl}/${endpoint}`);

    if (filterBy) {
      url.searchParams.append("FilterBy", filterBy);
    }

    if (statusFilter) {
      url.searchParams.append(statusfilterLabel ?? "status", statusFilter);
    }

    if (userFilterValue) {
      url.searchParams.append(
        userFilterLabel || "ValidationState",
        userFilterValue
      );
    }

    if (debouncedGlobalFilter) {
      url.searchParams.append(
        searchQueryLabel || "Query",
        debouncedGlobalFilter.trim()
      );
    }

    if (dateRange?.from) {
      url.searchParams.append(
        "StartDate",
        hyphenformatDateItem(dateRange.from)
      );
    }

    if (dateRange?.to) {
      url.searchParams.append("EndDate", hyphenformatDateItem(dateRange.to));
    }

    if (sortBy) {
      url.searchParams.append("SortBy", sortBy);
    }

    if (sortOrder) {
      url.searchParams.append("SortOrder", sortOrder);
    }

    url.searchParams.append("PageSize", pageSize.toString());
    url.searchParams.append("PageNumber", pageNumber.toString());

    return url.toString();
  }, [
    endpoint,
    statusFilter,
    debouncedGlobalFilter,
    dateRange,
    pageNumber,
    pageSize,
    statusfilterLabel,
    searchQueryLabel,
    pendingValidationFilter,
    approvalFilterValue,
    ninFilterValidationValue,
    userRegistrationStatusValue,
    userFilterValue,
    userFilterLabel, // NEW
    institutiionId,
    filterBy,
    sortBy,
    sortOrder,
  ]);

  return {
    requestUrl,
    debouncedGlobalFilter,
  };
};
