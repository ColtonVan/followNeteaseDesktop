import { createStore } from 'vuex'

const store = createStore({
	state: {
		theme: "primaryTheme",
		fullScreen: false
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
		}
	},
	actions: {
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
