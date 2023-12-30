const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/api/**', { 
            target: process.env.BASEURL,
            secure:false,
            changeOrigin: true,
            pathRewrite: { '^/api': '' }
        }),
    )
}
