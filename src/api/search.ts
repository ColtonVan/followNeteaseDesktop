import AxiosIns from "@/utils/request";
export const getSearchHotDetail = ()=>{
    return AxiosIns.get("/search/hot/detail")
}
export const searchApi = keywords=>{
    return AxiosIns.get("/search",{params:{keywords}});
}
export const cloudsearchApi = keywords=>{
    return AxiosIns.get("/cloudsearch",{params:{keywords}});
}
export const multimatchSearch = keywords=>{
    return AxiosIns.get("/search/multimatch",{params:{keywords}});
}
export const searchSuggestApi = keywords=>{
    return AxiosIns.get("/search/suggest",{params:{keywords}});    
}