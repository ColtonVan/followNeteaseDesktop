import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
const axiosIns: AxiosInstance = axios.create({
    baseURL: process.env.baseURL,
    withCredentials: true
} as AxiosRequestConfig);

axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
    return config;
})
axiosIns.interceptors.response.use((resoponse: any) => {
    return resoponse.data;
})
export default axiosIns;