import axiosInstance from "@/utils/request";
export const getSongUrlApi = params => {
    return axiosInstance.get("/song/url", { params });
};
export const checkMusicApi = params => {
    return axiosInstance.get("/check/music", { params });
};