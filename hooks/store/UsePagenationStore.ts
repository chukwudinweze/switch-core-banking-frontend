import { create } from "zustand";

interface Pagenation {
  pageNumber: number;
  role?: number;
  setPageNumber: (pageNumber: number) => void;
  resetPageNumber: () => void;
  setRole: (role: number) => void;
}

const usePaginationStore = create<Pagenation>((set) => ({
  pageNumber: 1,
  role: 1,
  setPageNumber: (pageNumber) => set({ pageNumber }),
  resetPageNumber: () => set({ pageNumber: 1 }),

  setRole: (role) => set({ role }),
}));

export default usePaginationStore;
