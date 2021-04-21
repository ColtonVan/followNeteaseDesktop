import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
export interface AxiosResponseProps {
    code?: number;
    data?: any;
    // banners?: any[];
}
const axiosIns: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_baseURL,
    withCredentials: true
} as AxiosRequestConfig);
axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
    return config;
})
axiosIns.interceptors.response.use((resoponse: AxiosResponse<AxiosResponseProps>) => {
    return resoponse.data as AxiosResponse;
})
export default axiosIns;
// axiosIns.get("/login/cellphone", { params: { phone: "17607101164", md5_password: "53270e9ed6bb6eb64b1024d6f4227bcf" } })
// --------------------------------------------------------
