import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import components from "@/plugins/components"
import "bootstrap/scss/bootstrap.scss"

createApp(App).use(router).use(components).use(store).mount('#app')
