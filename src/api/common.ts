import axiosIns from "@/utils/request";

export const followUserApi = (params?: { id: string | number; t: number }) => {
    //t : 1为关注,其他为取消关注
    return axiosIns.get("/follow", { params: { ...params, timeStamp: Date.now() } });
};
export const getEventApi = (params: { pagesize: number; lasttime: number } = { pagesize: 20, lasttime: -1 }) => {
    //t : 1为关注,其他为取消关注
    return axiosIns.get("/event", { params: { ...params, timeStamp: Date.now() } });
};
