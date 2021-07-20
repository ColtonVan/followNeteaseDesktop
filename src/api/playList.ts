import axiosIns from "@/utils/request";
export const getPlayListDetailApi = params => {
      return axiosIns.get("/playlist/detail", { params: { ...params, timeStamp: Date.now() } });
};
export const getSimilarPlayListApi = params => {
      return axiosIns.get("/simi/playlist", { params });
};
export const deletePlayList = (params: { id: number }) => {
      return axiosIns.post("/playlist/delete", { ...params, timeStamp: Date.now() });
};
// id:歌单id

// name:歌单名字

// desc:歌单描述

// tags:歌单tag ,多个用 `;` 隔开,只能用官方规定标签
export const updatePlayListApi = (params: { id: number | string; name: string; desc: string; tags: string }) => {
      return axiosIns.get("/playlist/update", { params: { ...params, timeStamp: Date.now() } });
};
// 必选参数 :
// id: 歌单id 3143833470

// 可选参数 :

// imgSize : 图片尺寸,默认为300

// imgX : 水平裁剪偏移,方形图片可不传,默认为0 imgY : 垂直裁剪偏移,方形图片可不传,默认为0
export const updatePlayListCoverApi = (data: FormData) => {
      return axiosIns.post("/playlist/cover/update?timeStamp="+Date.now(), data);
};
export const getHighqualityTagsApi = () => {
      return axiosIns.get("/playlist/highquality/tags", { params: { timeStamp: Date.now() } });
};
