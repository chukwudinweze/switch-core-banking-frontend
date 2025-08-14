import { apiDownloadData } from "@/lib/services/bankingServices";
import { DateRange } from "react-day-picker";

export const useDownloadData = ({
  url,
  exportUrl,
}: {
  pageNumber: number;
  pageSize: number;
  dateRange?: DateRange;
  debouncedGlobalFilter?: string;
  url: string;
  exportUrl?: string;
}) => {
  return () => {
    const parsedUrl = new URL(url);
    apiDownloadData({ exportUrl, query: parsedUrl.search });
  };
};
