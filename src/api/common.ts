import axiosIns from "@/utils/request";

export const followUserApi = (params?: { id: string | number; t: number }) => {
    //t : 1为关注,其他为取消关注
    return axiosIns.get("/follow", { params: { ...params, timeStamp: Date.now() } });
};
export const getEventApi = (params: { pagesize: number; lasttime: number } = { pagesize: 20, lasttime: -1 }) => {
    //t : 1为关注,其他为取消关注
    return axiosIns.get("/event", { params: { ...params, timeStamp: Date.now() } });
};
export const getCountriesCodeListApi = () => {
    return axiosIns.get("/countries/code/list");
};
//心动模式/智能播放
//必选参数
//id : 歌曲 id
//pid : 歌单 id
//可选参数
//sid : 要开始播放的歌曲的 id
export const getIntelligenceListApi = (params: { id: number; pid: number; sid?: number }) => {
    return axiosIns.get("/playmode/intelligence/list", { params });
};
