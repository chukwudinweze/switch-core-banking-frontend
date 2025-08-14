import Configs from "@/lib/configs";
import useSwrHook from "@/lib/services/useSwrHook";

export function useFetchTableData<T>(url: string) {
  const { response, error, isLoading, mutate } = useSwrHook<T>(
    {
      url,
      method: "GET",
      headers: {
        ...Configs.getAuthorization(),
      },
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const data = response?.data.data || [];

  return {
    data,
    error,
    isLoading,
    response,
    mutate,
  };
}
