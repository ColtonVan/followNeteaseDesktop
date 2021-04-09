
module.exports = {
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = '高仿网易云音乐win桌面端web版'
            return args
        })
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/style/index.scss";@import "@/assets/style/_variable.scss";`,
            },
        },
    }
}