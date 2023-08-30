const webpack = require('webpack')


module.exports = {
    configureWebpack: {
        devServer: {
            port: 9091,
            proxy: {
                '/api': {
                    target: 'http://localhost:9091',
                    changeOrigin: true,
                    ws: true,
                    pathRewrite: {
                        '^/api': '/'
                    }
                }
            }
        },
        externals: {
            "BaiduMap":"BMap",
            // "BMap_Symbol_SHAPE_POINT":"BMap_Symbol_SHAPE_POINT"

        }
    },

    chainWebpack: config => {
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }])
    },


}