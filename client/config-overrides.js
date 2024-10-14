module.exports = function override(config, env) {
  config.devServer = {
    ...config.devServer,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Add your custom middleware here if needed
      // middlewares.unshift(...);

      return middlewares;
    },
  };
  return config;
};
