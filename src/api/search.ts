import AxiosIns from "@/utils/request";
export const getSearchHotDetail = ()=>{
    return AxiosIns.get("/search/hot/detail")
}