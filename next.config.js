const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

module.exports = (phase) => {
  let env = {};

  switch (phase) {
    case PHASE_DEVELOPMENT_SERVER:
      env = {
        httpsUri: "http://localhost:8080/graphql",
        wsUri: "ws://localhost:8080/subscriptions",
      };
      break;
    case PHASE_PRODUCTION_BUILD:
    default:
      env = {
        httpsUri: "https://mern-graphql-server.herokuapp.com/graphql",
        wsUri: "wss://mern-graphql-server.herokuapp.com/subscriptions",
      };
      break;
  }

  return {
    reactStrictMode: true,
    swcMinify: true,
    async redirects() {
      return [
        {
          source: "/",
          destination: "/home",
          permanent: true,
        },
      ];
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.mdx/,
        use: [
          options.defaultLoaders.babel,
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      });
      return config;
    },
    pageExtensions: ["p.tsx", "p.js"],
    env,
  };
};
