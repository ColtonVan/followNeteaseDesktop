import axiosIns from "@/utils/request";
export const getPlayListDetailApi = params => {
    return axiosIns.get("/playlist/detail", { params });
};
