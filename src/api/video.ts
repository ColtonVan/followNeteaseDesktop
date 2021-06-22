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
export const getAllGroupVideoApi = params => {
    return axiosIns.get("/video/timeline/all", { params: { ...params, t: Date.now() } });
};
export const getRecommendVideoApi = (params?: any) => {
    return axiosIns.get("/video/timeline/recommend", { params: { ...params, t: Date.now() } });
};
export const getVideoDetailApi = params => {
    return axiosIns.get("/video/detail", { params: { ...params, timeStamp: Date.now() } });
};
export const getVideoUrlApi = params => {
    return axiosIns.get("/video/url", { params });
};
export const getLikedMVApi = () => {
    return axiosIns.get("/playlist/mylike", { params: { timeStamp: Date.now() } });
};
export const likeMVApi = params => {
    // @param type
    // 1:  mv
    // 4: 电台
    // 5: 视频
    // 6: 动态
    // @param t
    // t: 操作,1 为点赞,其他未取消点赞
    return axiosIns.get("/resource/like", { params: { ...params, timeStamp: Date.now(), type: 5 } });
};
export const getCollectedMVApi = () => {
    return axiosIns.get("/mv/sublist", { params: { timeStamp: Date.now() } });
};
export const collectMVApi = params => {
    // mvid : MV id
    // t : 1 为收藏,其他为取消收藏
    return axiosIns.get("/mv/sub", { params: { timeStamp: Date.now(), ...params } });
};
export const collectVideoApi = params => {
    // mvid : 视频 id
    // t : 1 为收藏,其他为取消收藏
    return axiosIns.get("/video/sub", { params: { timeStamp: Date.now(), ...params } });
};
//获取视频点赞转发评论数数据
export const getVideoDetailInfoApi = (params: { vid: string | number }) => {
    return axiosIns.get("/video/detail/info", { params: { timeStamp: Date.now(), ...params } });
};
//分享资源
// 必选参数 : id : 资源 id （歌曲，歌单，mv，电台，电台节目对应 id）
// 可选参数 : type: 资源类型，默认歌曲 song，可传 song,playlist,mv,djradio,djprogram
//            msg: 内容，140 字限制，支持 emoji，@用户名（/user/follows接口获取的用户名，用户名后和内容应该有空格），图片暂不支持
export const shareResourceApi = (params: { id: string | number; type: string }) => {
    return axiosIns.get("/share/resource", { params: { timeStamp: Date.now(), ...params } });
};
