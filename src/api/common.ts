import axiosIns from "@/utils/request";

export const followUserApi = (params?: { id: string | number; t: number }) => {
    //t : 1为关注,其他为取消关注
    return axiosIns.get("/follow", { params: { ...params, timeStamp: Date.now() } });
};
