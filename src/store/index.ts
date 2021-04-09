import { createStore } from 'vuex'

export default createStore({
	state: {
		theme: "primaryTheme"
	},
	mutations: {
		changeTheme(state, val) {
			state.theme = val;
		}
	},
	actions: {
	},
	modules: {
	}
})
