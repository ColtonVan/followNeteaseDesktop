import axiosInstance from "@/utils/request";
export const getSongUrlApi = params => {
    return axiosInstance.get("/song/url", { params });
};
export const checkMusicApi = params => {
    return axiosInstance.get("/check/music", { params });
};
export const getSongDetailApi = (ids: string | number[] | string[]) => {
    console.log(ids);
    return axiosInstance.get("/song/detail", { params: { ids: ids instanceof Array ? ids.toString() : ids,t:Date.now() } });
};
export const getSongLyricApi = params => {
    return axiosInstance.get("/lyric", { params });
};