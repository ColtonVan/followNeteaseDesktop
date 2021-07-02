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
        instance.interceptors.request.use(
            config => {
                let ignoreLoadingUrls = ["/login/qr/check", "/search/hot/detail", "/search/suggest"];
                if (!ignoreLoadingUrls.includes(config.url)) {
                    store.commit("changeIsLoading", true);
                }
                return config;
            },
            error => Promise.reject(error)
        );
        instance.interceptors.response.use(
            response => {
                store.commit("changeIsLoading", false);
                return response.data as AxiosResponse<AxiosResponseProps>;
            },
            error => {
                store.commit("changeIsLoading", false);
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
