import { App } from "vue";
const context = require.context("@/components", true, /.vue$/)
export default {
    install(app: App) {
        context.keys().forEach(componentPath => {
            let splitPart1 = componentPath.split("/");
            app.component(splitPart1[splitPart1.length - 1].split(".vue")[0], context(componentPath).default);
        })
    }
}