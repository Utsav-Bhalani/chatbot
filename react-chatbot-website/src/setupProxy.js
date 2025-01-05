const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://cd986089-fdf9-4367-ab19-b478ea2c9d43-eu-west-1.apps.astra.datastax.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove "/api" from the request
      },
    })
  );
};
