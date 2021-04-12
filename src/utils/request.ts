import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
const axiosIns: AxiosInstance = axios.create({
    baseURL: process.env.VUE_APP_baseURL,
    withCredentials: true
} as AxiosRequestConfig);
axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
    return config;
})
axiosIns.interceptors.response.use((resoponse: any) => {
    return resoponse.data;
})
export default axiosIns;
// axiosIns.get("/login/cellphone", { params: { phone: "17607101164", md5_password: "53270e9ed6bb6eb64b1024d6f4227bcf" } })