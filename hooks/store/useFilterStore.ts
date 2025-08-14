import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const state = {
  globalFilter: "",
  filteredStatusValue: "",
  userRegistrationStatusValue: "",
  pendingValidationValue: "",
  approvalFilterValue: "",
  ninFilterValidationValue: "",
  userFilterValue: "",
  institutionId: "",
  filterby: "",
  sortBy: "", // Add this
  sortOrder: "asc", // Add this with default value
  dateRange: undefined as DateRange | undefined,
};

interface action {
  globalFilter: string;
  filteredStatusValue: string;
  userRegistrationStatusValue: string;
  pendingValidationValue: string;
  approvalFilterValue: string;
  ninFilterValidationValue: string;
  userFilterValue: string;
  institutionId: string;
  filterby: string;
  sortBy: string;
  sortOrder: string;
  dateRange: DateRange | undefined;
}

interface FilterActions {
  setGlobalFilter: (value: string) => void;
  setFilteredStatusValue: (value: string) => void;
  setUserRegistrationStatusValue: (value: string) => void;
  setPendingValidationValue: (value: string) => void;
  setNinFilterValidationValue: (value: string) => void;
  setApprovalFilterValue: (value: string) => void;
  setUserFilterValue: (value: string) => void;
  setDateRange: (value: DateRange | undefined) => void;
  setInstitutionId: (value: string) => void;
  setFilterby: (value: string) => void;
  setSortBy: (value: string) => void;
  setSortOrder: (value: string) => void;
  resetTableFilter: () => void;
}

type FilterStore = action & FilterActions;

const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      ...state,
      setGlobalFilter: (value) => set({ globalFilter: value }),
      setFilteredStatusValue: (value) => set({ filteredStatusValue: value }),
      setUserRegistrationStatusValue: (value) =>
        set({ userRegistrationStatusValue: value }),
      setPendingValidationValue: (value) =>
        set({ pendingValidationValue: value }),
      setNinFilterValidationValue: (value) =>
        set({ ninFilterValidationValue: value }),
      setApprovalFilterValue: (value) => set({ approvalFilterValue: value }),
      setDateRange: (value) => set({ dateRange: value }),
      setUserFilterValue: (value) => set({ userFilterValue: value }),
      setInstitutionId: (value) => set({ institutionId: value }),
      setFilterby: (value) => set({ filterby: value }),
      setSortBy: (value) => set({ sortBy: value }),
      setSortOrder: (value) => set({ sortOrder: value }),
      resetTableFilter: () => set({ ...state }),
    }),
    {
      name: "dash_table_filter",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useFilterStore;
