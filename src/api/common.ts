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
// limit: 取出评论数量 , 默认为 20

// offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
export const getHotTopicApi = (params: { limit: number; offset: number } = { limit: 5, offset: -1 }) => {
    return axiosIns.get("/hot/topic", { params });
};
