import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import apiService from "./ApiService";
import { PageMeta } from "../types/responseTypes";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Configs from "../configs";

export type GetRequest = AxiosRequestConfig | null;

interface ApiResponse<Data> {
  succeeded: boolean;
  code: number;
  message: string;
  data: Data;
  pageMeta: PageMeta | null;
  errors: null;
}

interface Return<Data, Error>
  extends Pick<
    SWRResponse<AxiosResponse<ApiResponse<Data>>, AxiosError<Error>>,
    "isValidating" | "error" | "mutate"
  > {
  data: Data | undefined;
  response: AxiosResponse<ApiResponse<Data>> | undefined;
  isLoading: boolean;
}

export interface Config<Data = unknown, Error = unknown>
  extends Omit<
    SWRConfiguration<AxiosResponse<ApiResponse<Data>>, AxiosError<Error>>,
    "fallbackData"
  > {
  fallbackData?: Data;
}

export default function useSwrHook<Data = unknown, Error = unknown>(
  request: GetRequest,
  { fallbackData, ...config }: Config<Data, Error> = {}
): Return<Data, Error> {
  const router = useRouter();

  const {
    data: response,
    error,
    isValidating,
    isLoading,
    mutate,
  } = useSWR<AxiosResponse<ApiResponse<Data>>, AxiosError<Error>>(
    request,
    () => {
      const token = sessionStorage.getItem(Configs.authToken);
      const headers = token
        ? { ...request!.headers, Authorization: `Bearer ${token}` }
        : request!.headers;

      return apiService.request<ApiResponse<Data>>({
        ...request!,
        headers,
      });
    },
    {
      ...config,
      fallbackData:
        fallbackData &&
        ({
          status: 200,
          statusText: "InitialData",
          config: request!,
          headers: {},
          data: {
            succeeded: true,
            code: 200,
            message: "",
            data: fallbackData,
            pageMeta: null,
            errors: null,
          },
        } as unknown as AxiosResponse<ApiResponse<Data>>),
    }
  );

  if (error?.response?.status === 401) {
    sessionStorage.removeItem(Configs.authToken);
    toast({
      variant: "destructive",
      title: "Session expired",
    });
    router.push("/auth/login");
  }

  return {
    data: response && response.data.data,
    response,
    error,
    isValidating,
    isLoading,
    mutate,
  };
}
