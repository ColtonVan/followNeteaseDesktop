import store from "@/store/index";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
export interface AxiosResponseProps {
    code?: number;
    status?: number;
    data?: any;
}
const axiosIns: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_baseURL,
    withCredentials: true,
} as AxiosRequestConfig);
axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
    let ignoreLoadingUrls = ["/login/qr/check"];
    if (!ignoreLoadingUrls.includes(config.url)) {
        store.commit("changeIsLoading", true);
    }
    // if (config.method === "get") {
    //     if (Object.prototype.toString.call(config.params) === "[object Object]") {
    //         if (!config.params.timeStamp) {
    //             config.params.timeStamp = Date.now();
    //         }
    //     } else {
    //         config.params = { timeStamp: Date.now() };
    //     }
    // }
    return config;
});
axiosIns.interceptors.response.use(
    (resoponse: AxiosResponse<AxiosResponseProps>) => {
        store.commit("changeIsLoading", false);
        return resoponse.data as AxiosResponse<AxiosResponseProps>;
    },
    err => {
        return Promise.reject(err);
    }
);
export default axiosIns;
