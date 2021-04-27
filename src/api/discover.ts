import { AxiosResponse } from "axios";
import axiosInstance, { AxiosResponseProps } from "@/utils/request";
const { request, get, post } = axiosInstance;
interface ListParams {
    limit?: number;
    timeStamp?: number;
    t?: number;
}
export const getBanners = (params?: { type?: number }) => {
    return get("/banner", { params: params || {} });
};
export const getPersonalizedApi = (params?: ListParams) => {
    return get("/personalized", { params: params || {} });
};
export const getRecommendSongsApi = (params?: ListParams) => {
    return get("/recommend/songs", { params: params || {} });
};
export const getSongDetail = (ids: number | string | number[] | string[] = "") => {
    return get("/song/detail", { params: { ids } });
};
export const getSongUrl = (id: number | string | number[] | string[] = "") => {
    return get("/song/url", { params: { id } });
};
export const likeMusic = (params: { id: number | string; like?: boolean }) => {
    return get("/like", { params: params || {} });
};
export const createPlayListApi = (params: { name: string; privacy?: string | number; type?: string }) => {
    return get("/playlist/create", { params: { ...params, t: Date.now() } });
};
export const addDelMusicFromListApi = (params: { pid: string; tracks: string; op?: string }) => {
    return get("/playlist/tracks", { params: { pid: params.pid, tracks: params.tracks, op: params.op ? params.op : "add", t: Date.now() } });
};
