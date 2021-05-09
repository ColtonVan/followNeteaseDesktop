import { getAccountInfo, getUserDetail as getUserDetailForAPi, logout as logoutForApi, getUserPlayList } from "@/api/login";
import { getSongUrlApi } from "@/api/song";
import { AxiosResponseProps } from "@/utils/request";
import { createStore } from "vuex";

const store = createStore({
    state: {
        theme: "primaryTheme",
        fullScreen: false,
        userInfo: {},
        userDetail: { profile: {} },
        isLoading: false,
        createdMusicList: [],
        routeFromList: [],
        currentMusicDetail: {},
        currentMusicUrlInfo: [],
        currentPlayList: [],
        isMusicPlaying: false,
        showPlayList: false
    },
    getters: {
        getTheme(state) {
            return state.theme;
        },
        getThemeColor(state) {
            switch (state.theme) {
                case "primaryTheme":
                    return "#ec4141";
                case "darkTheme":
                    return "#212529";
                case "freeTheme":
                    return "#50c475"
            }
        }
    },
    mutations: {
        changeTheme(state, val) {
            //主题持久化-设置
            localStorage["theme"] = val;
            state.theme = val;
        },
        changeFullScreen(state, val) {
            state.fullScreen = val;
        },
        changeUserInfo(state, val) {
            state.userInfo = val;
        },
        changeUserDetail(state, val) {
            state.userDetail = val;
        },
        changeIsLoading(state, val) {
            state.isLoading = val;
        },
        changeCreatedMusicList(state, val) {
            state.createdMusicList = val;
        },
        changeRouteFromList(state, val) {
            state.routeFromList = val;
        },
        changeCurrentMusicDetail(state, val) {
            localStorage["currentMusicDetail"] = JSON.stringify(val);
            state.currentMusicDetail = val;
        },
        changeCurrentMusicUrlInfo(state, val) {
            state.currentMusicUrlInfo = val;
        },
        changeIsMusicPlaying(state, val) {
            state.isMusicPlaying = val;
        },
        changeShowPlayList(state, val) {
            state.showPlayList = val;
        },
        changeCurrentPlayList(state, val) {
            localStorage["currentPlayList"] = JSON.stringify(val);
            state.currentPlayList = val;
        }
    },
    actions: {
        getUserInfo({ commit }, params) {
            getAccountInfo().then((res: any) => {
                if (res.code === 200) {
                    commit("changeUserInfo", res.profile);
                }
            });
        },
        async getUserDetail({ commit }, params) {
            return await getUserDetailForAPi().then((res: any) => {
                if (res.code === 200) {
                    commit("changeUserDetail", res);
                }
            });
        },
        logout({ commit }, params) {
            logoutForApi().then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    commit("changeUserInfo", {});
                    commit("changeUserDetail", { profile: {} });
                }
            });
        },
        async getCreatedMusicList({ commit }, params) {
            return await getUserPlayList().then((res: any) => {
                if (res.code === 200) {
                    commit("changeCreatedMusicList", res.playlist);
                }
            });
        },
        async getCurrentMusicUrlInfo({ commit }, params) {
            return await getSongUrlApi(params).then((res: any) => {
                if (res.code === 200) {
                    commit("changeCurrentMusicUrlInfo", res.data);
                    localStorage["currentMusicUrlInfo"] = JSON.stringify(res.data);
                    return res.data;
                }
            })
        }
    },
    modules: {},
});
export default store;
//主题持久化-读取
let localTheme = localStorage["theme"];
if (localTheme) {
    store.commit("changeTheme", localTheme);
}
//歌曲url持久化-读取
let localCurrentMusicUrlInfo = localStorage["currentMusicUrlInfo"];
if (localCurrentMusicUrlInfo) {
    store.commit("changeCurrentMusicUrlInfo", JSON.parse(localCurrentMusicUrlInfo));
}
//歌曲详情持久化-读取
let localCurrentMusicDetail = localStorage["currentMusicDetail"];
if (localCurrentMusicDetail) {
    store.commit("changeCurrentMusicDetail", JSON.parse(localCurrentMusicDetail));
}
//播放列表持久化-读取
let localCurrentPlayList = localStorage["currentPlayList"];
if (localCurrentPlayList) {
    store.commit("changeCurrentPlayList", JSON.parse(localCurrentPlayList));
}