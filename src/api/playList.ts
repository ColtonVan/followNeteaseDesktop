import axiosIns from "@/utils/request";
export const getPlayListDetailApi = params => {
    return axiosIns.get("/playlist/detail", { params });
};
export const getSimilarPlayListApi = params => {
    return axiosIns.get("/simi/playlist", { params });
};