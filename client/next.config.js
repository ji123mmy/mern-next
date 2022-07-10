/** @type {import('next').NextConfig} */
const nextConfig = {
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
  env: {
    serverUri: "https://strange-mind-351407.de.r.appspot.com/graphql",
  },
};

module.exports = nextConfig;
