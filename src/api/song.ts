import axiosInstance from "@/utils/request";
export const getSongUrlApi = params => {
    return axiosInstance.get("/song/url", { params })
}