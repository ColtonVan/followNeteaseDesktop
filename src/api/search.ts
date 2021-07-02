import AxiosIns from "@/utils/request";
export const getSearchHotDetail = () => {
    return AxiosIns.get("/search/hot/detail");
};
export const searchApi = keywords => {
    return AxiosIns.get("/search", { params: { keywords } });
};
export const cloudsearchApi = params => {
    return AxiosIns.get("/cloudsearch", { params });
};
export const multimatchSearch = keywords => {
    return AxiosIns.get("/search/multimatch", { params: { keywords } });
};
export const searchSuggestApi = params => {
    return AxiosIns.get("/search/suggest", { params });
};
