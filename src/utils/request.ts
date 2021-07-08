import store from "@/store/index";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from "axios";
export interface AxiosResponseProps {
      code?: number;
      status?: number;
      data?: any;
      datas?: any;
      msg?: string | null;
}
class HttpRequest {
      private readonly baseURL: string;
      private readonly withCredentials: boolean;
      private readonly timeout: number;
      constructor() {
            this.baseURL = process.env.VUE_APP_baseURL;
            this.withCredentials = true;
            this.timeout = 1000 * 60;
      }
      getInitConfig(): AxiosRequestConfig {
            return {
                  baseURL: this.baseURL,
                  withCredentials: this.withCredentials,
                  timeout: this.timeout,
            };
      }
      interceptors(instance: AxiosInstance) {
            let requestList = [];
            const setLoadingToFalse = (response) => {
                  requestList.filter(item => item.url == response.config.url && item.method == response.config.method).forEach(
                        item => (item.isLoading = false)
                  );
                  //所有请求都加载完才让加载提示消失
                  if (requestList.every(item => !item.isLoading)) store.commit("changeIsLoading", false);
            };
            instance.interceptors.request.use(
                  config => {
                        let ignoreLoadingUrls = ["/login/qr/check", "/search/hot/detail", "/search/suggest"];
                        if (!ignoreLoadingUrls.includes(config.url)) {
                              if (requestList.length < 10) {
                                    requestList.unshift({ ...config, isLoading: true });
                              } else {
                                    requestList = [...requestList.slice(0, 9), { ...config, isLoading: true }];
                              }
                              store.commit("changeIsLoading", true);
                        }
                        return config;
                  },
                  error => Promise.reject(error)
            );
            instance.interceptors.response.use(
                  response => {
                        setLoadingToFalse(response);
                        return response.data as AxiosResponse<AxiosResponseProps>;
                  },
                  error => {
                        setLoadingToFalse(error);
                        Promise.reject(error);
                  }
            );
      }
      request(): AxiosInstance {
            const instance = axios.create(this.getInitConfig());
            this.interceptors(instance);
            return instance;
      }
}
const http = new HttpRequest();
export default http.request();