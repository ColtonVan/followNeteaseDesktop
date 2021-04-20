import { getAccountInfo, getUserDetail as getUserDetailForAPi, logout as logoutForApi } from '@/api/login';
import { AxiosResponseProps } from '@/utils/request';
import { createStore } from 'vuex'

const store = createStore({
	state: {
		theme: "primaryTheme",
		fullScreen: false,
		userInfo: {},
		userDetail: { profile: {} }
	},
	getters: {
		getTheme(state) {
			return state.theme;
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
			state.userInfo = val
		},
		changeUserDetail(state, val) {
			state.userDetail = val
		}
	},
	actions: {
		getUserInfo({ commit }, params) {
			getAccountInfo().then((res: any) => {
				if (res.code === 200) {
					commit("changeUserInfo", res.profile);
				}
			})
		},
		getUserDetail({ commit }, params) {
			getUserDetailForAPi().then((res: any) => {
				if (res.code === 200) {
					commit("changeUserDetail", res);
				}
			})
		},
		logout({ commit }, params) {
			logoutForApi().then((res: AxiosResponseProps) => {
				if (res.code === 200) {
					commit("changeUserInfo", {});
					commit("changeUserDetail", { profile: {} });
				}
			})
		}
	},
	modules: {
	}
})
export default store;
//主题持久化-读取
let localTheme = localStorage["theme"];
if (localTheme) {
	store.commit("changeTheme", localTheme);
}
