import { AxiosRequestConfig, AxiosResponse } from "axios";
import baseService from "./BaseService";

const apiService = {
  request<T = any, D = any>(
    param: AxiosRequestConfig<D>
  ): Promise<AxiosResponse<T, any>> {
    return new Promise((resolve, reject) => {
      baseService(param)
        .then((response) => {
          resolve(response);
        })
        .catch((errors) => {
          reject(errors);
        });
    });
  },
};

export default apiService;
