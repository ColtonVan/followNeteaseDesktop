import axiosIns from "@/utils/request";
export const getGroupListApi = () => {
    return axiosIns.get("/video/group/list");
};
export const getCategoryListApi = () => {
    return axiosIns.get("/video/category/list");
};
export const getGroupVideoApi = (params?: { id: number }) => {
    return axiosIns.get("/video/group", { params });
};
export const getAllGroupVideoApi = () => {
    return axiosIns.get("/video/timeline/all");
};
