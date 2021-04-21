import { AxiosResponse } from 'axios';
import axiosInstance, { AxiosResponseProps } from "@/utils/request";
const { request, get, post } = axiosInstance;
export const getBanners = (params?: { type?: number }) => {
    return get("/banner", { params: params || {} })
}