import { PageMeta } from "@/lib/types/responseTypes";
import usePaginationStore from "../store/UsePagenationStore";

export const usePaginationControls = (
  pageMeta: PageMeta,
  setPageNumber: (n: number) => void
) => {
  const pageNumber = usePaginationStore((state) => state.pageNumber);

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < pageMeta.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const fetchedRecords = Math.min(
    pageMeta.pageNumber * pageMeta.pageSize,
    pageMeta.totalRecords
  );

  return { handlePreviousPage, handleNextPage, fetchedRecords };
};
