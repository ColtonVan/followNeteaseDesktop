import { createStore } from 'vuex'

export default createStore({
	state: {
		theme: "primaryTheme",
		fullScreen: false
	},
	mutations: {
		changeTheme(state, val) {
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
